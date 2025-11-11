import express from 'express';
import teamController from './controller.js';
import { authenticate, authorize } from '../../middleware/auth.js';
import { createTeamSchema, updateTeamSchema, addMemberSchema, acceptInvitationSchema } from '../../validators/team.schema.js';
import { validate } from '../../middleware/validate.js';

const router = express.Router();

router.post('/', authenticate, createTeamSchema, validate, teamController.createTeam);
router.get('/', authenticate, teamController.getTeams);
router.get('/:teamId', authenticate, teamController.getTeamById);
router.patch('/:teamId', authenticate, authorize('ADMIN'), updateTeamSchema, validate, teamController.updateTeam);
router.delete('/:teamId', authenticate, authorize('ADMIN'), teamController.deleteTeam);

router.post('/:teamId/members', authenticate, authorize('ADMIN'), addMemberSchema, validate, teamController.addMember);
router.patch('/:teamId/members/:userId', authenticate, authorize('ADMIN'), teamController.updateMemberRole);
router.delete('/:teamId/members/:userId', authenticate, authorize('ADMIN'), teamController.removeMember);

router.post('/invitations/accept', acceptInvitationSchema, validate, teamController.acceptInvitation);

export default router;
