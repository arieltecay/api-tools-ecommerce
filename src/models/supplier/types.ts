import { Document } from 'mongoose';

export interface ISupplier extends Document {
  name: string;
  taxId: string;
  contact: {
    phone: string;
    email: string;
  };
  defaultPaymentTerms?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
