import mongoose, { Schema } from 'mongoose';
import { IOrder } from './types';

const orderSchema = new Schema<IOrder>({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending_payment', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'return_requested'],
    default: 'pending_payment'
  },
  statusHistory: [{
    status: String,
    changedBy: String,
    changedAt: { type: Date, default: Date.now },
    note: String
  }],
  customer: {
    fullName: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    idNumber: String,
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' }
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: String, required: true }
  },
  items: [{
    product: {
      _id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      uuid: String,
      sku: String,
      name: String,
      primaryImageUrl: String
    },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    subtotal: { type: Number, required: true }
  }],
  pricing: {
    subtotal: { type: Number, required: true },
    discountCode: String,
    discountAmount: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  shipping: {
    method: String,
    carrier: String,
    trackingNumber: String,
    trackingUrl: String,
    estimatedDelivery: Date,
    shippedAt: Date,
    deliveredAt: Date,
    pickupLocation: String
  },
  payment: {
    method: { type: String, enum: ['card', 'bank_transfer'], required: true },
    gateway: String,
    status: { type: String, enum: ['pending', 'confirmed', 'rejected'], default: 'pending' },
    gatewayTransactionId: String,
    installments: Number,
    confirmedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    confirmedAt: Date,
    paidAt: Date
  },
  whatsappConsent: { type: Boolean, default: false },
  source: { type: String, enum: ['storefront', 'manual'], default: 'storefront' }
}, {
  timestamps: true
});

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
