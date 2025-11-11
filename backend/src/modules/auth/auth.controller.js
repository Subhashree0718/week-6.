import authService from './auth.service.js';
import Response from '../../core/Response.js';

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      return Response.created(res, result, 'User registered successfully');
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body, { ip: req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress });
      return Response.success(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);
      return Response.success(res, user);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await authService.updateProfile(req.user.id, req.body);
      return Response.success(res, user, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
