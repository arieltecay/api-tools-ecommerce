import { Document, Types } from 'mongoose';

export interface ICustomer extends Document {
  fullName: string;
  email: string;
  phone: string;
  idNumber?: string;
  defaultAddress?: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  origin: 'online' | 'manual';
  whatsappConsent: boolean;
  orders: Types.ObjectId[];
  ordersCount: number;
  totalSpent: number;
  lastOrderAt?: Date;
  internalNotes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
