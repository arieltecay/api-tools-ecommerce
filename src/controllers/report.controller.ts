import { Request, Response } from 'express';
import * as reportService from '../services/report.service';

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    const stats = await reportService.getDashboardStats(
      startDate as string, 
      endDate as string
    );
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Report Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
