import { Request, Response } from 'express';
import * as importService from '../services/import.service';

export const importProducts = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ningún archivo' });
    }

    const result = await importService.processProductImport(req.file.buffer, req.file.mimetype);
    
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Import controller error:', error);
    res.status(500).json({ message: error.message || 'Error al importar productos' });
  }
};
