import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';
import './env.js';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Ensure backend/.env defines a valid connection string.');
}

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

prisma.$connect()
  .then(() => {
    logger.info('Database connected successfully');
  })
  .catch((err) => {
    logger.error('Database connection failed:', err);
    process.exit(1);
  });

export default prisma;
