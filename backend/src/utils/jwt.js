import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import AppError from '../core/AppError.js';

export const generateToken = (payload, expiresIn = config.jwt.expiresIn) => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.refreshExpiresIn });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token expired', 401);
    }
    throw new AppError('Invalid token', 401);
  }
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};
