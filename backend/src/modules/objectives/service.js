// import prisma from '../../config/prisma.js';
// import AppError from '../../core/AppError.js';
// import { calculateHealthForKeyResult } from '../keyresults/health.js';

// const keyResultInclude = {
//   orderBy: {
//     createdAt: 'asc',
//   },
//   include: {
//   krUpdates: {
//     orderBy: { createdAt: 'desc' },
//     take: 3,
//   },
// }

// };

// const attachHealthToObjective = (objective) => {
//   if (!objective?.keyResults) {
//     return objective;
//   }

//   return {
//     ...objective,
//     keyResults: objective.keyResults.map((kr) => ({
//       ...kr,
//       health: calculateHealthForKeyResult(kr),
//     })),
//   };
// };

// class ObjectiveService {
//   async createObjective(userId, data) {
//     const objective = await prisma.objective.create({
//       data: {
//         title: data.title,
//         description: data.description,
//         startDate: new Date(data.startDate),
//         endDate: new Date(data.endDate),
//         ownerId: userId,
//         teamId: data.teamId,
//       },
//       include: {
//         owner: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         team: {
//           select: {
//             id: true,
//             name: true,
//           },
//         },
//         keyResults: keyResultInclude,
//       },
//     });

//     return attachHealthToObjective(objective);
//   }

//   async getObjectives(userId, filters = {}) {
//     const where = {};

//     if (filters.teamId) {
//       where.teamId = filters.teamId;
//     } else {
//       where.team = {
//         memberships: {
//           some: {
//             userId,
//           },
//         },
//       };
//     }

//     if (filters.status) {
//       where.status = filters.status;
//     }

//     if (filters.ownerId) {
//       where.ownerId = filters.ownerId;
//     }

//     const objectives = await prisma.objective.findMany({
//       where,
//       include: {
//         owner: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         team: {
//           select: {
//             id: true,
//             name: true,
//           },
//         },
//         keyResults: keyResultInclude,
//         _count: {
//           select: {
//             updates: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });

//     return objectives.map(attachHealthToObjective);
//   }

//   async getObjectiveById(objectiveId, userId) {
//     const objective = await prisma.objective.findFirst({
//       where: {
//         id: objectiveId,
//         team: {
//           memberships: {
//             some: {
//               userId,
//             },
//           },
//         },
//       },
//       include: {
//         owner: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         team: {
//           select: {
//             id: true,
//             name: true,
//           },
//         },
//         keyResults: keyResultInclude,
//         updates: {
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//               },
//             },
//           },
//           orderBy: {
//             createdAt: 'desc',
//           },
//         },
//       },
//     });

//     if (!objective) {
//       throw new AppError('Objective not found or access denied', 404);
//     }

//     return objective;
//   }

//   async updateObjective(objectiveId, data) {
//     const updateData = {};

//     if (data.title !== undefined) updateData.title = data.title;
//     if (data.description !== undefined) updateData.description = data.description;
//     if (data.progress !== undefined) updateData.progress = data.progress;
//     if (data.status !== undefined) updateData.status = data.status;
//     if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
//     if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);

//     const objective = await prisma.objective.update({
//       where: { id: objectiveId },
//       data: updateData,
//       include: {
//         owner: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         team: {
//           select: {
//             id: true,
//             name: true,
//           },
//         },
//         keyResults: keyResultInclude,
//       },
//     });

//     return attachHealthToObjective(objective);
//   }

//   async deleteObjective(objectiveId) {
//     await prisma.objective.delete({
//       where: { id: objectiveId },
//     });

//     return { message: 'Objective deleted successfully' };
//   }

//   async calculateProgress(objectiveId) {
//     const keyResults = await prisma.keyResult.findMany({
//       where: { objectiveId },
//     });

//     if (keyResults.length === 0) {
//       return 0;
//     }

//     const totalProgress = keyResults.reduce((sum, kr) => {
//       const krProgress = (kr.current / kr.target) * 100;
//       return sum + Math.min(krProgress, 100);
//     }, 0);

//     const avgProgress = totalProgress / keyResults.length;

//     await prisma.objective.update({
//       where: { id: objectiveId },
//       data: { progress: avgProgress },
//     });

//     return avgProgress;
//   }
// }

// export default new ObjectiveService();
import prisma from '../../config/prisma.js';
import AppError from '../../core/AppError.js';
import { calculateHealthForKeyResult } from '../keyresults/health.js';

// ✅ Include latest KR updates
const keyResultInclude = {
  orderBy: { createdAt: 'asc' },
  include: {
    krUpdates: {
      orderBy: { createdAt: 'desc' },
      take: 3,
    },
  },
};

