import mongoose, { Schema } from 'mongoose';
import { ISupplier } from './types';

const supplierSchema = new Schema<ISupplier>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  taxId: {
    type: String,
    unique: true,
    required: true
  },
  contact: {
    phone: String,
    email: String
  },
  defaultPaymentTerms: String,
  notes: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Supplier = mongoose.model<ISupplier>('Supplier', supplierSchema);

export default Supplier;
