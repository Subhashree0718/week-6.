import express from 'express';
import objectiveController from './controller.js';
import { authenticate, authorize } from '../../middleware/auth.js';
import { createObjectiveSchema, updateObjectiveSchema } from '../../validators/objective.schema.js';
import { validate } from '../../middleware/validate.js';
import prisma from '../../config/prisma.js';
import AppError from '../../core/AppError.js';

const router = express.Router();

const resolveTeamIdFromObjective = async (req) => {
  const objectiveId = req.params.id || req.params.objectiveId;

  if (!objectiveId) {
    throw new AppError('Objective ID is required', 400);
  }

  const objective = await prisma.objective.findUnique({
    where: { id: objectiveId },
    select: { teamId: true },
  });

  if (!objective) {
    throw new AppError('Objective not found', 404);
  }

  return objective.teamId;
};

// For objectives creation, we allow ADMIN, MEMBER, and VIEWER
// The service layer will enforce the rule that VIEWER can only create personal objectives
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'MEMBER', 'VIEWER', {
    resolveTeamId: (req) => {
      if (!req.body.teamId) {
        throw new AppError('Team ID is required', 400);
      }
      return req.body.teamId;
    },
  }),
  createObjectiveSchema,
  validate,
  objectiveController.createObjective
);

router.get('/', authenticate, objectiveController.getObjectives);

router.get(
  '/:id',
  authenticate,
  authorize({ resolveTeamId: resolveTeamIdFromObjective }),
  objectiveController.getObjectiveById
);

router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN', 'MEMBER', { resolveTeamId: resolveTeamIdFromObjective }),
  updateObjectiveSchema,
  validate,
  objectiveController.updateObjective
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN', { resolveTeamId: resolveTeamIdFromObjective }),
  objectiveController.deleteObjective
);

export default router;
