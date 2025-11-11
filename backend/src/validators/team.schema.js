import { body, param } from 'express-validator';

export const createTeamSchema = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Team name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Team name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
];

export const updateTeamSchema = [
  param('teamId')
    .notEmpty()
    .withMessage('Team ID is required'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Team name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
];

export const addMemberSchema = [
  param('teamId')
    .notEmpty()
    .withMessage('Team ID is required'),
  body('userId')
    .optional()
    .notEmpty()
    .withMessage('User ID cannot be empty when provided'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('role')
    .isIn(['ADMIN', 'MEMBER', 'VIEWER'])
    .withMessage('Role must be ADMIN, MEMBER, or VIEWER'),
  body()
    .custom((value, { req }) => {
      if (!req.body.userId && !req.body.email) {
        throw new Error('Either userId or email is required');
      }
      return true;
    }),
];

export const acceptInvitationSchema = [
  body('token')
    .notEmpty()
    .withMessage('Invitation token is required'),
  body('name')
    .notEmpty()
    .withMessage('Name is required'),
  body('password')
    .isString()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];
