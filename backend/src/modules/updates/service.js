// backend/src/features/objectives/service.js
import prisma from '../../config/prisma.js';
import AppError from '../../core/AppError.js';

class ObjectiveService {
  /**
   * Create an objective
   */
  async createObjective(userId, data) {
    const objective = await prisma.objective.create({
      data: {
        title: data.title,
        description: data.description || null,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        ownerId: userId,
        teamId: data.teamId,
        progress: data.progress ?? 0,
        status: data.status ?? 'IN_PROGRESS',
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        team: { select: { id: true, name: true } },
        keyResults: true,
      },
    });

    return objective;
  }

  /**
   * Get objectives visible to a user (supports filters param)
   * filters is a plain object that will be converted to query string client-side;
   * here we accept an optional teamId or status filter from filters.
   */
  async getObjectives(userId, filters = {}) {
    const where = {
      // Objective must belong to a team where the user is a member
      team: {
        memberships: {
          some: {
            userId,
          },
        },
      },
    };

    // optional filters
    if (filters.teamId) {
      where.teamId = filters.teamId;
    }
    if (filters.status) {
      where.status = filters.status;
    }

    const objectives = await prisma.objective.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true, email: true } },
        team: { select: { id: true, name: true } },
        keyResults: {
          orderBy: { createdAt: 'asc' },
          // NO nested `updates` include here — KeyResult has no updates relation in your schema
        },
        // If you want recent updates for the objective itself:
        updates: {
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        _count: {
          select: {
            updates: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return objectives;
  }

  /**
   * Get single objective by id (ensures user is a member of the objective's team)
   */
  async getObjectiveById(objectiveId, userId) {
    const objective = await prisma.objective.findFirst({
      where: {
        id: objectiveId,
        team: {
          memberships: {
            some: {
              userId,
            },
          },
        },
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        team: { select: { id: true, name: true } },
        keyResults: {
          orderBy: { createdAt: 'asc' },
        },
        updates: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        _count: {
          select: {
            updates: true,
          },
        },
      },
    });

    if (!objective) {
      throw new AppError('Objective not found or access denied', 404);
    }

    return objective;
  }

  /**
   * Update objective
   */
  async updateObjective(objectiveId, userId, data) {
    // Optional: verify owner or membership/permission here before update.
    const objective = await prisma.objective.update({
      where: { id: objectiveId },
      data: {
        title: data.title,
        description: data.description,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        progress: data.progress,
        status: data.status,
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        team: { select: { id: true, name: true } },
        keyResults: true,
      },
    });

    return objective;
  }

  /**
   * Delete objective
   */
  async deleteObjective(objectiveId) {
    await prisma.objective.delete({ where: { id: objectiveId } });
    return { message: 'Objective deleted successfully' };
  }
}

export default new ObjectiveService();
