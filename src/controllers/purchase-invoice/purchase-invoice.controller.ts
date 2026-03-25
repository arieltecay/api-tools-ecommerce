import { Request, Response } from 'express';
import * as purchaseInvoiceService from '../../services/purchase-invoice/purchase-invoice.service';
import { PurchaseInvoiceDTO } from '../../services/purchase-invoice/types';
import { RequestWithUser } from '../../middleware/auth.middleware';
import { InvoiceQueryFilters } from './types';

export const getAll = async (req: Request, res: Response) => {
  try {
    const query = req.query as InvoiceQueryFilters;
    const { page, limit, ...filters } = query;
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    res.status(500).json({ message });
  }
};

export const create = async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.user?._id?.toString() || '';
    const invoice = await purchaseInvoiceService.createPurchaseInvoice(req.body as PurchaseInvoiceDTO, userId);
    res.status(201).json(invoice);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al crear la factura de compra';
    res.status(400).json({ message });
  }
};
