import DiscountCode from '../../models/discount-code/discount-code.model';
import { IDiscountCode } from '../../models/discount-code/types';
import mongoose, { Types } from 'mongoose';
import { ValidateDiscountResult, CreateDiscountCodeDTO } from './types';

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

export const createDiscountCode = async (data: CreateDiscountCodeDTO, userId: string): Promise<IDiscountCode> => {
  const creationData: Partial<IDiscountCode> = { 
    ...data,
    validFrom: new Date(data.validFrom),
    validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
    createdBy: new Types.ObjectId(userId),
    usageCount: 0,
    applicableCategories: [] 
  };

  if (Array.isArray(data.applicableCategories)) {
    creationData.applicableCategories = data.applicableCategories
      .filter((id: string) => Types.ObjectId.isValid(id))
      .map((id: string) => new Types.ObjectId(id));
  }

  const discountCode = new DiscountCode(creationData);
  return await discountCode.save();
};

export const getAllDiscountCodes = async (): Promise<IDiscountCode[]> => {
  return await DiscountCode.find().sort({ createdAt: -1 });
};
