import Order from '../../models/order/order.model';
import Product from '../../models/product/product.model';
import Customer from '../../models/customer/customer.model';
import { IOrder } from '../../models/order/types';
import { ISettings } from '../../models/settings/types';
import mongoose, { FilterQuery } from 'mongoose';
import { sendEmail } from '../email/email.service';
import { EmailVariables } from '../email/types';
import * as settingsService from '../settings/settings.service';
import { CreateOrderDTO, OrderFilters, PaginationOptions, UpdateOrderStatusDTO } from './types';

const generateOrderNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${year}${month}${day}-${random}`;
};

export const createOrder = async (orderData: CreateOrderDTO): Promise<IOrder> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const settings: ISettings = await settingsService.getSettings();
    const orderNumber = generateOrderNumber();
    
    const initialStatus = orderData.payment.method === 'bank_transfer' ? 'pending_payment' : 'confirmed';

    // RECALCULATE PRICES FROM DATABASE (Safety First)
    let subtotal = 0;
    const validatedItems = [];

    for (const item of orderData.items) {
      const dbProduct = await Product.findById(item.product._id).session(session);
      if (!dbProduct) throw new Error(`Producto ${item.product.name} no encontrado.`);
      
      const unitPrice = dbProduct.price;
      const itemSubtotal = unitPrice * item.quantity;
      subtotal += itemSubtotal;

      validatedItems.push({
        ...item,
        unitPrice,
        subtotal: itemSubtotal
      });
    }

    const total = subtotal + (orderData.pricing.shippingCost || 0) - (orderData.pricing.discountAmount || 0);

    const order = new Order({
      ...orderData,
      items: validatedItems,
      pricing: {
        ...orderData.pricing,
        subtotal,
        total
      },
      orderNumber,
      status: initialStatus,
      statusHistory: [{
        status: initialStatus,
        changedBy: 'system',
        note: 'Pedido creado y precios validados.'
      }]
    });

    await order.save({ session });

    // 1. Update Stock
    for (const item of orderData.items) {
      const product = await Product.findById(item.product._id).session(session);
      if (!product) throw new Error(`Product ${item.product.name} not found`);
      
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      product.stock -= item.quantity;
      product.salesCount += item.quantity;
      if (product.stock === 0) product.status = 'out_of_stock';
      
      await product.save({ session });
    }

    // 2. Link or create Customer
    let customer = await Customer.findOne({ email: orderData.customer.email }).session(session);
    if (customer) {
      customer.orders.push(order._id as mongoose.Types.ObjectId);
      customer.ordersCount += 1;
      customer.totalSpent += orderData.pricing.total;
      customer.lastOrderAt = new Date();
      await customer.save({ session });
      
      order.customer.customerId = customer._id as mongoose.Types.ObjectId;
      await order.save({ session });
    } else {
      const newCustomer = new Customer({
        fullName: orderData.customer.fullName,
        email: orderData.customer.email,
        phone: orderData.customer.phone,
        origin: orderData.source === 'manual' ? 'manual' : 'online',
        orders: [order._id],
        ordersCount: 1,
        totalSpent: orderData.pricing.total,
        lastOrderAt: new Date()
      });
      await newCustomer.save({ session });
      
      order.customer.customerId = newCustomer._id as mongoose.Types.ObjectId;
      await order.save({ session });
    }

    await session.commitTransaction();

    // Trigger email notification
    try {
      if (order.payment.method === 'bank_transfer') {
        const emailVars: EmailVariables = {
          buyerName: order.customer.fullName,
          orderNumber: order.orderNumber,
          orderTotal: order.pricing.total.toLocaleString(),
          holderName: settings.payment.bankTransfer.holderName,
          bank: settings.payment.bankTransfer.bank,
          cbu: settings.payment.bankTransfer.cbu,
          alias: settings.payment.bankTransfer.alias,
          taxId: settings.payment.bankTransfer.taxId,
          additionalInstructions: settings.payment.bankTransfer.additionalInstructions || '',
          storeName: settings.store.name
        };
        await sendEmail(
          order.customer.email,
          `Tu pedido #${order.orderNumber} está confirmado — instrucciones de pago`,
          'bank-transfer-instructions',
          emailVars
        );
      } else if (order.payment.method === 'card' && order.status === 'confirmed') {
        const emailVars: EmailVariables = {
          buyerName: order.customer.fullName,
          orderNumber: order.orderNumber,
          orderTotal: order.pricing.total.toLocaleString(),
          storeName: settings.store.name
        };
        await sendEmail(
          order.customer.email,
          `¡Gracias por tu compra! Pedido #${order.orderNumber}`,
          'order-confirmation-card',
          emailVars
        );
      }
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
    }

    return order;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getAllOrders = async (filters: OrderFilters = {}, options: PaginationOptions = {}): Promise<{ orders: IOrder[], total: number }> => {
  const { page = 1, limit = 20 } = options;
  const query: FilterQuery<IOrder> = {}; 
  
  if (filters.status) {
    query.status = filters.status;
  }
  
  if (filters.q) {
    const searchRegex = new RegExp(filters.q, 'i');
    query.$or = [
      { orderNumber: searchRegex },
      { 'customer.fullName': searchRegex },
      { 'customer.email': searchRegex }
    ];
  }

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Order.countDocuments(query);
  return { orders, total };
};

export const getOrderById = async (id: string): Promise<IOrder | null> => {
  return await Order.findById(id);
};

export const updateOrderStatus = async (id: string, updateData: UpdateOrderStatusDTO): Promise<IOrder | null> => {
  const order = await Order.findById(id);
  if (!order) return null;

  if (updateData.status) {
    order.status = updateData.status;
    order.statusHistory.push({
      status: updateData.status,
      changedBy: updateData.changedBy,
      changedAt: new Date(),
      note: updateData.note
    });
  }

  if (updateData.paymentStatus) {
    order.payment.status = updateData.paymentStatus;
    if (updateData.paymentStatus === 'confirmed' && !order.payment.paidAt) {
      order.payment.paidAt = new Date();
    }
  }

  if (updateData.paymentMethod) {
    order.payment.method = updateData.paymentMethod;
  }

  return await order.save();
};
