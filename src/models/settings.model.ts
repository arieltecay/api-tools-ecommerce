import mongoose, { Schema } from 'mongoose';
import { ISettings } from './types';

const settingsSchema = new Schema<ISettings>({
  store: {
    name: { type: String, default: 'Tools Store' },
    logoUrl: String,
    contactEmail: String,
    contactPhone: String,
    defaultMetaTitle: String,
    defaultMetaDescription: String
  },
  payment: {
    gateway: {
      provider: { type: String, enum: ['decidir', 'payway'], default: 'decidir' },
      publicKey: String
    },
    bankTransfer: {
      isEnabled: { type: Boolean, default: true },
      holderName: String,
      cbu: String,
      alias: String,
      bank: String,
      taxId: String,
      accountType: { type: String, default: 'checking' },
      additionalInstructions: String
    },
    installments: [{
      count: Number,
      surchargePercent: Number
    }],
    minAmountForInstallments: { type: Number, default: 0 }
  },
  notifications: {
    adminEmails: [String],
    emailEvents: {
      newOrder: { type: Boolean, default: true },
      lowStock: { type: Boolean, default: true },
      newReturn: { type: Boolean, default: true }
    },
    whatsapp: {
      isEnabled: { type: Boolean, default: false },
      provider: { type: String, enum: ['meta', 'twilio'], default: 'meta' },
      phoneNumber: String
    }
  },
  afterSales: {
    reviewEmailDaysAfterDelivery: { type: Number, default: 3 }
  },
  stock: {
    autoPauseOnZero: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

const Settings = mongoose.model<ISettings>('Settings', settingsSchema);

export default Settings;
