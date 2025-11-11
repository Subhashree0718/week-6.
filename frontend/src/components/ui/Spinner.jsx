export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-14 w-14 border-4',
  };
  
  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-gray-200/40 dark:border-gray-700/30 border-t-transparent bg-gradient-brand/10 shadow-lg shadow-primary-500/20 ${sizes[size]} ${className}`}
        style={{ borderTopColor: 'rgba(99, 102, 241, 0.85)', borderRightColor: 'rgba(20, 184, 166, 0.65)' }}
      ></div>
    </div>
  );
};
