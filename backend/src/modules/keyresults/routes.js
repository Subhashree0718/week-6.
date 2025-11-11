import express from 'express';
import keyResultController from './controller.js';
import { authenticate, authorize } from '../../middleware/auth.js';
import { createKeyResultSchema, updateKeyResultSchema } from '../../validators/objective.schema.js';
import { validate } from '../../middleware/validate.js';
import prisma from '../../config/prisma.js';
import AppError from '../../core/AppError.js';

const router = express.Router();

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

const resolveTeamIdFromKeyResult = async (req) => {
  const keyResultId = req.params.id;

  if (!keyResultId) {
    throw new AppError('Key result ID is required', 400);
  }

  const keyResult = await prisma.keyResult.findUnique({
    where: { id: keyResultId },
    select: {
      objective: {
        select: { teamId: true },
      },
    },
  });

  if (!keyResult?.objective) {
    throw new AppError('Key result not found', 404);
  }

  return keyResult.objective.teamId;
};

router.post(
  '/objectives/:objectiveId/keyresults',
  authenticate,
  authorize('ADMIN', 'MEMBER', { resolveTeamId: resolveTeamIdFromObjective }),
  createKeyResultSchema,
  validate,
  keyResultController.createKeyResult
);

router.get(
  '/objectives/:objectiveId/keyresults',
  authenticate,
  authorize({ resolveTeamId: resolveTeamIdFromObjective }),
  keyResultController.getKeyResults
);

router.get(
  '/keyresults/:id',
  authenticate,
  authorize({ resolveTeamId: resolveTeamIdFromKeyResult }),
  keyResultController.getKeyResultById
);

// Allow ADMIN, MEMBER, and VIEWER to update key results
router.patch(
  '/keyresults/:id',
  authenticate,
  authorize('ADMIN', 'MEMBER', 'VIEWER', { resolveTeamId: resolveTeamIdFromKeyResult }),
  updateKeyResultSchema,
  validate,
  keyResultController.updateKeyResult
);

router.delete(
  '/keyresults/:id',
  authenticate,
  authorize('ADMIN', { resolveTeamId: resolveTeamIdFromKeyResult }),
  keyResultController.deleteKeyResult
);

export default router;
