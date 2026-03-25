import { Response, Request } from 'express';
import * as orderService from '../../services/order/order.service';
import { RequestWithUser } from '../../middleware/auth.middleware';
import { OrderQueryFilters, OrderPaginationQuery, UpdateOrderBody } from './types';

export const create = async (req: Request, res: Response) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error creating order';
    res.status(400).json({ message });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const query = req.query as OrderQueryFilters & OrderPaginationQuery;
    
    const filters = {
      status: query.status,
      email: query.email,
      q: query.q
    };

    const options = {
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20
    };
    const result = await orderService.getAllOrders(filters, options);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error fetching orders';
    res.status(500).json({ message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error fetching order';
    res.status(500).json({ message });
  }
};

export const updateStatus = async (req: RequestWithUser, res: Response) => {
  try {
    const { status, paymentStatus, paymentMethod, note } = req.body as UpdateOrderBody;
    const changedBy = req.user?._id?.toString() || 'system';
    
    const order = await orderService.updateOrderStatus(req.params.id, {
      status,
      paymentStatus,
      paymentMethod,
      changedBy,
      note
    });

    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.json(order);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al actualizar el pedido';
    res.status(400).json({ message });
  }
};
