import { Request, Response } from 'express';
import * as settingsService from '../services/settings.service';

export const get = async (req: Request, res: Response) => {
  try {
    const settings = await settingsService.getSettings();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const settings = await settingsService.updateSettings(req.body);
    res.status(200).json(settings);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
