import { IProduct } from '../../models/product/types';

export interface ProductFilters {
  category?: string;
  brand?: string;
  status?: string;
  q?: string;
  isFeatured?: boolean;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}
