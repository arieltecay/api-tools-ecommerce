import { Request, Response } from 'express';
import * as brandService from '../services/brand.service';

export const getAll = async (req: Request, res: Response) => {
  try {
    const brands = await brandService.getAllBrands();
    res.json(brands);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error fetching brands';
    res.status(500).json({ message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const brand = await brandService.getBrandById(id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.json(brand);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error fetching brand';
    res.status(500).json({ message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const brand = await brandService.createBrand(req.body);
    res.status(201).json(brand);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error creating brand';
    res.status(400).json({ message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const brand = await brandService.updateBrand(id, req.body);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.json(brand);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error updating brand';
    res.status(400).json({ message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const brand = await brandService.deleteBrand(id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error deleting brand';
    res.status(500).json({ message });
  }
};
