import updateService from './service.js';
import objectiveService from '../objectives/service.js';
import summarizerService from '../../openai/summarizer.js';
import Response from '../../core/Response.js';

class UpdateController {
  async createUpdate(req, res, next) {
    try {
      const update = await updateService.createUpdate(req.user.id, req.body);
      return Response.created(res, update, 'Update created successfully');
    } catch (error) {
      next(error);
    }
  }

  async getUpdates(req, res, next) {
    try {
      const updates = await updateService.getUpdates(req.params.objectiveId, req.user.id);
      return Response.success(res, updates);
    } catch (error) {
      next(error);
    }
  }

  async getUpdateById(req, res, next) {
    try {
      const update = await updateService.getUpdateById(req.params.id, req.user.id);
      return Response.success(res, update);
    } catch (error) {
      next(error);
    }
  }

  async updateUpdate(req, res, next) {
    try {
      const update = await updateService.updateUpdate(req.params.id, req.user.id, req.body);
      return Response.success(res, update, 'Update modified successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteUpdate(req, res, next) {
    try {
      const result = await updateService.deleteUpdate(req.params.id, req.user.id);
      return Response.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async generateSummary(req, res, next) {
    try {
      // Fetch both updates and objective with key results
      const updates = await updateService.getUpdates(req.params.objectiveId, req.user.id);
      const objective = await objectiveService.getObjectiveById(req.params.objectiveId, req.user.id);
      
      // Generate summary with both data sources
      const summary = await summarizerService.generateWeeklySummary(updates, objective);
      return Response.success(res, { summary }, 'Summary generated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new UpdateController();
