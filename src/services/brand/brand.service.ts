import Brand from '../../models/brand/brand.model';
import { IBrand } from '../../models/brand/types';
import { BrandFilters } from './types';

export const createBrand = async (data: Partial<IBrand>): Promise<IBrand> => {
  const brand = new Brand(data);
  return await brand.save();
};

export const getAllBrands = async (filters: BrandFilters = {}): Promise<IBrand[]> => {
  const query: any = {};
  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive;
  }
  return await Brand.find(query).sort({ name: 1 });
};

export const getBrandById = async (id: string): Promise<IBrand | null> => {
  return await Brand.findById(id);
};

export const updateBrand = async (id: string, data: Partial<IBrand>): Promise<IBrand | null> => {
  return await Brand.findByIdAndUpdate(id, data, { new: true });
};

export const deleteBrand = async (id: string): Promise<IBrand | null> => {
  return await Brand.findByIdAndDelete(id);
};
