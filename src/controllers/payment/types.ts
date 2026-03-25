export interface ProcessPaymentBody {
  orderId: string;
  token: string;
  bin: string;
  amount: number;
  installments?: number;
  payment_method_id: number;
  description?: string;
  email: string;
}
