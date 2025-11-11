import prisma from '../../config/prisma.js';
import { hashPassword, comparePassword } from '../../utils/hash.js';
import { generateToken, generateRefreshToken } from '../../utils/jwt.js';
import AppError from '../../core/AppError.js';

const userWithTeamsSelect = {
  id: true,
  email: true,
  name: true,
  bio: true,
  avatar: true,
  jobTitle: true,
  department: true,
  phone: true,
  timezone: true,
  language: true,
  dateFormat: true,
  theme: true,
  emailNotifications: true,
  objectiveUpdates: true,
  teamInvites: true,
  krMilestones: true,
  weeklyDigest: true,
  lastLoginAt: true,
  lastLoginIp: true,
  createdAt: true,
  updatedAt: true,
  memberships: {
    select: {
      teamId: true,
      role: true,
      team: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
};

const mapMemberships = (memberships = []) =>
  memberships.map((membership) => ({
    teamId: membership.teamId,
    role: membership.role,
    team: membership.team
      ? {
          id: membership.team.id,
          name: membership.team.name,
        }
      : null,
  }));

class AuthService {
  async register({ email, password, name }) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
      },
    });

    return this.buildAuthResponse(user.id);
  }

  async login({ email, password }, { ip } = {}) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ip || null,
      },
    });

    return this.buildAuthResponse(user.id);
  }

  async getProfile(userId) {
    return this.loadUserWithTeams(userId);
  }

  async updateProfile(userId, data) {
    const updateData = {};

    // Basic profile fields
    if (data.name !== undefined) updateData.name = data.name;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;
    if (data.jobTitle !== undefined) updateData.jobTitle = data.jobTitle;
    if (data.department !== undefined) updateData.department = data.department;
    if (data.phone !== undefined) updateData.phone = data.phone;

    // Preferences
    if (data.timezone !== undefined) updateData.timezone = data.timezone;
    if (data.language !== undefined) updateData.language = data.language;
    if (data.dateFormat !== undefined) updateData.dateFormat = data.dateFormat;
    if (data.theme !== undefined) updateData.theme = data.theme;

    // Notification preferences
    if (data.emailNotifications !== undefined) updateData.emailNotifications = data.emailNotifications;
    if (data.objectiveUpdates !== undefined) updateData.objectiveUpdates = data.objectiveUpdates;
    if (data.teamInvites !== undefined) updateData.teamInvites = data.teamInvites;
    if (data.krMilestones !== undefined) updateData.krMilestones = data.krMilestones;
    if (data.weeklyDigest !== undefined) updateData.weeklyDigest = data.weeklyDigest;

    // Password change
    if (data.password) {
      if (!data.currentPassword) {
        throw new AppError('Current password is required', 400);
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { password: true },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const isCurrentValid = await comparePassword(data.currentPassword, user.password);

      if (!isCurrentValid) {
        throw new AppError('Current password is incorrect', 401);
      }

      updateData.password = await hashPassword(data.password);
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return this.loadUserWithTeams(userId);
  }

  async loadUserWithTeams(userId) {
    const userRecord = await prisma.user.findUnique({
      where: { id: userId },
      select: userWithTeamsSelect,
    });

    if (!userRecord) {
      throw new AppError('User not found', 404);
    }

    const teams = mapMemberships(userRecord.memberships);

    return {
      id: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      bio: userRecord.bio,
      avatar: userRecord.avatar,
      jobTitle: userRecord.jobTitle,
      department: userRecord.department,
      phone: userRecord.phone,
      timezone: userRecord.timezone,
      language: userRecord.language,
      dateFormat: userRecord.dateFormat,
      theme: userRecord.theme,
      emailNotifications: userRecord.emailNotifications,
      objectiveUpdates: userRecord.objectiveUpdates,
      teamInvites: userRecord.teamInvites,
      krMilestones: userRecord.krMilestones,
      weeklyDigest: userRecord.weeklyDigest,
      lastLoginAt: userRecord.lastLoginAt,
      lastLoginIp: userRecord.lastLoginIp,
      createdAt: userRecord.createdAt,
      updatedAt: userRecord.updatedAt,
      teams,
    };
  }

  async buildAuthResponse(userId) {
    const user = await this.loadUserWithTeams(userId);

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      teams: user.teams.map(({ teamId, role }) => ({ teamId, role })),
    };

    const token = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken({ userId: user.id });

    return {
      user,
      token,
      refreshToken,
    };
  }
}

export default new AuthService();
