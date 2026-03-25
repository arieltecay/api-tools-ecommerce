import { Request, Response } from 'express';
import * as customerService from '../../services/customer/customer.service';
import { CustomerQueryFilters, CustomerPaginationQuery } from './types';

export const create = async (req: Request, res: Response) => {
  try {
    const customer = await customerService.createCustomer(req.body);
    res.status(201).json(customer);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al crear el cliente';
    res.status(400).json({ message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const query = req.query as CustomerQueryFilters & CustomerPaginationQuery;
    const filters = { q: query.q };
    const options = {
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20
    };

    const result = await customerService.getAllCustomers(filters, options);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener los clientes';
    res.status(500).json({ message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.json(customer);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener el cliente';
    res.status(500).json({ message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const customer = await customerService.updateCustomer(req.params.id, req.body);
    if (!customer) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.json(customer);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al actualizar el cliente';
    res.status(400).json({ message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const customer = await customerService.deleteCustomer(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al eliminar el cliente';
    res.status(400).json({ message });
  }
};
