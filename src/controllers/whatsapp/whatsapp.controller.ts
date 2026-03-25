import { Request, Response, NextFunction } from 'express';
import * as whatsappService from '../../services/whatsapp/whatsapp.service';

export const handleWhatsappWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await whatsappService.processWebhook(req.body);
    res.status(200).send('Webhook recibido');
  } catch (error) {
    console.error('Error en el webhook de WhatsApp:', error);
    next(error);
  }
};
