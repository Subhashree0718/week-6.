import http from '../../services/http';
import { ENDPOINTS } from '../../constants/endpoints';

export const teamService = {
  async createTeam(data) {
    return await http.post(ENDPOINTS.TEAMS.BASE, data);
  },

  async getTeams() {
    return await http.get(ENDPOINTS.TEAMS.BASE);
  },

  async getTeamById(teamId) {
    return await http.get(ENDPOINTS.TEAMS.BY_ID(teamId));
  },

  async updateTeam(teamId, data) {
    return await http.patch(ENDPOINTS.TEAMS.BY_ID(teamId), data);
  },

  async deleteTeam(teamId) {
    return await http.delete(ENDPOINTS.TEAMS.BY_ID(teamId));
  },

  async addMember(teamId, data) {
    return await http.post(ENDPOINTS.TEAMS.MEMBERS(teamId), data);
  },

  async updateMemberRole(teamId, userId, role) {
    return await http.patch(ENDPOINTS.TEAMS.MEMBER(teamId, userId), { role });
  },

  async removeMember(teamId, userId) {
    return await http.delete(ENDPOINTS.TEAMS.MEMBER(teamId, userId));
  },

  async acceptInvitation(data) {
    return await http.post('/teams/invitations/accept', data);
  },
};
