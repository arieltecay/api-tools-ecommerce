import { IOrderStatus, IPaymentStatus, IPaymentMethod } from '../../models/order/types';

export interface CreateOrderDTO {
  customer: {
    fullName: string;
    email: string;
    phone: string;
    idNumber?: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  items: {
    product: {
      _id: string;
      uuid: string;
      sku: string;
      name: string;
      primaryImageUrl: string;
    };
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  pricing: {
    subtotal: number;
    discountCode?: string;
    discountAmount: number;
    shippingCost: number;
    total: number;
  };
  payment: {
    method: IPaymentMethod;
  };
  whatsappConsent: boolean;
  source?: 'storefront' | 'manual';
}

export interface OrderFilters {
  status?: IOrderStatus;
  email?: string;
  q?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface UpdateOrderStatusDTO {
  status?: IOrderStatus;
  paymentStatus?: IPaymentStatus;
  paymentMethod?: IPaymentMethod;
  changedBy: string;
  note?: string;
}
