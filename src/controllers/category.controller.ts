import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';

export const getAll = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error fetching categories';
    res.status(500).json({ message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error fetching category';
    res.status(500).json({ message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error creating category';
    res.status(400).json({ message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await categoryService.updateCategory(id, req.body);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error updating category';
    res.status(400).json({ message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await categoryService.deleteCategory(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error deleting category';
    res.status(500).json({ message });
  }
};
