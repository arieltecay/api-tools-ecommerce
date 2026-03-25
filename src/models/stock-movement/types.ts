import { Document, Types } from 'mongoose';

export interface IStockMovement extends Document {
  product: {
    _id: Types.ObjectId;
    uuid: string;
    sku: string;
    name: string;
  };
  type: 'purchase' | 'sale' | 'adjustment' | 'return';
  quantity: number;
  reason?: string;
  reference?: {
    type: 'invoice' | 'order' | 'manual';
    id: Types.ObjectId;
  };
  stockAfter: number;
  createdBy?: Types.ObjectId;
  createdAt: Date;
}
