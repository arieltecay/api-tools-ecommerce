import { Document, Types } from 'mongoose';

export interface IProductImage {
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface IPriceHistory {
  previousPrice: number;
  newPrice: number;
  changedBy?: Types.ObjectId;
  changedAt: Date;
}

export interface IProduct extends Document {
  uuid: string;
  sku: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  category: {
    _id: Types.ObjectId;
    uuid: string;
    name: string;
    slug: string;
  };
  subcategory?: {
    _id: Types.ObjectId;
    uuid: string;
    name: string;
    slug: string;
  };
  brand: {
    _id: Types.ObjectId;
    name: string;
  };
  images: IProductImage[];
  costPrice: number;
  price: number;
  priceHistory: IPriceHistory[];
  stock: number;
  minStock: number;
  weight?: number;
  dimensions?: {
    height: number;
    width: number;
    length: number;
  };
  status: 'active' | 'paused' | 'draft' | 'out_of_stock';
  isFeatured: boolean;
  tags: string[];
  salesCount: number;
  createdAt: Date;
  updatedAt: Date;
}
