import { IAdminUser } from '../../models/auth/types';

export interface RegisterUserDTO {
  name: string;
  email: string;
  password?: string;
  role?: 'admin' | 'operator' | 'readonly';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IAdminUser;
}
