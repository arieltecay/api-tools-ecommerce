export interface StockQueryFilters {
  productId?: string;
  type?: 'purchase' | 'sale' | 'adjustment' | 'return';
  page?: string;
  limit?: string;
}
