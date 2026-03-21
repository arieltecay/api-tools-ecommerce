import { Router } from 'express';
import { handleWhatsappWebhook } from '../controllers/whatsapp.controller';

const router = Router();

router.post('/webhook', handleWhatsappWebhook);
router.get('/webhook', handleWhatsappWebhook);

export default router;
