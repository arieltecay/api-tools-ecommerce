import jwt from 'jsonwebtoken';
import { IAdminUser } from '../models/types';

export const generateTokens = (user: IAdminUser) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: '8h' }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};
