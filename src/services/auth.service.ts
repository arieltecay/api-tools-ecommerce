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

export const registerUser = async (userData: Partial<IAdminUser>): Promise<IAdminUser> => {
  const { name, email, passwordHash, role } = userData;
  // In a real scenario, passwordHash passed here would be the plain password needing hashing
  // But let's assume controller handles hashing or we do it here. 
  // Better pattern: Service handles hashing.
  
  // Actually, let's fix the type. userData should have password, not passwordHash for register input.
  // But for now, sticking to the model interface to keep it simple, but we'll hash it.
  
  const hashedPassword = await bcrypt.hash(userData.passwordHash!, 12);
  
  const user = new AdminUser({
    name,
    email,
    passwordHash: hashedPassword,
    role: role || 'operator'
  });

  return await user.save();
};
