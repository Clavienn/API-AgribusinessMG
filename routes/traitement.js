import express from 'express'
import {
  createTraitement,
  getAllTraitements,
  getTraitementById,
  updateTraitement,
  deleteTraitement,
  getTraitementsByUser
} from '../controllers/TraitementController.js'
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.post('/',authMiddleware , createTraitement);
router.get('/',authMiddleware , getAllTraitements);
router.get('/user',authMiddleware , getTraitementsByUser);
router.get('/:id',authMiddleware , getTraitementById);
router.put('/:id',authMiddleware , updateTraitement);
router.delete('/:id',authMiddleware , deleteTraitement);

export default router;
