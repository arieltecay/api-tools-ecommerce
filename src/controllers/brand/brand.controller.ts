import { Request, Response } from 'express';
import * as brandService from '../../services/brand/brand.service';
import { BrandQueryFilters } from './types';

export const create = async (req: Request, res: Response) => {
  try {
    const brand = await brandService.createBrand(req.body);
    res.status(201).json(brand);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al crear la marca';
    res.status(400).json({ message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const query = req.query as BrandQueryFilters;
    const filters = {
      isActive: query.isActive === 'true' ? true : query.isActive === 'false' ? false : undefined
    };

    const brands = await brandService.getAllBrands(filters);
    res.json(brands);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener las marcas';
    res.status(500).json({ message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const brand = await brandService.getBrandById(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Marca no encontrada' });
    res.json(brand);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener la marca';
    res.status(500).json({ message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const brand = await brandService.updateBrand(req.params.id, req.body);
    if (!brand) return res.status(404).json({ message: 'Marca no encontrada' });
    res.json(brand);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al actualizar la marca';
    res.status(400).json({ message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const brand = await brandService.deleteBrand(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Marca no encontrada' });
    res.json({ message: 'Marca eliminada correctamente' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al eliminar la marca';
    res.status(400).json({ message });
  }
};
