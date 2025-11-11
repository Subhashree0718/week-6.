import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-yellow-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all shadow-sm hover:shadow-md border border-gray-200 dark:border-slate-600"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};
