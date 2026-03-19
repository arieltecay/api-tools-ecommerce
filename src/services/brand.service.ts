import Brand from '../models/brand.model';
import { IBrand } from '../models/types';
import { FilterQuery } from 'mongoose';

export const getAllBrands = async (query: FilterQuery<IBrand> = {}): Promise<IBrand[]> => {
  return await Brand.find({ ...query, isActive: true });
};

export const getBrandById = async (id: string): Promise<IBrand | null> => {
  return await Brand.findById(id);
};

export const createBrand = async (data: Partial<IBrand>): Promise<IBrand> => {
  const brand = new Brand(data);
  return await brand.save();
};

export const updateBrand = async (id: string, data: Partial<IBrand>): Promise<IBrand | null> => {
  return await Brand.findByIdAndUpdate(id, data, { new: true });
};

export const deleteBrand = async (id: string): Promise<IBrand | null> => {
  return await Brand.findByIdAndUpdate(id, { isActive: false }, { new: true });
};
