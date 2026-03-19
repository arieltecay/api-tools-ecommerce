import mongoose, { Schema } from 'mongoose';
import { IDiscountCode } from './types';

const discountCodeSchema = new Schema<IDiscountCode>({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  internalDescription: String,
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  minOrderAmount: {
    type: Number,
    default: null
  },
  maxUsageTotal: {
    type: Number,
    default: null
  },
  maxUsagePerEmail: {
    type: Number,
    default: null
  },
  usageCount: {
    type: Number,
    default: 0
  },
  usageLog: [{
    email: String,
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    usedAt: { type: Date, default: Date.now }
  }],
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date,
    default: null
  },
  applicableCategories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'AdminUser'
  }
}, {
  timestamps: true
});

const DiscountCode = mongoose.model<IDiscountCode>('DiscountCode', discountCodeSchema);

export default DiscountCode;
