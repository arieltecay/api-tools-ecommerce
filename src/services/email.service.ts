import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: Number(process.env.SMTP_PORT) || 2525,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailVariables {
  [key: string]: string | number | undefined;
}

export const sendEmail = async (
  to: string, 
  subject: string, 
  templateName: string, 
  variables: EmailVariables
): Promise<nodemailer.SentMessageInfo> => {
  try {
    const templatePath = path.join(__dirname, '../../templates', `${templateName}.html`);
    let html = fs.readFileSync(templatePath, 'utf8');

    // Simple template variable replacement
    Object.keys(variables).forEach((key) => {
      const value = variables[key];
      if (value !== undefined) {
        const placeholder = new RegExp(`{{${key}}}`, 'g');
        html = html.replace(placeholder, String(value));
      }
    });

    const mailOptions = {
      from: '"Tools Store" <noreply@tools-store.com>',
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
