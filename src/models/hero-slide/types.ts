import { Document } from 'mongoose';

export interface IHeroSlide extends Document {
  productUuid: string;
  title: string;
  subtitle?: string;
  buttonText: string;
  imageUrl?: string;
  backgroundColor?: string;
  textColor: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
