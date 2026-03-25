export interface ImportResult {
  successCount: number;
  errorCount: number;
  errors: { row: number; error: string }[];
}

export interface ProductImportRow {
  sku: string;
  name: string;
  slug: string;
  categoryName: string;
  brandName: string;
  costPrice: number;
  price: number;
  stock: number;
  minStock: number;
  shortDescription: string;
  status: 'active' | 'paused' | 'draft' | 'out_of_stock';
}
