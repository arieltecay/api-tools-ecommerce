import { Request, Response } from 'express';
import * as purchaseInvoiceService from '../services/purchase-invoice.service';

export const getAll = async (req: Request, res: Response) => {
  try {
    const { page, limit, ...filters } = req.query;
    const result = await purchaseInvoiceService.getAllPurchaseInvoices(filters, {
      page: Number(page) || 1,
      limit: Number(limit) || 20
    });
    res.status(200).json({
      invoices: result.invoices,
      total: result.total,
      page: Number(page) || 1,
      pages: Math.ceil(result.total / (Number(limit) || 20))
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id?.toString() || '';
    const invoice = await purchaseInvoiceService.createPurchaseInvoice(req.body, userId);
    res.status(201).json(invoice);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
