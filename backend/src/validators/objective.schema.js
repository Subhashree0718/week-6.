import { body, param } from 'express-validator';

export const createObjectiveSchema = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Objective title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('teamId')
    .notEmpty()
    .withMessage('Team ID is required'),
  body('isPersonal')
    .optional()
    .toBoolean()
    .isBoolean()
    .withMessage('isPersonal must be a boolean value'),
];

export const updateObjectiveSchema = [
  param('id')
    .notEmpty()
    .withMessage('Objective ID is required'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('progress')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Progress must be between 0 and 100'),
  body('status')
    .optional()
    .isIn(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'AT_RISK', 'BLOCKED'])
    .withMessage('Invalid status'),
];

export const createKeyResultSchema = [
  param('objectiveId')
    .notEmpty()
    .withMessage('Objective ID is required'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Key result title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('target')
    .isFloat({ min: 0 })
    .withMessage('Target must be a positive number'),
  body('unit')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Unit must not exceed 20 characters'),
];

export const updateKeyResultSchema = [
  param('id')
    .notEmpty()
    .withMessage('Key result ID is required'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('current')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Current value must be a positive number'),
  body('target')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Target must be a positive number'),
  body('blockers')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Blockers must not exceed 500 characters'),
];
