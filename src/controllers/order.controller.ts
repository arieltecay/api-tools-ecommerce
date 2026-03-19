import { Response, Request } from 'express';
import * as orderService from '../services/order.service';
import { RequestWithUser } from '../middleware/auth.middleware';

export const create = async (req: Request, res: Response) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error creating order';
    res.status(400).json({ message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const filters = {
      status: req.query.status as string,
      email: req.query.email as string
    };
    const options = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20
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
    const { status, note } = req.body;
    const changedBy = req.user?._id || 'system';
    const order = await orderService.updateOrderStatus(req.params.id, status, changedBy, note);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error updating order status';
    res.status(400).json({ message });
  }
};
