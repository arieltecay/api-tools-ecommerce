import PurchaseInvoice from '../../models/purchase-invoice/purchase-invoice.model';
import Product from '../../models/product/product.model';
import { IPurchaseInvoice } from '../../models/purchase-invoice/types';
import * as stockMovementService from '../stock-movement/stock-movement.service';
import mongoose, { FilterQuery, Types } from 'mongoose';
import { PurchaseInvoiceDTO, PurchaseInvoiceFilters, PaginationOptions } from './types';

export const createPurchaseInvoice = async (invoiceData: PurchaseInvoiceDTO, userId: string): Promise<IPurchaseInvoice> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const invoice = new PurchaseInvoice({
      ...invoiceData,
      supplier: {
        _id: new Types.ObjectId(invoiceData.supplier._id),
      },
      invoiceDate: new Date(invoiceData.invoiceDate),
      createdBy: new Types.ObjectId(userId)
    });

    await invoice.save({ session });

    // Update Stock for each item
    for (const item of invoiceData.items) {
      const product = await Product.findById(item.product._id).session(session);
      if (!product) throw new Error(`Producto ${item.product.name} no encontrado`);

      product.stock += item.quantity;
      product.costPrice = item.unitCost; 
      if (product.status === 'out_of_stock' && product.stock > 0) {
        product.status = 'active';
      }

      await product.save({ session });

      // Record stock movement
      await stockMovementService.createStockMovement({
        product: {
          _id: product._id as Types.ObjectId,
          uuid: product.uuid,
          sku: product.sku,
          name: product.name
        },
        type: 'purchase',
        quantity: item.quantity,
        reference: { type: 'invoice', id: invoice._id as Types.ObjectId },
        stockAfter: product.stock,
        createdBy: new Types.ObjectId(userId)
      }, { session });
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

export const getAllPurchaseInvoices = async (filters: PurchaseInvoiceFilters = {}, options: PaginationOptions = {}): Promise<{ invoices: IPurchaseInvoice[], total: number }> => {
  const { page = 1, limit = 20 } = options;
  const query: FilterQuery<IPurchaseInvoice> = {};
  if (filters.supplierId) {
    query['supplier._id'] = new Types.ObjectId(filters.supplierId);
  }

  const invoices = await PurchaseInvoice.find(query)
    .sort({ invoiceDate: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await PurchaseInvoice.countDocuments(query);
  return { invoices, total };
};
