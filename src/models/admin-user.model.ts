import mongoose, { Schema } from 'mongoose';
import { IAdminUser } from './types';

const adminUserSchema = new Schema<IAdminUser>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  passwordHash: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'operator', 'readonly'],
    default: 'operator'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLoginAt: Date
}, {
  timestamps: true
});

const AdminUser = mongoose.model<IAdminUser>('AdminUser', adminUserSchema);

export default AdminUser;
