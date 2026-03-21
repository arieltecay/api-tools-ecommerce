import { Request, Response, NextFunction } from 'express';

// Controlador placeholder para manejar los webhooks de WhatsApp
// La lógica real dependerá del proveedor de la API de WhatsApp Business (ej. Twilio, Meta)
// y de las "Plantillas de Mensajes" (HSM) pre-aprobadas.

export const handleWhatsappWebhook = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;
    
    // Log completo del webhook recibido para depuración
    console.log('Webhook de WhatsApp recibido:', JSON.stringify(body, null, 2));

    // =========================================================
    // Lógica de validación del webhook (depende del proveedor)
    // Por ejemplo, para Meta (on-premise API):
    // const verify_token = process.env.WHATSAPP_VERIFY_TOKEN;
    // const mode = req.query['hub.mode'];
    // const token = req.query['hub.verify_token'];
    // const challenge = req.query['hub.challenge'];
    // if (mode && token) {
    //   if (mode === 'subscribe' && token === verify_token) {
    //     console.log('WEBHOOK_VERIFIED');
    //     return res.status(200).send(challenge);
    //   } else {
    //     return res.sendStatus(403);
    //   }
    // }
    // =========================================================

    // =========================================================
    // Lógica para procesar mensajes entrantes
    // Ejemplos de estructura de mensajes (simplificado):
    // const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    // if (message?.type === 'text') {
    //   const { from, text } = message;
    //   const userMessage = text.body;
    //   console.log(`Mensaje de ${from}: ${userMessage}`);

    //   // Aquí iría la lógica de "respuestas rápidas" (Quick Replies)
    //   // y el reconocimiento de contexto (ej. stock, medios de pago)
    //   // if (userMessage.includes('stock')) {
    //   //   sendWhatsappMessage(from, 'Consultando stock...');
    //   // } else if (userMessage.includes('hola')) {
    //   //   sendWhatsappMessage(from, '¡Hola! ¿En qué podemos ayudarte?');
    //   // } else {
    //   //   sendWhatsappMessage(from, 'Gracias por tu mensaje. Un agente te responderá pronto.');
    //   // }
    // }
    // =========================================================

    // Siempre responder 200 OK a los webhooks para evitar reintentos.
    res.status(200).send('Webhook recibido');

  } catch (error) {
    console.error('Error en el webhook de WhatsApp:', error);
    next(error); // Pasar el error al middleware de manejo de errores
  }
};

// Función placeholder para enviar mensajes (dependerá del SDK/API del proveedor)
// const sendWhatsappMessage = async (to: string, message: string) => {
//   console.log(`Enviando mensaje a ${to}: ${message}`);
//   // Lógica de envío real, por ejemplo:
//   // await twilioClient.messages.create({
//   //   from: 'whatsapp:+14155238886', // Número de WhatsApp Business de la empresa
//   //   to: `whatsapp:${to}`,
//   //   body: message,
//   // });
// };
