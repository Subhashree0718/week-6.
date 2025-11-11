import http from '../../services/http';
import { ENDPOINTS } from '../../constants/endpoints';

export const keyResultService = {
  async createKeyResult(objectiveId, data) {
    return await http.post(ENDPOINTS.KEY_RESULTS.BY_OBJECTIVE(objectiveId), data);
  },
  
  async getKeyResults(objectiveId) {
    return await http.get(ENDPOINTS.KEY_RESULTS.BY_OBJECTIVE(objectiveId));
  },
  
  async getKeyResultById(keyResultId) {
    return await http.get(ENDPOINTS.KEY_RESULTS.BY_ID(keyResultId));
  },
  
  async updateKeyResult(keyResultId, data) {
    return await http.patch(ENDPOINTS.KEY_RESULTS.BY_ID(keyResultId), data);
  },
  
  async deleteKeyResult(keyResultId) {
    return await http.delete(ENDPOINTS.KEY_RESULTS.BY_ID(keyResultId));
  },
};
