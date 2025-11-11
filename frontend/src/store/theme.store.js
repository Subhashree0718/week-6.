import { create } from 'zustand';
import { storage } from '../utils/storage';

const prefersDark = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const applyAuroraClass = (enable) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const body = document.body;
  const className = 'theme-aurora';

  if (enable) {
    root.classList.add(className);
    if (body) body.classList.add(className);
  } else {
    root.classList.remove(className);
    if (body) body.classList.remove(className);
  }
};

const applyTheme = (theme) => {
  if (typeof document === 'undefined') return theme;

  const body = document.body;
  const resolvedTheme = theme === 'system' ? (prefersDark() ? 'dark' : 'light') : theme === 'aurora' ? 'dark' : theme;
  const nextIsDark = resolvedTheme === 'dark';

  document.documentElement.classList.toggle('dark', nextIsDark);
  if (body) {
    body.classList.toggle('dark', nextIsDark);
  }

  applyAuroraClass(theme === 'aurora');

  return resolvedTheme;
};

let systemListenerAttached = false;

const ensureSystemListener = (set) => {
  if (systemListenerAttached || typeof window === 'undefined' || !window.matchMedia) {
    return;
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = () => {
    if (storage.getTheme() === 'system') {
      const resolvedTheme = applyTheme('system');
      set({ resolvedTheme });
    }
  };

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange);
  } else {
    mediaQuery.addListener(handleChange);
  }

  systemListenerAttached = true;
};

export const useThemeStore = create((set) => ({
  theme: storage.getTheme(),
  resolvedTheme: prefersDark() ? 'dark' : 'light',

  setTheme: (theme) => {
    storage.setTheme(theme);
    const resolvedTheme = applyTheme(theme);
    set({ theme, resolvedTheme });
  },

  toggleTheme: () => {
    set((state) => {
      const currentResolved = state.resolvedTheme === 'dark' ? 'dark' : 'light';
      const nextTheme = state.theme === 'system' ? (currentResolved === 'dark' ? 'light' : 'dark') : currentResolved === 'dark' ? 'light' : 'dark';
      storage.setTheme(nextTheme);
      const resolvedTheme = applyTheme(nextTheme);
      return { theme: nextTheme, resolvedTheme };
    });
  },

  initializeTheme: () => {
    const theme = storage.getTheme();
    const resolvedTheme = applyTheme(theme);
    set({ theme, resolvedTheme });
    ensureSystemListener(set);
  },
}));
