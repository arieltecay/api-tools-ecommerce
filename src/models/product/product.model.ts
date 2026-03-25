import mongoose, { Schema } from 'mongoose';
import { IProduct } from './types';

const productSchema = new Schema<IProduct>({
  uuid: { type: String, required: true, unique: true },
  sku: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, index: true },
  slug: { type: String, required: true, unique: true, index: true },
  shortDescription: { type: String, required: true },
  longDescription: { type: String, required: true },
  category: {
    _id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    uuid: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true }
  },
  subcategory: {
    _id: { type: Schema.Types.ObjectId, ref: 'Category' },
    uuid: String,
    name: String,
    slug: String
  },
  brand: {
    _id: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    name: { type: String, required: true }
  },
  images: [{
    url: { type: String, required: true },
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
    default: 'active'
  },
  isFeatured: { type: Boolean, default: false },
  tags: [String],
  salesCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
