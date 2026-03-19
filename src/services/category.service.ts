import Category from '../models/category.model';
import { ICategory } from '../models/types';
import { FilterQuery } from 'mongoose';

export const getAllCategories = async (query: FilterQuery<ICategory> = {}): Promise<ICategory[]> => {
  return await Category.find({ ...query, isActive: true });
};

export const getCategoryById = async (id: string): Promise<ICategory | null> => {
  return await Category.findById(id);
};

export const createCategory = async (data: Partial<ICategory>): Promise<ICategory> => {
  const category = new Category(data);
  return await category.save();
};

export const updateCategory = async (id: string, data: Partial<ICategory>): Promise<ICategory | null> => {
  return await Category.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCategory = async (id: string): Promise<ICategory | null> => {
  return await Category.findByIdAndUpdate(id, { isActive: false }, { new: true });
};
