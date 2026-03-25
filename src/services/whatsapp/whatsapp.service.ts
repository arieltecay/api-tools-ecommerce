import { WhatsappWebhookBody } from './types';

export const processWebhook = async (body: WhatsappWebhookBody) => {
  console.log('Processing WhatsApp Webhook:', JSON.stringify(body, null, 2));
  // Placeholder for real logic
  return { status: 'success' };
};

export const sendWhatsappMessage = async (to: string, message: string) => {
  console.log(`Enviando mensaje a ${to}: ${message}`);
  // Placeholder for real logic
};
