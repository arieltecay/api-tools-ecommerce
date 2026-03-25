import Category from '../../models/category/category.model';
import { ICategory } from '../../models/category/types';
import { CategoryFilters } from './types';

export const createCategory = async (data: Partial<ICategory>): Promise<ICategory> => {
  const category = new Category(data);
  return await category.save();
};

export const getAllCategories = async (filters: CategoryFilters = {}): Promise<ICategory[]> => {
  const query: any = {};
  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive;
  }
  return await Category.find(query).populate('parent');
};

export const getCategoryById = async (id: string): Promise<ICategory | null> => {
  return await Category.findById(id).populate('parent');
};

export const updateCategory = async (id: string, data: Partial<ICategory>): Promise<ICategory | null> => {
  return await Category.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCategory = async (id: string): Promise<ICategory | null> => {
  return await Category.findByIdAndDelete(id);
};
