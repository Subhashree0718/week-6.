import http from '../../../services/http';
import { ENDPOINTS } from '../../../constants/endpoints';

export const authService = {
  async register(data) {
    return await http.post(ENDPOINTS.AUTH.REGISTER, data);
  },
  
  async login(data) {
    return await http.post(ENDPOINTS.AUTH.LOGIN, data);
  },
  
  async getProfile() {
    return await http.get(ENDPOINTS.AUTH.PROFILE);
  },
  
  async updateProfile(data) {
    return await http.patch(ENDPOINTS.AUTH.UPDATE_PROFILE, data);
  },

};
