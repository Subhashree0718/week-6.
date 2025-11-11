export const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`glass-surface rounded-2xl shadow-card overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`px-7 py-5 border-b border-white/40 dark:border-slate-700/50 ${className}`}>
      {children}
    </div>
  );
};

export const CardBody = ({ children, className = '' }) => {
  return <div className={`px-7 py-6 ${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`px-7 py-5 border-t border-white/40 dark:border-slate-700/50 ${className}`}>
      {children}
    </div>
  );
};
