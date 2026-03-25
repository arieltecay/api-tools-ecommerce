import { Request, Response } from 'express';
import * as paymentService from '../../services/payment/payment.service';
import * as orderService from '../../services/order/order.service';
import { ProcessPaymentBody } from './types';

export const processPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, token, bin, amount, installments, payment_method_id, description, email } = req.body as ProcessPaymentBody;

    const paymentData = {
      token,
      bin,
      amount,
      payment_method_id,
      installments: installments || 1,
      currency: 'ARS',
      description: description || `Order ${orderId}`,
      site_transaction_id: orderId,
      customer: { email }
    };

    const result = await paymentService.processCardPayment(paymentData);

    // Update order status based on payment result
    if (result.status === 'approved') {
      await orderService.updateOrderStatus(orderId, {
        status: 'confirmed',
        paymentStatus: 'confirmed',
        changedBy: 'system',
        note: 'Pago aprobado vía Decidir'
      });
    }

    res.status(200).json(result);
  } catch (error: unknown) {
    console.error('Payment controller error:', error);
    const message = error instanceof Error ? error.message : 'Error al procesar el pago';
    res.status(500).json({ message });
  }
};
