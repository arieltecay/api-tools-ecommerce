import { Request, Response } from 'express';
import * as settingsService from '../../services/settings/settings.service';
import { UpdateSettingsBody } from './types';

export const get = async (req: Request, res: Response) => {
  try {
    const settings = await settingsService.getSettings();
    res.status(200).json(settings);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    res.status(500).json({ message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const settings = await settingsService.updateSettings(req.body as UpdateSettingsBody);
    res.status(200).json(settings);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al actualizar la configuración';
    res.status(400).json({ message });
  }
};
