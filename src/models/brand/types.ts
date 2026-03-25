import { Document } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  logo?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
