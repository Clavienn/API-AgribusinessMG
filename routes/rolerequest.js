import express from 'express';
import { demandeChangeRole, listRoleRequests } from '../controllers/RoleRequestController.js';

const router = express.Router();

router.post('/:id', demandeChangeRole);
router.get('/', listRoleRequests);

export default router;
