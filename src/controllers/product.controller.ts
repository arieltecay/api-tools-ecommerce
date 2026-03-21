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
    if (!req.file) return res.status(400).json({ message: 'No se subió ningún archivo' });

    const product = await productService.getProductByUuid(uuid);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    // No usamos publicId manual para evitar colisiones al borrar/re-subir
    const uploadResult = await uploadImage(req.file.buffer, 'products');
    
    // El frontend ya nos dice si quiere que sea la primaria
    const isPrimary = req.body.isPrimary === 'true';
    const updatedProduct = await productService.addProductImage(uuid, uploadResult.secure_url, isPrimary);
    
    res.json(updatedProduct);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al subir la imagen';
    res.status(500).json({ message });
  }
};

export const deleteProductImage = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const { public_id: imageUrl } = req.params;

    const updatedProduct = await productService.deleteProductImage(uuid, imageUrl);
    
    if (imageUrl.includes('cloudinary.com')) {
      try {
        const parts = imageUrl.split('/');
        const fileName = parts[parts.length - 1].split('.')[0];
        const folder = parts[parts.length - 2];
        const subFolder = parts[parts.length - 3];
        const cloudinaryId = `tools-store/${subFolder}/${fileName}`;
        const { deleteImage } = await import('../services/upload.service');
        await deleteImage(cloudinaryId);
      } catch (err) {
        console.error('Error al borrar imagen de Cloudinary:', err);
      }
    }

    res.json(updatedProduct);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al eliminar la imagen';
    res.status(500).json({ message });
  }
};
