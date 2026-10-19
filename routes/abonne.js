import express from 'express';
import { 
  createAbonne,
  getAllAbonnes,
  getAbonneById,
  deleteAbonne,
} from '../controllers/AbonnementController.js';
import authMiddleware from '../middlewares/auth.js';
import authorizeRoles from "../middlewares/roleMiddleware.js";


const router = express.Router();
router.post('/', authMiddleware, createAbonne);
router.get('/', authMiddleware, getAllAbonnes);
router.get('/:id', authMiddleware, getAbonneById);
router.delete('/:id', authMiddleware,authorizeRoles('admin'), deleteAbonne);



export default router;
