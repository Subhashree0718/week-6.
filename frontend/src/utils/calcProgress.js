export const calculateProgress = (current, target) => {
  if (!target || target === 0) return 0;
  const progress = (current / target) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

export const getProgressColor = (progress) => {
  if (progress >= 100) return 'text-green-600 dark:text-green-400';
  if (progress >= 75) return 'text-blue-600 dark:text-blue-400';
  if (progress >= 50) return 'text-yellow-600 dark:text-yellow-400';
  if (progress >= 25) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
};

export const getProgressBgColor = (progress) => {
  if (progress >= 100) return 'bg-green-500';
  if (progress >= 75) return 'bg-blue-500';
  if (progress >= 50) return 'bg-yellow-500';
  if (progress >= 25) return 'bg-orange-500';
  return 'bg-red-500';
};
