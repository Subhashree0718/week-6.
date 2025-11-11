const STORAGE_KEYS = {
  TOKEN: 'okr_tracker_token',
  REFRESH_TOKEN: 'okr_tracker_refresh_token',
  USER: 'okr_tracker_user',
  THEME: 'okr_tracker_theme',
};

export const storage = {
  getToken: () => localStorage.getItem(STORAGE_KEYS.TOKEN),
  setToken: (token) => localStorage.setItem(STORAGE_KEYS.TOKEN, token),
  removeToken: () => localStorage.removeItem(STORAGE_KEYS.TOKEN),
  
  getRefreshToken: () => localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  setRefreshToken: (token) => localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token),
  removeRefreshToken: () => localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
  
  getUser: () => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },
  setUser: (user) => localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(STORAGE_KEYS.USER),
  
  getTheme: () => localStorage.getItem(STORAGE_KEYS.THEME) || 'system',
  setTheme: (theme) => localStorage.setItem(STORAGE_KEYS.THEME, theme),
  
  clear: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },
};
