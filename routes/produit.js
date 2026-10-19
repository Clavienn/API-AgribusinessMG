import express from 'express';
import upload from '../middlewares/upload.js';
import authorizeRoles from "../middlewares/roleMiddleware.js";
import {
  CreateProduit,
  GetAllProduits,
  GetProduitById,
  UpdateProduit,
  DeleteProduit,
} from '../controllers/ProduitController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();
router.post('/', authMiddleware,authorizeRoles('vendeur(se)','admin','formateur'), upload.array('images', 10), CreateProduit);
router.get('/', GetAllProduits);
router.get('/:id', GetProduitById);
router.put('/:id', authMiddleware,authorizeRoles('formateur','vendeur(se)','admin'), upload.array('images', 10), UpdateProduit);
router.delete('/:id', authMiddleware,authorizeRoles('admin'), DeleteProduit);

export default router;
