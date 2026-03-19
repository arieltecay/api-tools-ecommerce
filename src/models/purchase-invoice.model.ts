import mongoose, { Schema } from 'mongoose';
import { IPurchaseInvoice } from './types';

const purchaseInvoiceSchema = new Schema<IPurchaseInvoice>({
  invoiceNumber: { type: String, required: true },
  invoiceDate: { type: Date, required: true },
  supplier: {
    _id: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    name: String
  },
  invoiceType: {
    type: String,
    enum: ['A', 'B', 'C', 'delivery_note'],
    required: true
  },
  paymentTerms: {
    type: String,
    enum: ['cash', '30_days', '60_days'],
    default: 'cash'
  },
  items: [{
    product: {
      _id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      uuid: String,
      sku: String,
      name: String
    },
    quantity: { type: Number, required: true },
    unitCost: { type: Number, required: true },
    subtotal: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  attachmentUrl: String,
  notes: String,
  createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' }
}, {
  timestamps: true
});

purchaseInvoiceSchema.index({ invoiceNumber: 1, 'supplier._id': 1 }, { unique: true });

const PurchaseInvoice = mongoose.model<IPurchaseInvoice>('PurchaseInvoice', purchaseInvoiceSchema);

export default PurchaseInvoice;
