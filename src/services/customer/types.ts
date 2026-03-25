import { ICustomer } from '../../models/customer/types';

export interface CustomerFilters {
  q?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}
