import prisma from '../../config/prisma.js';
import AppError from '../../core/AppError.js';

class UpdateService {
  /**
   * Create a new update entry linked to an objective
   */
  async createUpdate(userId, data) {
    const { objectiveId, content, progress } = data;

    if (!objectiveId || !content) {
      throw new AppError('Objective ID and content are required', 400);
    }

    return await prisma.update.create({
      data: {
        objectiveId,
        userId,
        content,
        progress: progress ?? 0,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  /**
   * ✅ FIX: Get all updates for an objective
   */
  async getUpdates(objectiveId, userId) {
    if (!objectiveId) throw new AppError('Objective ID is required', 400);

    return await prisma.update.findMany({
      where: {
        objectiveId,
        objective: {
          team: {
            memberships: {
              some: { userId },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  /**
   * Get single update by ID
   */
  async getUpdateById(updateId, userId) {
    const update = await prisma.update.findFirst({
      where: {
        id: updateId,
        objective: {
          team: {
            memberships: {
              some: { userId },
            },
          },
        },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!update) throw new AppError('Update not found or access denied', 404);
    return update;
  }

  /**
   * Update an update entry
   */
  async updateUpdate(updateId, userId, data) {
    const update = await prisma.update.findFirst({
      where: {
        id: updateId,
        objective: {
          team: {
            memberships: {
              some: { userId },
            },
          },
        },
      },
    });

    if (!update) throw new AppError('Update not found or unauthorized', 403);

    return await prisma.update.update({
      where: { id: updateId },
      data,
    });
  }

  /**
   * Delete an update
   */
  async deleteUpdate(updateId, userId) {
    const update = await prisma.update.findFirst({
      where: {
        id: updateId,
        objective: {
          team: {
            memberships: {
              some: { userId },
            },
          },
        },
      },
    });

    if (!update) throw new AppError('Update not found or unauthorized', 403);

    await prisma.update.delete({ where: { id: updateId } });
    return { message: 'Update deleted successfully' };
  }
}

export default new UpdateService();
