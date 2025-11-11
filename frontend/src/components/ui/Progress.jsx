import { getProgressBgColor } from '../../utils/calcProgress';

export const Progress = ({ value = 0, showLabel = true, className = '' }) => {
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        {showLabel && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(normalizedValue)}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 dark:bg-slate-700/80 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${getProgressBgColor(normalizedValue)}`}
          style={{ width: `${normalizedValue}%` }}
        ></div>
      </div>
    </div>
  );
};
