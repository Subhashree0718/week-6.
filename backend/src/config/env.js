import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  openai: {
    apiKey: process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY,
  },
  cors: {
    origin: process.env.FRONTEND_URL || 'http://okr-tracker-frontend-dev.s3-website-us-east-1.amazonaws.com',
  },
  email: {
    from: process.env.EMAIL_FROM || 'no-reply@example.com',
    inviteAcceptUrl: process.env.INVITE_ACCEPT_URL || 'http://okr-tracker-frontend-dev.s3-website-us-east-1.amazonaws.com/accept-invite',
    inviteExpiresInHours: Number(process.env.INVITE_EXPIRES_IN_HOURS || 72),
    smtp: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'false',
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
};
