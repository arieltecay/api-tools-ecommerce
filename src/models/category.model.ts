import mongoose, { Schema } from 'mongoose';
import { ICategory } from './types';
import { v4 as uuidv4 } from 'uuid';

const categorySchema = new Schema<ICategory>({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true,
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
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category;
