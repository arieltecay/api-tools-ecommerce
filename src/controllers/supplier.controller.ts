import { Request, Response } from 'express';
import * as supplierService from '../services/supplier.service';

export const getAll = async (req: Request, res: Response) => {
  try {
    const suppliers = await supplierService.getAllSuppliers();
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const supplier = await supplierService.createSupplier(req.body);
    res.status(201).json(supplier);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const supplier = await supplierService.updateSupplier(req.params.id, req.body);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.status(200).json(supplier);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
