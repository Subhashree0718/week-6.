import http from '../../services/http';
import { ENDPOINTS } from '../../constants/endpoints';

export const updateService = {
  async createUpdate(data) {
    return await http.post(ENDPOINTS.UPDATES.BASE, data);
  },
  
  async getUpdates(objectiveId) {
    return await http.get(ENDPOINTS.UPDATES.BY_OBJECTIVE(objectiveId));
  },
  
  async getUpdateById(updateId) {
    return await http.get(ENDPOINTS.UPDATES.BY_ID(updateId));
  },
  
  async updateUpdate(updateId, data) {
    return await http.patch(ENDPOINTS.UPDATES.BY_ID(updateId), data);
  },
  
  async deleteUpdate(updateId) {
    return await http.delete(ENDPOINTS.UPDATES.BY_ID(updateId));
  },
  
  async generateSummary(objectiveId) {
    return await http.get(ENDPOINTS.UPDATES.SUMMARY(objectiveId));
  },
};
