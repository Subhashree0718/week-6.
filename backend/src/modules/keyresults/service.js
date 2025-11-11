import prisma from '../../config/prisma.js';
import AppError from '../../core/AppError.js';
import objectiveService from '../objectives/service.js';
import { calculateHealthForKeyResult } from './health.js';

const buildUpdatesInclude = (take = 5) => ({
  orderBy: {
    createdAt: 'desc',
  },
  take,
});

const withHealth = (keyResult) => ({
  ...keyResult,
  health: calculateHealthForKeyResult(keyResult),
});

const shouldCaptureUpdate = (data) => data.current !== undefined || data.blockers !== undefined;

const normalizeBlockers = (blockers) => {
  if (blockers === undefined || blockers === null) {
    return null;
  }

  if (typeof blockers !== 'string') {
    return null;
  }

  const trimmed = blockers.trim();
  return trimmed.length ? trimmed : null;
};

class KeyResultService {
  async createKeyResult(objectiveId, data) {
    const keyResult = await prisma.keyResult.create({
      data: {
        title: data.title,
        target: data.target,
        current: data.current || 0,
        unit: data.unit || '%',
        objectiveId,
      },
    });

    await objectiveService.calculateProgress(objectiveId);

    return withHealth({
      ...keyResult,
      updates: [],
    });
  }

  async getKeyResults(objectiveId) {
    const keyResults = await prisma.keyResult.findMany({
      where: { objectiveId },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        updates: buildUpdatesInclude(3),
      },
    });

    return keyResults.map(withHealth);
  }

  async getKeyResultById(keyResultId) {
    const keyResult = await prisma.keyResult.findUnique({
      where: { id: keyResultId },
      include: {
        objective: {
          select: {
            id: true,
            title: true,
          },
        },
        updates: buildUpdatesInclude(5),
      },
    });

    if (!keyResult) {
      throw new AppError('Key result not found', 404);
    }

    return withHealth(keyResult);
  }

  async updateKeyResult(keyResultId, data) {
    const updateData = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.current !== undefined) updateData.current = data.current;
    if (data.target !== undefined) updateData.target = data.target;
    if (data.unit !== undefined) updateData.unit = data.unit;

    const keyResult = await prisma.keyResult.update({
      where: { id: keyResultId },
      data: updateData,
    });

    if (shouldCaptureUpdate(data)) {
      await prisma.keyResultUpdate.create({
        data: {
          keyResultId,
          current: data.current !== undefined ? data.current : keyResult.current,
          blockers: normalizeBlockers(data.blockers),
        },
      });
    }

    await objectiveService.calculateProgress(keyResult.objectiveId);

    const enrichedKeyResult = await prisma.keyResult.findUnique({
      where: { id: keyResultId },
      include: {
        updates: buildUpdatesInclude(3),
      },
    });

    return withHealth(enrichedKeyResult);
  }

  async deleteKeyResult(keyResultId) {
    const keyResult = await prisma.keyResult.findUnique({
      where: { id: keyResultId },
    });

    if (!keyResult) {
      throw new AppError('Key result not found', 404);
    }

    await prisma.keyResult.delete({
      where: { id: keyResultId },
    });

    await objectiveService.calculateProgress(keyResult.objectiveId);

    return { message: 'Key result deleted successfully' };
  }
}

export default new KeyResultService();
