import { Request, Response } from 'express';
import * as stockMovementService from '../services/stock-movement.service';

export const getAll = async (req: Request, res: Response) => {
  try {
    const { page, limit, ...filters } = req.query;
    const result = await stockMovementService.getAllStockMovements(filters, {
      page: Number(page) || 1,
      limit: Number(limit) || 20
    });
    res.status(200).json({
      movements: result.movements,
      total: result.total,
      page: Number(page) || 1,
      pages: Math.ceil(result.total / (Number(limit) || 20))
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
