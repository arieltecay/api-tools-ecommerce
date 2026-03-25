import Product from '../../models/product/product.model';
import { IProduct, IPriceHistory } from '../../models/product/types';
import { FilterQuery } from 'mongoose';
import { ProductFilters, PaginationOptions } from './types';

export const createProduct = async (data: Partial<IProduct>): Promise<IProduct> => {
  const product = new Product(data);
  return await product.save();
};

export const getAllProducts = async (filters: ProductFilters = {}, options: PaginationOptions = {}): Promise<{ products: IProduct[], total: number }> => {
  const { page = 1, limit = 20 } = options;
  const query: FilterQuery<IProduct> = {};

  if (filters.category) {
    query['category.slug'] = filters.category;
  }

  if (filters.brand) {
    // Check if filters.brand is a single brand or multiple brands separated by commas
    const brandArray = filters.brand.split(',').map(b => b.trim());
    if (brandArray.length > 1) {
      query['brand.name'] = { $in: brandArray };
    } else {
      query['brand.name'] = filters.brand;
    }
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.isFeatured !== undefined) {
    query.isFeatured = filters.isFeatured;
  }

  if (filters.q) {
    const searchRegex = new RegExp(filters.q, 'i');
    query.$or = [
      { name: searchRegex },
      { sku: searchRegex },
      { tags: searchRegex }
    ];
  }

  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Product.countDocuments(query);
  return { products, total };
};

export const getProductByUuid = async (uuid: string): Promise<IProduct | null> => {
  return await Product.findOne({ uuid });
};

export const getProductById = async (id: string): Promise<IProduct | null> => {
  return await Product.findById(id);
};

export const getProductBySlug = async (slug: string): Promise<IProduct | null> => {
  return await Product.findOne({ slug });
};

export const updateProduct = async (id: string, data: Partial<IProduct>, changedBy?: string): Promise<IProduct | null> => {
  const product = await Product.findById(id);
  if (!product) return null;

  // Track price history if price changes
  if (data.price !== undefined && data.price !== product.price) {
    const historyItem = {
      previousPrice: product.price,
      newPrice: data.price,
      changedBy: changedBy ? (changedBy as any) : undefined,
      changedAt: new Date()
    };
    product.priceHistory.push(historyItem as IPriceHistory);
  }

  Object.assign(product, data);
  return await product.save();
};

export const deleteProduct = async (id: string): Promise<IProduct | null> => {
  return await Product.findByIdAndDelete(id);
};
