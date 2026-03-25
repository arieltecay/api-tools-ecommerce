import { Document, Types } from 'mongoose';

export type IOrderStatus = 'pending_payment' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' | 'return_requested';
export type IPaymentMethod = 'card' | 'bank_transfer';
export type IPaymentStatus = 'pending' | 'confirmed' | 'rejected';

export interface IOrderItem {
  product: {
    _id: Types.ObjectId;
    uuid: string;
    sku: string;
    name: string;
    primaryImageUrl: string;
  };
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  status: IOrderStatus;
  statusHistory: {
    status: string;
    changedBy: string;
    changedAt: Date;
    note?: string;
  }[];
  customer: {
    fullName: string;
    email: string;
    phone: string;
    idNumber?: string;
    customerId?: Types.ObjectId;
  };
  shippingAddress: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  items: IOrderItem[];
  pricing: {
    subtotal: number;
    discountCode?: string;
    discountAmount: number;
    shippingCost: number;
    total: number;
  };
  shipping: {
    method?: string;
    carrier?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    estimatedDelivery?: Date;
    shippedAt?: Date;
    deliveredAt?: Date;
    pickupLocation?: string;
  };
  payment: {
    method: IPaymentMethod;
    gateway?: string;
    status: IPaymentStatus;
    gatewayTransactionId?: string;
    installments?: number;
    confirmedBy?: Types.ObjectId;
    confirmedAt?: Date;
    paidAt?: Date;
  };
  whatsappConsent: boolean;
  source: 'storefront' | 'manual';
  createdAt: Date;
  updatedAt: Date;
}
