import crypto from 'crypto';
import prisma from '../../config/prisma.js';
import AppError from '../../core/AppError.js';
import { config } from '../../config/env.js';
import { sendMail } from '../../config/mailer.js';
import { logger } from '../../utils/logger.js';
import { hashPassword } from '../../utils/hash.js';
import { generateToken, generateRefreshToken } from '../../utils/jwt.js';

class TeamService {
  async createTeam(userId, data) {
    const team = await prisma.team.create({
      data: {
        name: data.name,
        description: data.description,
        memberships: {
          create: {
            userId,
            role: 'ADMIN',
          },
        },
      },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return team;
  }

  async getTeams(userId) {
    const teams = await prisma.team.findMany({
      where: {
        memberships: {
          some: {
            userId,
          },
        },
      },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            objectives: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return teams;
  }

  async getTeamById(teamId, userId) {
    const team = await prisma.team.findFirst({
      where: {
        id: teamId,
        memberships: {
          some: {
            userId,
          },
        },
      },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        objectives: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            keyResults: true,
            _count: {
              select: {
                updates: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!team) {
      throw new AppError('Team not found or access denied', 404);
    }

    return team;
  }

  async updateTeam(teamId, data) {
    const team = await prisma.team.update({
      where: { id: teamId },
      data: {
        name: data.name,
        description: data.description,
      },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return team;
  }

  async deleteTeam(teamId) {
    await prisma.team.delete({
      where: { id: teamId },
    });

    return { message: 'Team deleted successfully' };
  }

  async addMember(teamId, data, invitedById) {
    let targetUserId = data.userId;

    if (!targetUserId && data.email) {
      const user = await prisma.user.findUnique({
        where: { email: data.email },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      if (!user) {
        const invitation = await this.createOrRefreshInvitation({
          teamId,
          email: data.email,
          role: data.role,
          invitedById,
        });

        await this.sendInvitationEmail(invitation);

        return {
          type: 'invitation',
          data: {
            id: invitation.id,
            email: invitation.email,
            expiresAt: invitation.expiresAt,
          },
        };
      }

      targetUserId = user.id;
    }

    if (!targetUserId) {
      throw new AppError('User identifier is required to add a team member', 400);
    }

    const existingMembership = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: targetUserId,
          teamId,
        },
      },
    });

    if (existingMembership) {
      throw new AppError('User is already a member of this team', 409);
    }

    const membership = await prisma.teamMember.create({
      data: {
        teamId,
        userId: targetUserId,
        role: data.role,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return {
      type: 'membership',
      data: membership,
    };
  }

  async updateMemberRole(teamId, userId, role) {
    const membership = await prisma.teamMember.update({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
      data: {
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return membership;
  }

  async removeMember(teamId, userId) {
    await prisma.teamMember.delete({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
    });

    return { message: 'Member removed successfully' };
  }

  // ✅ Create or refresh team invitation
  async createOrRefreshInvitation({ teamId, email, role, invitedById }) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + config.email.inviteExpiresInHours * 60 * 60 * 1000);

    return await prisma.teamInvitation.upsert({
      where: {
        teamId_email: {
          teamId,
          email,
        },
      },
      update: {
        token,
        role,
        invitedById,
        expiresAt,
        acceptedAt: null,
      },
      create: {
        teamId,
        email,
        role,
        invitedById,
        token,
        expiresAt,
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async sendInvitationEmail(invitation) {
    const acceptLink = `${config.email.inviteAcceptUrl}?token=${invitation.token}`;

    try {
      await sendMail({
        to: invitation.email,
        subject: `You're invited to join ${invitation.team.name}`,
        text: `You've been invited to join ${invitation.team.name}. Use this link: ${acceptLink}`,
        html: `
          <p>You've been invited to join the team <strong>${invitation.team.name}</strong>.</p>
          <p>Click the button below to create your account and join the team.</p>
          <p style="margin:24px 0;"><a href="${acceptLink}" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;">Accept Invitation</a></p>
          <p>If the button doesn't work, copy and paste this link into your browser:<br/>${acceptLink}</p>
          <p>This invitation will expire on ${invitation.expiresAt.toISOString()}.</p>
        `,
      });
    } catch (error) {
      logger.error('Failed to send invitation email', { error });
      throw new AppError('Failed to send invitation email', 500);
    }
  }

  async acceptInvitation(token, data) {
    const invitation = await prisma.teamInvitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      throw new AppError('Invitation not found', 404);
    }

    if (invitation.acceptedAt) {
      throw new AppError('Invitation already accepted', 400);
    }

    if (invitation.expiresAt < new Date()) {
      throw new AppError('Invitation has expired', 410);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: invitation.email },
    });

    let user = existingUser;

    if (!user) {
      if (!data.password) {
        throw new AppError('Password is required to create your account', 400);
      }

      const hashedPassword = await hashPassword(data.password);

      user = await prisma.user.create({
        data: {
          email: invitation.email,
          name: data.name,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });
    } else if (data.name && data.name !== existingUser.name) {
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: { name: data.name },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });
    } else {
      user = {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        createdAt: existingUser.createdAt,
      };
    }

    const membership = await prisma.teamMember.upsert({
      where: {
        userId_teamId: {
          userId: user.id,
          teamId: invitation.teamId,
        },
      },
      update: {},
      create: {
        teamId: invitation.teamId,
        userId: user.id,
        role: invitation.role,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    await prisma.teamInvitation.update({
      where: { id: invitation.id },
      data: { acceptedAt: new Date() },
    });

    const tokenPayload = { userId: user.id, email: user.email };
    const authToken = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken({ userId: user.id });

    return {
      user,
      token: authToken,
      refreshToken,
      membership,
    };
  }
}

export default new TeamService();
