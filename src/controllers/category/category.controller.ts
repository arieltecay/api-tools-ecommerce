import { Request, Response } from 'express';
import * as categoryService from '../../services/category/category.service';
import { CategoryQueryFilters } from './types';

export const create = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al crear la categoría';
    res.status(400).json({ message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const query = req.query as CategoryQueryFilters;
    const filters = {
      isActive: query.isActive === 'true' ? true : query.isActive === 'false' ? false : undefined
    };

    const categories = await categoryService.getAllCategories(filters);
    res.json(categories);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener las categorías';
    res.status(500).json({ message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json(category);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener la categoría';
    res.status(500).json({ message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json(category);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al actualizar la categoría';
    res.status(400).json({ message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.deleteCategory(req.params.id);
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al eliminar la categoría';
    res.status(400).json({ message });
  }
};
