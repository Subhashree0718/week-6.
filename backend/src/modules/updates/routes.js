import express from 'express';
import updateController from './controller.js';
import { authenticate, authorize } from '../../middleware/auth.js';
import { body } from 'express-validator';
import { validate } from '../../middleware/validate.js';
import prisma from '../../config/prisma.js';
import AppError from '../../core/AppError.js';

const router = express.Router();

const createUpdateSchema = [
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('objectiveId').notEmpty().withMessage('Objective ID is required'),
  body('progress').optional().isFloat({ min: 0, max: 100 }),
  body('blockers').optional().trim(),
];

const resolveTeamIdFromObjective = async (req) => {
  const objectiveId = req.params.objectiveId;

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

const resolveTeamIdFromUpdate = async (req) => {
  const updateId = req.params.id;

  if (!updateId) {
    throw new AppError('Update ID is required', 400);
  }

  const update = await prisma.update.findUnique({
    where: { id: updateId },
    select: {
      objective: {
        select: { teamId: true },
      },
    },
  });

  if (!update?.objective) {
    throw new AppError('Update not found', 404);
  }

  return update.objective.teamId;
};

router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'MEMBER', { resolveTeamId: (req) => req.body.teamId || resolveTeamIdFromObjective(req) }),
  createUpdateSchema,
  validate,
  updateController.createUpdate
);

router.get(
  '/objectives/:objectiveId',
  authenticate,
  authorize({ resolveTeamId: resolveTeamIdFromObjective }),
  updateController.getUpdates
);

router.get(
  '/:id',
  authenticate,
  authorize({ resolveTeamId: resolveTeamIdFromUpdate }),
  updateController.getUpdateById
);

router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN', 'MEMBER', { resolveTeamId: resolveTeamIdFromUpdate }),
  updateController.updateUpdate
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN', { resolveTeamId: resolveTeamIdFromUpdate }),
  updateController.deleteUpdate
);

router.get(
  '/objectives/:objectiveId/summary',
  authenticate,
  authorize({ resolveTeamId: resolveTeamIdFromObjective }),
  updateController.generateSummary
);

export default router;
