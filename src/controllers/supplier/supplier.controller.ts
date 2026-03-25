import { Request, Response } from 'express';
import * as supplierService from '../../services/supplier/supplier.service';
import { ISupplier } from '../../models/supplier/types';
import { SupplierQueryFilters } from './types';

export const getAll = async (req: Request, res: Response) => {
  try {
    const query = req.query as SupplierQueryFilters;
    const filters = {
      isActive: query.isActive === 'false' ? false : true
    };
    const suppliers = await supplierService.getAllSuppliers(filters);
    res.status(200).json(suppliers);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    res.status(500).json({ message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const supplier = await supplierService.createSupplier(req.body as Partial<ISupplier>);
    res.status(201).json(supplier);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error creating supplier';
    res.status(400).json({ message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const supplier = await supplierService.updateSupplier(req.params.id, req.body as Partial<ISupplier>);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.status(200).json(supplier);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating supplier';
    res.status(400).json({ message });
  }
};
