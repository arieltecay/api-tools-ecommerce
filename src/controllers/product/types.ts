export interface ProductQueryFilters {
  category?: string;
  brand?: string;
  status?: string;
  q?: string;
  isFeatured?: string;
}

export interface ProductPaginationQuery {
  page?: string;
  limit?: string;
}
