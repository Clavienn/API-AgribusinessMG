import express from 'express';
import {
  createIntrant,
  getAllIntrants,
  getIntrantById,
  updateIntrant,
  deleteIntrant,
  getIntrantsByUser
} from '../controllers/IntrantController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();



router.post('/', authMiddleware, createIntrant);
router.get('/', getAllIntrants);
router.get('/user', authMiddleware, getIntrantsByUser);
router.get('/:id', authMiddleware, getIntrantById);
router.put('/:id', authMiddleware, updateIntrant);
router.delete('/:id', authMiddleware, deleteIntrant);

export default router;
