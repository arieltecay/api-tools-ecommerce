import { IOrder, IOrderStatus, IPaymentMethod } from '../../models/order/types';

export interface AggregationResult {
  _id: string | null;
  [key: string]: string | number | null | undefined;
}

export interface TopItem {
  name: string;
  total: number;
  quantity: number;
}

export interface PaymentMethodSummary {
  method: IPaymentMethod;
  count: number;
  total: number;
}

export interface OrderStatusDistribution {
  status: IOrderStatus;
  count: number;
}

export interface DashboardStats {
  revenue: number;
  orders: number;
  avgTicket: number;
  revenueGrowth: number;
  ordersGrowth: number;
  avgTicketGrowth: number;
  recentOrders: Partial<IOrder>[]; 
  topProducts: TopItem[];
  topCategories: TopItem[];
  topBrands: TopItem[];
  paymentMethods: PaymentMethodSummary[];
  orderStatusDistribution: OrderStatusDistribution[];
}
