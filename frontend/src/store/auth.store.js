import { create } from 'zustand';
import { storage } from '../utils/storage';
import { ROLES } from '../constants/roles';

export const useAuthStore = create((set, get) => ({
  user: storage.getUser(),
  token: storage.getToken(),
  isAuthenticated: !!storage.getToken(),
  currentTeamId: null,
  
  login: (user, token, refreshToken) => {
    storage.setUser(user);
    storage.setToken(token);
    storage.setRefreshToken(refreshToken);
    set({ user, token, isAuthenticated: true });
  },
  
  logout: () => {
    storage.clear();
    set({ user: null, token: null, isAuthenticated: false, currentTeamId: null });
  },
  
  updateUser: (user) => {
    storage.setUser(user);
    set({ user });
  },

  setCurrentTeamId: (teamId) => set({ currentTeamId: teamId }),

  hasRole: (teamId, roles) => {
    const sourceUser = get().user || storage.getUser();

    if (!sourceUser?.teams) return false;

    const membership = sourceUser.teams.find((team) => team.teamId === teamId);
    if (!membership) return false;

    const allowedRoles = roles?.length ? roles : Object.values(ROLES);

    return allowedRoles.includes(membership.role);
  },

  getMembership: (teamId) => {
    const sourceUser = get().user || storage.getUser();
    return sourceUser?.teams?.find((team) => team.teamId === teamId) || null;
  },
}));
