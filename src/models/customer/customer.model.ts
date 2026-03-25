import mongoose, { Schema } from 'mongoose';
import { ICustomer } from './types';

const customerSchema = new Schema<ICustomer>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String, required: true },
  idNumber: String,
  defaultAddress: {
    street: String,
    city: String,
    province: String,
    postalCode: String
  },
  origin: {
    type: String,
    enum: ['online', 'manual'],
    default: 'online'
  },
  whatsappConsent: { type: Boolean, default: false },
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  ordersCount: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  lastOrderAt: Date,
  internalNotes: String,
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

const Customer = mongoose.model<ICustomer>('Customer', customerSchema);

export default Customer;
