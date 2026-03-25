export interface IPaymentData {
  token: string;
  payment_method_id: number;
  bin: string;
  amount: number;
  currency: string;
  installments: number;
  description: string;
  site_transaction_id: string;
  customer?: {
    id?: string;
    email: string;
  };
}

export interface DecidirErrorResponse {
  message: string;
}
