import express from 'express';
import upload from '../middlewares/upload.js';
import authenticate from "../middlewares/auth.js";
import {
  createPartenaire,
  getAllPartenaires,
  getPartenaireById,
  updatePartenaire,
  deletePartenaire,
  getAllPartenaireActif
} from '../controllers/PartenaireController.js';

const router = express.Router();

router.post('/', authenticate, upload.single('logo'), createPartenaire);
router.get('/actif', getAllPartenaireActif);
router.get('/', authenticate, getAllPartenaires);
router.get('/:id', getPartenaireById);
router.put('/:id', authenticate, upload.single('logo'), updatePartenaire);
router.delete('/:id', authenticate, deletePartenaire);

export default router;
