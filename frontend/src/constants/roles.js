export const ROLES = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
  VIEWER: 'VIEWER',
};

export const ROLE_LABELS = {
  ADMIN: 'Admin (Owner)',
  MEMBER: 'Manager',
  VIEWER: 'Viewer',
};

export const ROLE_COLORS = {
  ADMIN: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  MEMBER: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  VIEWER: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
};

export const STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  AT_RISK: 'AT_RISK',
  BLOCKED: 'BLOCKED',
};

export const STATUS_LABELS = {
  [STATUS.NOT_STARTED]: 'Not Started',
  [STATUS.IN_PROGRESS]: 'In Progress',
  [STATUS.COMPLETED]: 'Completed',
  [STATUS.AT_RISK]: 'At Risk',
  [STATUS.BLOCKED]: 'Blocked',
};

export const STATUS_COLORS = {
  [STATUS.NOT_STARTED]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  [STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [STATUS.COMPLETED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [STATUS.AT_RISK]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [STATUS.BLOCKED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};
