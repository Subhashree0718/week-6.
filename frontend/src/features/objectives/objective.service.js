import http from '../../services/http';
import { ENDPOINTS } from '../../constants/endpoints';

export const objectiveService = {
  async createObjective(data) {
    return await http.post(ENDPOINTS.OBJECTIVES.BASE, data);
  },
  
  async getObjectives(filters = {}) {
    const params = new URLSearchParams(filters);
    const query = params.toString();
    const url = query ? `${ENDPOINTS.OBJECTIVES.BASE}?${query}` : ENDPOINTS.OBJECTIVES.BASE;
    return await http.get(url);
  },
  
  async getObjectiveById(objectiveId) {
    return await http.get(ENDPOINTS.OBJECTIVES.BY_ID(objectiveId));
  },
  
  async updateObjective(objectiveId, data) {
    return await http.patch(ENDPOINTS.OBJECTIVES.BY_ID(objectiveId), data);
  },
  
  async deleteObjective(objectiveId) {
    return await http.delete(ENDPOINTS.OBJECTIVES.BY_ID(objectiveId));
  },
};
