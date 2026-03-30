import { Document, Schema, model } from 'mongoose';

export interface ICapitalContribution extends Document {
  description: string;
  amount: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const capitalContributionSchema = new Schema<ICapitalContribution>({
  description: {
    type: String,
    required: [true, 'La descripción del aporte de capital es obligatoria'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'El monto del aporte de capital es obligatorio'],
    min: [0, 'El monto del aporte de capital no puede ser negativo'],
  },
  date: {
    type: Date,
    required: [true, 'La fecha del aporte de capital es obligatoria'],
    default: Date.now,
  },
}, {
  timestamps: true,
});

const CapitalContribution = model<ICapitalContribution>('CapitalContribution', capitalContributionSchema);

export default CapitalContribution;
