import { Request, Response } from 'express';
import * as reportService from '../../services/report/report.service';
import { DashboardQuery } from './types';

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const query = req.query as DashboardQuery;
    const { startDate, endDate } = query;
    
    const stats = await reportService.getDashboardStats(startDate, endDate);
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Report Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
