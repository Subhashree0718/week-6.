import keyResultService from './service.js';
import Response from '../../core/Response.js';

class KeyResultController {
  async createKeyResult(req, res, next) {
    try {
      const keyResult = await keyResultService.createKeyResult(req.params.objectiveId, req.body);
      return Response.created(res, keyResult, 'Key result created successfully');
    } catch (error) {
      next(error);
    }
  }

  async getKeyResults(req, res, next) {
    try {
      const keyResults = await keyResultService.getKeyResults(req.params.objectiveId);
      return Response.success(res, keyResults);
    } catch (error) {
      next(error);
    }
  }

  async getKeyResultById(req, res, next) {
    try {
      const keyResult = await keyResultService.getKeyResultById(req.params.id);
      return Response.success(res, keyResult);
    } catch (error) {
      next(error);
    }
  }

  async updateKeyResult(req, res, next) {
    try {
      const keyResult = await keyResultService.updateKeyResult(req.params.id, req.body);
      return Response.success(res, keyResult, 'Key result updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteKeyResult(req, res, next) {
    try {
      const result = await keyResultService.deleteKeyResult(req.params.id);
      return Response.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export default new KeyResultController();
