import { useThemeStore } from '../store/theme.store';

export const useTheme = () => {
  const { theme, resolvedTheme, setTheme, toggleTheme, initializeTheme } = useThemeStore();
  
  return {
    theme,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
    setTheme,
    toggleTheme,
    initializeTheme,
  };
};
