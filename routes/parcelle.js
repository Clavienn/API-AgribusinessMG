import express from 'express';
import { createParcelle, deleteParcelle, getAllParcelles, getParcelleByFermeId, getParcelleById, getParcellesForCurrentUser, updateParcelle } from '../controllers/ParcelleController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.post('/', authMiddleware, createParcelle);
router.get('/', authMiddleware, getAllParcelles);
router.get('/ferme/:fermeID', authMiddleware, getParcelleByFermeId);
router.get('/user', authMiddleware, getParcellesForCurrentUser);
router.get('/:id', authMiddleware, getParcelleById);
router.put('/:id', authMiddleware, updateParcelle);
router.delete('/:id', authMiddleware, deleteParcelle);


export default router;
