import Customer from '../../models/customer/customer.model';
import { ICustomer } from '../../models/customer/types';
import { FilterQuery } from 'mongoose';
import { CustomerFilters, PaginationOptions } from './types';

export const createCustomer = async (data: Partial<ICustomer>): Promise<ICustomer> => {
  const customer = new Customer(data);
  return await customer.save();
};

export const getAllCustomers = async (filters: CustomerFilters = {}, options: PaginationOptions = {}): Promise<{ customers: ICustomer[], total: number }> => {
  const { page = 1, limit = 20 } = options;
  const query: FilterQuery<ICustomer> = {};

  if (filters.q) {
    const searchRegex = new RegExp(filters.q, 'i');
    query.$or = [
      { fullName: searchRegex },
      { email: searchRegex },
      { phone: searchRegex }
    ];
  }

  const customers = await Customer.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Customer.countDocuments(query);
  return { customers, total };
};

export const getCustomerById = async (id: string): Promise<ICustomer | null> => {
  return await Customer.findById(id);
};

export const updateCustomer = async (id: string, data: Partial<ICustomer>): Promise<ICustomer | null> => {
  return await Customer.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCustomer = async (id: string): Promise<ICustomer | null> => {
  return await Customer.findByIdAndDelete(id);
};
