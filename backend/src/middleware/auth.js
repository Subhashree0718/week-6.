import { verifyToken } from '../utils/jwt.js';
import AppError from '../core/AppError.js';
import prisma from '../config/prisma.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      throw new AppError('User not found', 401);
    }

    req.user = {
      ...user,
      teams: decoded.teams || [],
    };
    req.tokenPayload = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...args) => {
  let options = {};

  if (args.length && typeof args[args.length - 1] === 'object' && args[args.length - 1] !== null && !Array.isArray(args[args.length - 1])) {
    options = args.pop();
  }

  const roles = args;
  const resolveTeamId = options.resolveTeamId || ((req) => req.params.teamId);

  return async (req, res, next) => {
    try {
      const teamId = await Promise.resolve(resolveTeamId(req));

      if (!teamId) {
        throw new AppError('Team ID is required', 400);
      }

      const allowedRoles = roles.length ? roles : null;

      let membership = req.user?.teams?.find((team) => team.teamId === teamId);

      if (!membership) {
        const membershipRecord = await prisma.teamMember.findUnique({
          where: {
            userId_teamId: {
              userId: req.user.id,
              teamId,
            },
          },
          select: {
            teamId: true,
            role: true,
          },
        });

        if (!membershipRecord) {
          throw new AppError('You are not a member of this team', 403);
        }

        membership = membershipRecord;

        // Keep req.user.teams in sync so downstream handlers can reuse it
        if (Array.isArray(req.user.teams)) {
          const alreadyCached = req.user.teams.some((team) => team.teamId === membership.teamId);

          if (!alreadyCached) {
            req.user.teams.push(membership);
          }
        } else {
          req.user.teams = [membership];
        }
      }

      if (allowedRoles && !allowedRoles.includes(membership.role)) {
        throw new AppError('You do not have permission to perform this action', 403);
      }

      req.membership = membership;
      req.teamId = membership.teamId;
      next();
    } catch (error) {
      next(error);
    }
  };
};
