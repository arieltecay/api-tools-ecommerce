import mongoose, { Schema } from 'mongoose';
import { ICategory } from './types';

const categorySchema = new Schema<ICategory>({
  uuid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Category' },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category;