// ✅ Utility to attach KR health
const attachHealthToObjective = (objective) => {
  if (!objective?.keyResults) return objective;
  return {
    ...objective,
    keyResults: objective.keyResults.map((kr) => ({
      ...kr,
      updates: kr.krUpdates || [],
      krUpdates: kr.krUpdates || [],
      health: calculateHealthForKeyResult({
        ...kr,
        updates: kr.krUpdates || [],
      }),
    })),
  };
};

class ObjectiveService {
  /**
   * ✅ Create Objective — with validation & RBAC
   */
  async createObjective(userId, data) {
    const { title, description, startDate, endDate, teamId, isPersonal } = data;

    // 🔹 Validate required fields
    if (!title || !teamId || !startDate || !endDate) {
      throw new AppError('Missing required fields: title, teamId, startDate, endDate.', 400);
    }

    // 🔹 Check if the team exists
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) throw new AppError('Invalid team ID. Please select a valid team.', 400);

    // 🔹 Check if user is a member of this team
    const membership = await prisma.teamMember.findFirst({
      where: { teamId, userId },
    });
    if (!membership) throw new AppError('You are not a member of this team.', 403);

    // ✅ RBAC: Personal objectives can be created by anyone
    // Team objectives can only be created by ADMIN or MEMBER
    if (!isPersonal) {
      if (membership.role !== 'ADMIN' && membership.role !== 'MEMBER') {
        throw new AppError('Only Admin or Manager can create team objectives. You can create personal objectives.', 403);
      }
    }

    // 🔹 Validate and convert dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) {
      throw new AppError('Invalid date format. Please use YYYY-MM-DD.', 400);
    }
    if (end <= start) {
      throw new AppError('End date must be after start date.', 400);
    }

    // ✅ Create Objective safely (Prisma enum-safe)
    const objective = await prisma.objective.create({
      data: {
        title,
        description,
        startDate: start,
        endDate: end,
        progress: 0,              // Prisma requires Float default
        status: 'IN_PROGRESS',    // Matches Prisma enum
        teamId,
        ownerId: userId,          // Required foreign key
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        team: { select: { id: true, name: true } },
        keyResults: keyResultInclude,
      },
    });

    return attachHealthToObjective(objective);
  }

  /**
   * ✅ Fetch Objectives accessible to user
   */
  async getObjectives(userId, filters = {}) {
    const where = {};

    if (filters.teamId) {
      where.teamId = filters.teamId;
    } else {
      where.team = {
        memberships: { some: { userId } },
      };
    }

    if (filters.status) where.status = filters.status;
    if (filters.ownerId) where.ownerId = filters.ownerId;

    const objectives = await prisma.objective.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true, email: true } },
        team: { select: { id: true, name: true } },
        keyResults: keyResultInclude,
        _count: { select: { updates: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return objectives.map(attachHealthToObjective);
  }

  /**
   * ✅ Fetch Objective by ID (authorized)
   */
  async getObjectiveById(objectiveId, userId) {
    const objective = await prisma.objective.findFirst({
      where: {
        id: objectiveId,
        team: {
          memberships: { some: { userId } },
        },
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        team: { select: { id: true, name: true } },
        keyResults: keyResultInclude,
        updates: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!objective) throw new AppError('Objective not found or access denied', 404);

    return attachHealthToObjective(objective);
  }

  /**
   * ✅ Update Objective
   */
  async updateObjective(objectiveId, data) {
    const updateData = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.progress !== undefined) updateData.progress = data.progress;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);

    const objective = await prisma.objective.update({
      where: { id: objectiveId },
      data: updateData,
      include: {
        owner: { select: { id: true, name: true, email: true } },
        team: { select: { id: true, name: true } },
        keyResults: keyResultInclude,
      },
    });

    return attachHealthToObjective(objective);
  }

  /**
   * ✅ Delete Objective
   */
  async deleteObjective(objectiveId) {
    await prisma.objective.delete({ where: { id: objectiveId } });
    return { message: 'Objective deleted successfully' };
  }

  /**
   * ✅ Calculate Progress from Key Results
   */
  async calculateProgress(objectiveId) {
    const keyResults = await prisma.keyResult.findMany({
      where: { objectiveId },
    });

    if (keyResults.length === 0) return 0;

    const totalProgress = keyResults.reduce((sum, kr) => {
      const krProgress = (kr.current / kr.target) * 100;
      return sum + Math.min(krProgress, 100);
    }, 0);

    const avgProgress = totalProgress / keyResults.length;

    await prisma.objective.update({
      where: { id: objectiveId },
      data: { progress: avgProgress },
    });

    return avgProgress;
  }
}

export default new ObjectiveService();
