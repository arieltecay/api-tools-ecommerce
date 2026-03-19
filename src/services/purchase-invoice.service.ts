import PurchaseInvoice from '../models/purchase-invoice.model';
import Product from '../models/product.model';
import { IPurchaseInvoice } from '../models/types';
import * as stockMovementService from './stock-movement.service';
import mongoose from 'mongoose';

export const createPurchaseInvoice = async (invoiceData: any, userId: string): Promise<IPurchaseInvoice> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const invoice = new PurchaseInvoice({
      ...invoiceData,
      createdBy: userId
    });

    await invoice.save({ session });

    // Update Stock for each item
    for (const item of invoiceData.items) {
      const product = await Product.findById(item.product._id).session(session);
      if (!product) throw new Error(`Product ${item.product.name} not found`);

      product.stock += item.quantity;
      product.costPrice = item.unitCost;
      if (product.status === 'out_of_stock' && product.stock > 0) {
        product.status = 'active';
      }

      await product.save({ session });

      // Record stock movement
      await stockMovementService.createStockMovement({
        product: {
          _id: product._id as any,
          uuid: product.uuid,
          sku: product.sku,
          name: product.name
        },
        type: 'purchase',
        quantity: item.quantity,
        reference: { type: 'invoice', id: invoice._id as any },
        stockAfter: product.stock,
        createdBy: userId as any
      });
    }

    await session.commitTransaction();
    return invoice;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getAllPurchaseInvoices = async (filters: any = {}, options: any = {}): Promise<{ invoices: IPurchaseInvoice[], total: number }> => {
  const { page = 1, limit = 20 } = options;
  const query: any = {};
  if (filters.supplierId) query['supplier._id'] = filters.supplierId;

  const invoices = await PurchaseInvoice.find(query)
    .sort({ invoiceDate: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await PurchaseInvoice.countDocuments(query);
  return { invoices, total };
};
