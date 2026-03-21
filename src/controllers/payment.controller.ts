import { Request, Response } from 'express';
import * as paymentService from '../services/payment.service';
import * as orderService from '../services/order.service';

export const processPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, token, bin, amount, installments, payment_method_id, description, email } = req.body;

    const paymentData: paymentService.IPaymentData = {
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
    } else {
      // Handle other statuses (rejected, review, etc.)
    }

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Payment controller error:', error);
    res.status(500).json({ message: error.message || 'Error processing payment' });
  }
};
