import { Document } from 'mongoose';

export interface ISettings extends Document {
  store: {
    name: string;
    logoUrl?: string;
    contactEmail?: string;
    contactPhone?: string;
    defaultMetaTitle?: string;
    defaultMetaDescription?: string;
  };
  payment: {
    gateway: {
      provider: 'decidir' | 'payway';
      publicKey: string;
    };
    bankTransfer: {
      isEnabled: boolean;
      holderName: string;
      cbu: string;
      alias: string;
      bank: string;
      taxId: string;
      accountType: string;
      additionalInstructions?: string;
    };
    installments: { count: number; surchargePercent: number }[];
    minAmountForInstallments: number;
  };
  notifications: {
    adminEmails: string[];
    emailEvents: {
      newOrder: boolean;
      lowStock: boolean;
      newReturn: boolean;
    };
    whatsapp: {
      isEnabled: boolean;
      provider: 'meta' | 'twilio';
      phoneNumber: string;
    };
  };
  afterSales: {
    reviewEmailDaysAfterDelivery: number;
  };
  stock: {
    autoPauseOnZero: boolean;
  };
  updatedAt: Date;
}
