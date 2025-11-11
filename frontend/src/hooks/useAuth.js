import { useAuthStore } from '../store/auth.store';

export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout, updateUser, hasRole } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    updateUser,
    hasRole,
  };
};
