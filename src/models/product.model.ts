import mongoose, { Schema } from 'mongoose';
import { IProduct } from './types';
import { v4 as uuidv4 } from 'uuid';

const productSchema = new Schema<IProduct>({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true,
    index: true
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  shortDescription: String,
  longDescription: String,
  category: {
    _id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    uuid: String,
    name: String,
    slug: String
  },
  subcategory: {
    _id: { type: Schema.Types.ObjectId, ref: 'Category' },
    uuid: String,
    name: String,
    slug: String
  },
  brand: {
    _id: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    name: String
  },
  images: [{
    url: String,
    isPrimary: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 }
  }],
  costPrice: { type: Number, required: true },
  price: { type: Number, required: true },
  priceHistory: [{
    previousPrice: Number,
    newPrice: Number,
    changedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    changedAt: { type: Date, default: Date.now }
  }],
  stock: { type: Number, default: 0 },
  minStock: { type: Number, default: 5 },
  weight: Number,
  dimensions: {
    height: Number,
    width: Number,
    length: Number
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'draft', 'out_of_stock'],
    default: 'draft'
  },
  isFeatured: { type: Boolean, default: false },
  tags: [String],
  salesCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Indexes for storefront searches
productSchema.index({ 'category.slug': 1, status: 1 });
productSchema.index({ salesCount: -1 });
productSchema.index({ price: 1 });

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
