import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import AppError from '../core/AppError.js';

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(err);

  // Prisma errors
  if (err.code === 'P2002') {
    const message = 'Duplicate field value entered';
    error = new AppError(message, 400);
  }

  if (err.code === 'P2025') {
    const message = 'Record not found';
    error = new AppError(message, 404);
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new AppError('Validation error', 400, message);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors || null,
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
  });
};

export const notFound = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};
