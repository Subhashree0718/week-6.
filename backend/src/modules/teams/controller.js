import teamService from './service.js';
import Response from '../../core/Response.js';

class TeamController {
  async createTeam(req, res, next) {
    try {
      const team = await teamService.createTeam(req.user.id, req.body);
      return Response.created(res, team, 'Team created successfully');
    } catch (error) {
      next(error);
    }
  }

  async getTeams(req, res, next) {
    try {
      const teams = await teamService.getTeams(req.user.id);
      return Response.success(res, teams);
    } catch (error) {
      next(error);
    }
  }

  async getTeamById(req, res, next) {
    try {
      const team = await teamService.getTeamById(req.params.teamId, req.user.id);
      return Response.success(res, team);
    } catch (error) {
      next(error);
    }
  }

  async updateTeam(req, res, next) {
    try {
      const team = await teamService.updateTeam(req.params.teamId, req.body);
      return Response.success(res, team, 'Team updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteTeam(req, res, next) {
    try {
      const result = await teamService.deleteTeam(req.params.teamId);
      return Response.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async addMember(req, res, next) {
    try {
      const result = await teamService.addMember(req.params.teamId, req.body, req.user.id);

      if (result.type === 'membership') {
        return Response.created(res, result.data, 'Member added successfully');
      }

      return Response.created(res, result.data, 'Invitation sent successfully');
    } catch (error) {
      next(error);
    }
  }

  async acceptInvitation(req, res, next) {
    try {
      const result = await teamService.acceptInvitation(req.body.token, req.body);
      return Response.success(res, result, 'Invitation accepted successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateMemberRole(req, res, next) {
    try {
      const membership = await teamService.updateMemberRole(
        req.params.teamId,
        req.params.userId,
        req.body.role
      );
      return Response.success(res, membership, 'Member role updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async removeMember(req, res, next) {
    try {
      const result = await teamService.removeMember(req.params.teamId, req.params.userId);
      return Response.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export default new TeamController();
