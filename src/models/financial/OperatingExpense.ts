import { Document, Schema, model } from 'mongoose';

export interface IOperatingExpense extends Document {
  description: string;
  amount: number;
  date: Date;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const operatingExpenseSchema = new Schema<IOperatingExpense>({
  description: {
    type: String,
    required: [true, 'La descripción del gasto es obligatoria'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'El monto del gasto es obligatorio'],
    min: [0, 'El monto del gasto no puede ser negativo'],
  },
  date: {
    type: Date,
    required: [true, 'La fecha del gasto es obligatoria'],
    default: Date.now,
  },
  category: {
    type: String,
    required: [true, 'La categoría del gasto es obligatoria'],
    trim: true,
  },
}, {
  timestamps: true,
});

const OperatingExpense = model<IOperatingExpense>('OperatingExpense', operatingExpenseSchema);

export default OperatingExpense;
