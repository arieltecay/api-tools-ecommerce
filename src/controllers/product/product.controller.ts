import { Request, Response } from 'express';
import * as productService from '../../services/product/product.service';
import * as uploadService from '../../services/upload/upload.service';
import { RequestWithUser } from '../../middleware/auth.middleware';
import { ProductQueryFilters, ProductPaginationQuery } from './types';

export const create = async (req: Request, res: Response) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al crear el producto';
    res.status(400).json({ message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const query = req.query as ProductQueryFilters & ProductPaginationQuery;

    const filters = {
      category: query.category,
      brand: query.brand,
      status: query.status,
      q: query.q,
      isFeatured: query.isFeatured === 'true' ? true : query.isFeatured === 'false' ? false : undefined
    };

    const options = {
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 20
    };

    const result = await productService.getAllProducts(filters, options);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener los productos';
    res.status(500).json({ message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener el producto';
    res.status(500).json({ message });
  }
};

export const getByUuid = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductByUuid(req.params.uuid);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener el producto';
    res.status(500).json({ message });
  }
};

export const getBySlug = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductBySlug(req.params.slug);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener el producto';
    res.status(500).json({ message });
  }
};

export const update = async (req: RequestWithUser, res: Response) => {
  try {
    const changedBy = req.user?._id?.toString();
    // Some routes might use :id and others :uuid. Based on routes it's :uuid
    const id = req.params.id || req.params.uuid;
    const product = await productService.updateProduct(id, req.body, changedBy);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al actualizar el producto';
    res.status(400).json({ message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const id = req.params.id || req.params.uuid;
    const product = await productService.deleteProduct(id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al eliminar el producto';
    res.status(400).json({ message });
  }
};

export const uploadProductImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ninguna imagen' });
    }

    const uuid = req.params.uuid;
    const product = await productService.getProductByUuid(uuid);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    const result = await uploadService.uploadImage(req.file.buffer, 'products');
    
    product.images.push({
      url: result.secure_url,
      isPrimary: product.images.length === 0,
      sortOrder: product.images.length
    });

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al subir la imagen';
    res.status(500).json({ message });
  }
};

export const deleteProductImage = async (req: Request, res: Response) => {
  try {
    const { uuid, public_id } = req.params;
    const product = await productService.getProductByUuid(uuid);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    // En un sistema real el public_id se extraería de la URL o se guardaría en BD
    // Por ahora intentamos borrarlo de Cloudinary si el public_id es válido
    await uploadService.deleteImage(public_id);

    // Filtrar la imagen del array (esto es simplificado ya que necesitamos mapear public_id a URL)
    product.images = product.images.filter(img => !img.url.includes(public_id));
    
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al eliminar la imagen';
    res.status(500).json({ message });
  }
};
