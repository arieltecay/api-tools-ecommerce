import { IPurchaseInvoice } from '../../models/purchase-invoice/types';

export interface PurchaseInvoiceItemDTO {
  product: {
    _id: string;
    name: string; 
  };
  quantity: number;
  unitCost: number;
}

export interface PurchaseInvoiceDTO {
  invoiceNumber: string;
  invoiceDate: Date | string;
  supplier: {
    _id: string;
  };
  invoiceType: 'A' | 'B' | 'C' | 'delivery_note';
  paymentTerms: 'cash' | '30_days' | '60_days';
  items: PurchaseInvoiceItemDTO[];
  totalAmount: number;
  attachmentUrl?: string;
  notes?: string;
}

export interface PurchaseInvoiceFilters {
  supplierId?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}
