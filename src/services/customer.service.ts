import Customer from '../models/customer.model';
import { ICustomer } from '../models/types';

export const getAllCustomers = async (filters: any = {}, options: any = {}): Promise<{ customers: ICustomer[], total: number }> => {
  const { page = 1, limit = 20 } = options;
  const query: any = { isActive: true };
  
  if (filters.email) query.email = new RegExp(filters.email, 'i');
  if (filters.origin) query.origin = filters.origin;

  const customers = await Customer.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Customer.countDocuments(query);

  return { customers, total };
};

export const getCustomerById = async (id: string): Promise<ICustomer | null> => {
  return await Customer.findById(id).populate('orders');
};

export const getCustomerByEmail = async (email: string): Promise<ICustomer | null> => {
  return await Customer.findOne({ email });
};

export const createCustomer = async (data: Partial<ICustomer>): Promise<ICustomer> => {
  const customer = new Customer(data);
  return await customer.save();
};

export const updateCustomer = async (id: string, data: Partial<ICustomer>): Promise<ICustomer | null> => {
  return await Customer.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCustomer = async (id: string): Promise<ICustomer | null> => {
  return await Customer.findByIdAndUpdate(id, { isActive: false }, { new: true });
};
