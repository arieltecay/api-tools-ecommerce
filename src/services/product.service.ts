import Product from '../models/product.model';
import { IProduct } from '../models/types';

interface ProductFilters {
  category?: string;
  brand?: string; // Can be a single brand or comma-separated string
  status?: string;
  featured?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: string; // e.g., 'price_asc', 'price_desc', 'newest'
}

export const getAllProducts = async (filters: ProductFilters = {}, options: PaginationOptions = {}): Promise<{ products: IProduct[], total: number }> => {
  const { page = 1, limit = 20, sort = 'newest' } = options;
  
  const query: any = {};
  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.category) query['category.slug'] = filters.category;
  
  if (filters.brand) {
    const brands = filters.brand.split(',');
    query['brand.name'] = brands.length > 1 ? { $in: brands } : brands[0];
  }

  if (filters.featured) query.isFeatured = filters.featured === 'true';
  
  if (filters.q) {
    query.$or = [
      { name: new RegExp(filters.q, 'i') },
      { sku: new RegExp(filters.q, 'i') }
    ];
  }

  // Price range filters
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {};
    if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
    if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
  }

  if (filters.inStock) {
    query.stock = { $gt: 0 };
  }

  // Sorting logic
  let sortObj: any = { createdAt: -1 };
  if (sort === 'price_asc') sortObj = { price: 1 };
  else if (sort === 'price_desc') sortObj = { price: -1 };
  else if (sort === 'oldest') sortObj = { createdAt: 1 };

  const products = await Product.find(query)
    .sort(sortObj)
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Product.countDocuments(query);

  return { products, total };
};

export const getProductByUuid = async (uuid: string): Promise<IProduct | null> => {
  return await Product.findOne({ uuid });
};

export const getProductBySlug = async (slug: string): Promise<IProduct | null> => {
  return await Product.findOne({ slug });
};

export const createProduct = async (data: Partial<IProduct>): Promise<IProduct> => {
  const product = new Product(data);
  return await product.save();
};

export const updateProduct = async (uuid: string, data: Partial<IProduct>): Promise<IProduct | null> => {
  const oldProduct = await Product.findOne({ uuid });
  if (!oldProduct) return null;

  if (data.price && data.price !== oldProduct.price) {
    const historyItem = {
      previousPrice: oldProduct.price,
      newPrice: data.price,
      changedAt: new Date(),
    };
    if (!data.priceHistory) data.priceHistory = oldProduct.priceHistory || [];
    data.priceHistory.push(historyItem as any);
  }

  return await Product.findOneAndUpdate({ uuid }, data, { new: true });
};

export const deleteProduct = async (uuid: string): Promise<IProduct | null> => {
  return await Product.findOneAndUpdate({ uuid }, { status: 'paused' }, { new: true });
};

export const addProductImage = async (uuid: string, imageUrl: string, isPrimary: boolean = false): Promise<IProduct | null> => {
  const product = await Product.findOne({ uuid });
  if (!product) return null;

  if (isPrimary || product.images.length === 0) {
    product.images.forEach(img => img.isPrimary = false);
    isPrimary = true;
  }

  product.images.push({
    url: imageUrl,
    isPrimary,
    sortOrder: product.images.length
  });

  return await product.save();
};
