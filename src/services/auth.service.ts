import bcrypt from 'bcrypt';
import AdminUser from '../models/admin-user.model';
import { generateTokens } from '../utils/token.utils';
import { IAdminUser } from '../models/types';

export const loginUser = async (email: string, password: string): Promise<{ accessToken: string, refreshToken: string, user: IAdminUser } | null> => {
  const user = await AdminUser.findOne({ email, isActive: true }).select('+passwordHash');
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return null;

  const tokens = generateTokens(user);
  
  user.lastLoginAt = new Date();
  await user.save();

  return { ...tokens, user };
};

export const registerUser = async (userData: any): Promise<IAdminUser> => {
  const { name, email, password, role } = userData;

  if (!password) {
    throw new Error('Password is required for registration');
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  const user = new AdminUser({
    name,
    email,
    passwordHash: hashedPassword,
    role: role || 'admin', // Por defecto admin para facilitar tu primera cuenta
    isActive: true
  });

  return await user.save();
};
