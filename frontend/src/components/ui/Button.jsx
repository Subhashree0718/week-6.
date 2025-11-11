export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed gap-2';
  
  const variants = {
    primary: 'bg-gradient-brand text-white shadow-lg shadow-primary-600/30 hover:shadow-primary-600/40 focus:ring-primary-400',
    secondary: 'bg-white/70 dark:bg-slate-700/80 text-gray-900 dark:text-gray-100 border border-white/60 dark:border-slate-500/40 shadow-sm hover:shadow-md focus:ring-primary-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md focus:ring-red-500',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md focus:ring-emerald-400',
    outline: 'border-2 border-primary-500 dark:border-primary-400 text-primary-600 dark:text-primary-300 hover:bg-primary-50/70 dark:hover:bg-primary-900/40 focus:ring-primary-500',
    ghost: 'text-gray-700 hover:bg-white/60 dark:text-gray-200 dark:hover:bg-slate-800/70 focus:ring-gray-500',
  };
  
  const sizes = {
    sm: 'px-3.5 py-2 text-xs uppercase tracking-wide',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin-slow -ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};
