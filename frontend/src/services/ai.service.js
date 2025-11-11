import http from './http';
import { ENDPOINTS } from '../constants/endpoints';

export const aiService = {
  async generateObjectiveSummary(objectiveId) {
    return await http.get(`${ENDPOINTS.UPDATES.BASE}/objectives/${objectiveId}/summary`);
  },
};
