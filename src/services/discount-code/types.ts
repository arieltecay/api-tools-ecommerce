import { IDiscountCode } from '../../models/discount-code/types';

export interface ValidateDiscountResult {
  isValid: boolean;
  message: string;
  discountAmount: number;
  newTotal: number;
  code?: IDiscountCode;
}

export interface CreateDiscountCodeDTO {
  code: string;
  internalDescription?: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxUsageTotal?: number;
  maxUsagePerEmail?: number;
  validFrom: Date | string;
  validUntil?: Date | string;
  applicableCategories?: string[]; // IDs as strings from frontend
  isActive: boolean;
}
