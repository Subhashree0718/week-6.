import nodemailer from 'nodemailer';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: config.SMTP_SECURE === 'true' || config.SMTP_SECURE === true,
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASS,
  },
});

export const sendMail = async (to, subject, html, text) => {
  try {
    if (!config.SMTP_HOST || !config.SMTP_USER) {
      throw new Error('SMTP configuration is missing');
    }

    const info = await transporter.sendMail({
      from: config.EMAIL_FROM || config.SMTP_USER,
      to,
      subject,
      text,
      html,
    });

    logger.info(`Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    logger.error('Failed to send invitation email:', error.message);
  }
};
