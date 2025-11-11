import http from '../../services/http';
import { ENDPOINTS } from '../../constants/endpoints';

class ProfileService {
  async getProfile() {
    return await http.get(ENDPOINTS.AUTH.PROFILE);
  }

  async updateProfile(data) {
    return await http.patch(ENDPOINTS.AUTH.UPDATE_PROFILE, data);
  }

  async changePassword(currentPassword, newPassword) {
    return await http.patch(ENDPOINTS.AUTH.UPDATE_PROFILE, {
      currentPassword,
      password: newPassword,
    });
  }

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    // For now, convert to base64 as a simple solution
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async deleteAccount() {
    return await http.delete(ENDPOINTS.AUTH.UPDATE_PROFILE);
  }
}

export const profileService = new ProfileService();
