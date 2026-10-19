import express from 'express';
import { createStockIntrant, deleteStockIntrant, getAllStockIntrants, getStockIntrantById, getStockIntrantByUser, updateStockIntrant } from '../controllers/IntrantStockController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.post('/', authMiddleware, createStockIntrant);
router.get('/', getAllStockIntrants);
router.get('/user', authMiddleware, getStockIntrantByUser);
router.get('/:id', authMiddleware, getStockIntrantById);
router.put('/:id', authMiddleware, updateStockIntrant);
router.delete('/:id', authMiddleware, deleteStockIntrant);

export default router;
