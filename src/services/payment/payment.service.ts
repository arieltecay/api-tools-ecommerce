import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';
import { IPaymentData, DecidirErrorResponse } from './types';

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

export const processCardPayment = async (paymentData: IPaymentData) => {
  try {
    const response = await api.post('/payments', {
      ...paymentData,
      amount: Math.round(paymentData.amount * 100), // Decidir expects cents
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<DecidirErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || 'Error processing payment with Decidir';
      console.error('Decidir payment error:', axiosError.response?.data || axiosError.message);
      throw new Error(errorMessage);
    }
    console.error('Unknown payment error:', error);
    throw new Error('An unknown error occurred while processing the payment');
  }
};

export const getPaymentStatus = async (paymentId: string) => {
  try {
    const response = await api.get(`/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<DecidirErrorResponse>;
      const errorMessage = 'Error fetching payment status from Decidir';
      console.error('Decidir status error:', axiosError.response?.data || axiosError.message);
      throw new Error(errorMessage);
    }
    console.error('Unknown status fetch error:', error);
    throw new Error('An unknown error occurred while fetching payment status');
  }
};
