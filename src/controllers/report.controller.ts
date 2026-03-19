import { Request, Response } from 'express';
import * as reportService from '../services/report.service';

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const { period } = req.query;
    const stats = await reportService.getDashboardStats(period as string);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
