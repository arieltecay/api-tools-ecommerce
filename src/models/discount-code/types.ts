import { Document, Types } from 'mongoose';

export interface IDiscountCode extends Document {
  code: string;
  internalDescription?: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxUsageTotal?: number;
  maxUsagePerEmail?: number;
  usageCount: number;
  usageLog: {
    email: string;
    orderId: Types.ObjectId;
    usedAt: Date;
  }[];
  validFrom: Date;
  validUntil?: Date;
  applicableCategories: Types.ObjectId[];
  isActive: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
