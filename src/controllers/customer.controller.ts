import { Request, Response } from 'express';
import * as customerService from '../services/customer.service';

export const getAll = async (req: Request, res: Response) => {
  try {
    const { page, limit, ...filters } = req.query;
    const result = await customerService.getAllCustomers(filters, {
      page: Number(page) || 1,
      limit: Number(limit) || 20
    });
    res.status(200).json({
      customers: result.customers,
      total: result.total,
      page: Number(page) || 1,
      pages: Math.ceil(result.total / (Number(limit) || 20))
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const customer = await customerService.createCustomer(req.body);
    res.status(201).json(customer);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const customer = await customerService.updateCustomer(req.params.id, req.body);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(customer);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const customer = await customerService.deleteCustomer(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
