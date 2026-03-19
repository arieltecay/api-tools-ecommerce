import Supplier from '../models/supplier.model';
import { ISupplier } from '../models/types';

export const getAllSuppliers = async (): Promise<ISupplier[]> => {
  return await Supplier.find({ isActive: true }).sort({ name: 1 });
};

export const getSupplierById = async (id: string): Promise<ISupplier | null> => {
  return await Supplier.findById(id);
};

export const createSupplier = async (data: Partial<ISupplier>): Promise<ISupplier> => {
  const supplier = new Supplier(data);
  return await supplier.save();
};

export const updateSupplier = async (id: string, data: Partial<ISupplier>): Promise<ISupplier | null> => {
  return await Supplier.findByIdAndUpdate(id, data, { new: true });
};

export const deleteSupplier = async (id: string): Promise<ISupplier | null> => {
  return await Supplier.findByIdAndUpdate(id, { isActive: false }, { new: true });
};
