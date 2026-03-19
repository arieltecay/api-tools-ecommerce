import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    if (!result) return res.status(401).json({ message: 'Invalid credentials' });
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    res.status(401).json({ message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    res.status(400).json({ message });
  }
};

export const logout = async (req: Request, res: Response) => {
  // Simple logout just sends 200, frontend should clear tokens
  res.status(200).json({ message: 'Logout successful' });
};
