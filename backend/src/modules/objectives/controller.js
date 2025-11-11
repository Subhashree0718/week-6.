import objectiveService from './service.js';
import Response from '../../core/Response.js';
import AppError from '../../core/AppError.js';

class ObjectiveController {
  async createObjective(req, res, next) {
    try {
      console.log('📥 Received Objective Create Request:', req.body);
      console.log('👤 Authenticated User ID:', req.user?.id);

      // Quick backend-side validation before Prisma call
      const { title, startDate, endDate, teamId } = req.body;
      if (!title || !startDate || !endDate || !teamId) {
        throw new AppError(
          'Missing required fields. Please include title, startDate, endDate, and teamId.',
          400
        );
      }

      const objective = await objectiveService.createObjective(req.user.id, req.body);
      return Response.created(res, objective, '✅ Objective created successfully');
    } catch (error) {
      console.error('❌ Error creating objective:', error);

      // Handle Prisma validation errors clearly
      if (error.code === 'P2009' || error.code === 'P2011' || error.code === 'P2002') {
        return next(new AppError('Invalid data. Check all required fields.', 400));
      }

      if (error.code === 'P2003') {
        // Foreign key constraint failure (invalid teamId)
        return next(new AppError('Invalid team ID. Please select an existing team.', 400));
      }

      return next(error);
    }
  }

  async getObjectives(req, res, next) {
    try {
      const objectives = await objectiveService.getObjectives(req.user.id, req.query);
      return Response.success(res, objectives);
    } catch (error) {
      console.error('❌ Error fetching objectives:', error);
      next(error);
    }
  }

  async getObjectiveById(req, res, next) {
    try {
      const objective = await objectiveService.getObjectiveById(req.params.id, req.user.id);
      return Response.success(res, objective);
    } catch (error) {
      console.error('❌ Error fetching objective by ID:', error);
      next(error);
    }
  }

  async updateObjective(req, res, next) {
    try {
      console.log('📤 Updating Objective:', req.params.id, req.body);
      const objective = await objectiveService.updateObjective(req.params.id, req.body);
      return Response.success(res, objective, 'Objective updated successfully');
    } catch (error) {
      console.error('❌ Error updating objective:', error);
      next(error);
    }
  }

  async deleteObjective(req, res, next) {
    try {
      console.log('🗑️ Deleting Objective ID:', req.params.id);
      const result = await objectiveService.deleteObjective(req.params.id);
      return Response.success(res, result);
    } catch (error) {
      console.error('❌ Error deleting objective:', error);
      next(error);
    }
  }
}

export default new ObjectiveController();
