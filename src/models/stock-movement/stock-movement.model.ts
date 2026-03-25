import mongoose, { Schema } from 'mongoose';
import { IStockMovement } from './types';

const stockMovementSchema = new Schema<IStockMovement>({
  product: {
    _id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    uuid: String,
    sku: String,
    name: String
  },
  type: {
    type: String,
    enum: ['purchase', 'sale', 'adjustment', 'return'],
    required: true
  },
  quantity: { type: Number, required: true },
  reason: String,
  reference: {
    type: { type: String, enum: ['invoice', 'order', 'manual'] },
    id: Schema.Types.ObjectId
  },
  stockAfter: { type: Number, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

const StockMovement = mongoose.model<IStockMovement>('StockMovement', stockMovementSchema);

export default StockMovement;
