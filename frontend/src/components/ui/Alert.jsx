import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

export const Alert = ({ type = 'info', message, onClose, className = '' }) => {
  const types = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      icon: Info,
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-200',
      icon: CheckCircle,
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-800 dark:text-yellow-200',
      icon: AlertCircle,
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-200',
      icon: XCircle,
    },
  };
  
  const config = types[type];
  const Icon = config.icon;
  
  return (
    <div
      className={`flex items-center p-4 border rounded-lg ${config.bg} ${config.border} ${className}`}
      role="alert"
    >
      <Icon className={`flex-shrink-0 w-5 h-5 ${config.text}`} />
      <div className={`ml-3 text-sm font-medium ${config.text}`}>{message}</div>
      {onClose && (
        <button
          type="button"
          className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 ${config.text} hover:bg-opacity-20`}
          onClick={onClose}
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};
