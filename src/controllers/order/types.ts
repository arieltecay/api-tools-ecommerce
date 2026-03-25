import { IOrderStatus, IPaymentMethod, IPaymentStatus } from '../../models/order/types';

export interface OrderQueryFilters {
  status?: IOrderStatus;
  email?: string;
  q?: string;
}

export interface OrderPaginationQuery {
  page?: string;
  limit?: string;
}

export interface UpdateOrderBody {
  status?: IOrderStatus;
  paymentStatus?: IPaymentStatus;
  paymentMethod?: IPaymentMethod;
  note?: string;
}
