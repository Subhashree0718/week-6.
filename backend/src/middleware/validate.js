import { validationResult } from 'express-validator';
import AppError from '../core/AppError.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    
    console.log('❌ Validation errors:', JSON.stringify(extractedErrors, null, 2));
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
    
    throw new AppError('Validation failed', 400, extractedErrors);
  }
  
  next();
};
