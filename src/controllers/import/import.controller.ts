import { Request, Response } from 'express';
import * as importService from '../../services/import/import.service';

export const importProducts = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ningún archivo' });
    }

    const result = await importService.processProductImport(req.file.buffer, req.file.mimetype);
    
    res.status(200).json(result);
  } catch (error: unknown) {
    console.error('Import controller error:', error);
    const message = error instanceof Error ? error.message : 'Error al importar productos';
    res.status(500).json({ message });
  }
};
