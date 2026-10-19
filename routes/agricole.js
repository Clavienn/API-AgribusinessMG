import express from 'express';
import { createActivite, deleteActivite, getActiviteById, getAllActivites, getActivitesByUser , updateActivite } from '../controllers/AgricultController.js';
import authMiddleware from '../middlewares/auth.js';
const router = express.Router();



router.post('/', authMiddleware, createActivite);
router.get('/', getAllActivites);
router.get('/user',authMiddleware, getActivitesByUser);
router.get('/:id', authMiddleware, getActiviteById);
router.put('/:id', authMiddleware, updateActivite);
router.delete('/:id', authMiddleware, deleteActivite);


export default router;
