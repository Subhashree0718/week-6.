export const Input = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
          error
            ? 'border-red-500'
            : 'border-gray-300 dark:border-slate-600'
        } bg-white dark:bg-slate-800/90 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
