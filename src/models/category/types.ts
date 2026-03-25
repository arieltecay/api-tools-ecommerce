import { Document, Types } from 'mongoose';

export interface ICategory extends Document {
  uuid: string;
  name: string;
  slug: string;
  parent?: Types.ObjectId | ICategory;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
