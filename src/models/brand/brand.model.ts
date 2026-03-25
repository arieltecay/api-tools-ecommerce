import mongoose, { Schema } from 'mongoose';
import { IBrand } from './types';

const brandSchema = new Schema<IBrand>({
  name: { type: String, required: true, unique: true },
  logo: String,
  description: String,
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

const Brand = mongoose.model<IBrand>('Brand', brandSchema);

export default Brand;
