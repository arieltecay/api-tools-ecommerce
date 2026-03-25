import { Document, Types } from 'mongoose';

export interface IPurchaseInvoice extends Document {
  invoiceNumber: string;
  invoiceDate: Date;
  supplier: {
    _id: Types.ObjectId;
    name: string;
  };
  invoiceType: 'A' | 'B' | 'C' | 'delivery_note';
  paymentTerms: 'cash' | '30_days' | '60_days';
  items: {
    product: {
      _id: Types.ObjectId;
      uuid: string;
      sku: string;
      name: string;
    };
    quantity: number;
    unitCost: number;
    subtotal: number;
  }[];
  totalAmount: number;
  attachmentUrl?: string;
  notes?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
