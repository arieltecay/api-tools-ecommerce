import DiscountCode from '../models/discount-code.model';
import { IDiscountCode } from '../models/types';
import mongoose from 'mongoose';

export interface ValidateDiscountResult {
  isValid: boolean;
  message: string;
  discountAmount: number;
  newTotal: number;
  code?: IDiscountCode;
}

export const validateDiscountCode = async (code: string, email: string, orderAmount: number): Promise<ValidateDiscountResult> => {
  const discount = await DiscountCode.findOne({ code, isActive: true });
  
  if (!discount) {
    return { isValid: false, message: 'Código de descuento no encontrado', discountAmount: 0, newTotal: orderAmount };
  }

  // Check for expiration using validUntil
  if (discount.validUntil && new Date() > discount.validUntil) {
    return { isValid: false, message: 'El código ha expirado', discountAmount: 0, newTotal: orderAmount };
  }

  // Check usage limit
  if (discount.maxUsageTotal && discount.usageCount >= discount.maxUsageTotal) {
    return { isValid: false, message: 'El código ha alcanzado su límite de uso', discountAmount: 0, newTotal: orderAmount };
  }

  // Check min order amount
  if (discount.minOrderAmount && orderAmount < discount.minOrderAmount) {
    return { isValid: false, message: `Compra mínima requerida: $${discount.minOrderAmount}`, discountAmount: 0, newTotal: orderAmount };
  }

  let discountAmount = 0;
  if (discount.type === 'percentage') {
    discountAmount = (orderAmount * discount.value) / 100;
  } else {
    discountAmount = discount.value;
  }

  return {
    isValid: true,
    message: 'Código aplicado correctamente',
    discountAmount,
    newTotal: orderAmount - discountAmount,
    code: discount
  };
};

export const createDiscountCode = async (data: Partial<IDiscountCode>, userId: string): Promise<IDiscountCode> => {
  const discountCode = new DiscountCode({ ...data, createdBy: new mongoose.Types.ObjectId(userId) });
  return await discountCode.save();
};

export const getAllDiscountCodes = async (): Promise<IDiscountCode[]> => {
  return await DiscountCode.find().sort({ createdAt: -1 });
};
