import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const DECIDIR_API_URL = process.env.DECIDIR_API_URL || 'https://sandbox.decidir.com/api/v2';
const DECIDIR_SECRET_KEY = process.env.DECIDIR_SECRET_KEY;

const api = axios.create({
  baseURL: DECIDIR_API_URL,
  headers: {
    'apikey': DECIDIR_SECRET_KEY,
    'Content-Type': 'application/json',
  },
});

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

export const processCardPayment = async (paymentData: IPaymentData) => {
  try {
    const response = await api.post('/payments', {
      ...paymentData,
      amount: Math.round(paymentData.amount * 100), // Decidir expects cents
    });
    return response.data;
  } catch (error: any) {
    console.error('Decidir payment error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error processing payment with Decidir');
  }
};

export const getPaymentStatus = async (paymentId: string) => {
  try {
    const response = await api.get(`/payments/${paymentId}`);
    return response.data;
  } catch (error: any) {
    console.error('Decidir status error:', error.response?.data || error.message);
    throw new Error('Error fetching payment status from Decidir');
  }
};
