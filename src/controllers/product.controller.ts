import { Request, Response } from 'express';
import * as productService from '../services/product.service';
import { uploadImage } from '../services/upload.service';
import fs from 'fs';

export const getAll = async (req: Request, res: Response) => {
  try {
    const filters = {
      category: req.query.category as string,
      brand: req.query.brand as string,
      status: req.query.status as string,
      featured: req.query.featured as string,
      q: req.query.q as string,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      inStock: req.query.inStock === 'true'
    };

    const options = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
      sort: req.query.sort as string
    };

    const result = await productService.getAllProducts(filters, options);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error fetching products';
    res.status(500).json({ message });
  }
};

export const getBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const product = await productService.getProductBySlug(slug);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error fetching product';
    res.status(500).json({ message });
  }
};

export const getByUuid = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const product = await productService.getProductByUuid(uuid);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error fetching product';
    res.status(500).json({ message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error creating product';
    res.status(400).json({ message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const product = await productService.updateProduct(uuid, req.body);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error updating product';
    res.status(400).json({ message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const product = await productService.deleteProduct(uuid);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error deleting product';
    res.status(500).json({ message });
  }
};

export const uploadProductImage = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const product = await productService.getProductByUuid(uuid);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const imageCount = product.images.length;
    const publicId = `${product.slug}-${imageCount + 1}`;

    const fileBuffer = fs.readFileSync(req.file.path);
    const uploadResult = await uploadImage(fileBuffer, 'products', publicId);
    
    const updatedProduct = await productService.addProductImage(uuid, uploadResult.secure_url, req.body.isPrimary === 'true');
    
    fs.unlinkSync(req.file.path);
    res.json(updatedProduct);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error uploading image';
    res.status(500).json({ message });
  }
};
