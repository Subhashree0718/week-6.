import express from 'express';
import authController from './auth.controller.js';
import { registerSchema, loginSchema } from '../../validators/auth.schema.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

router.post('/register', registerSchema, validate, authController.register);
router.post('/login', loginSchema, validate, authController.login);
router.get('/profile', authenticate, authController.getProfile);
router.patch('/profile', authenticate, authController.updateProfile);

export default router;
