export interface StockMovementFilters {
  productId?: string;
  type?: 'purchase' | 'sale' | 'adjustment' | 'return';
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}
