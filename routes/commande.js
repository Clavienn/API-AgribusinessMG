import express from 'express';
import { CreateCommande, GetAllCommandes, GetCommandeById, UpdateCommande, DeleteCommande, GetCommandesByVendeur } from '../controllers/CommandeController.js';
import authMiddleware from '../middlewares/auth.js';
import authorizeRoles from "../middlewares/roleMiddleware.js";


const router = express.Router();

router.post('/', authMiddleware, CreateCommande);
router.get('/', authMiddleware, GetAllCommandes);
router.get('/vendeur', authMiddleware, GetCommandesByVendeur);

router.get('/:id', authMiddleware, GetCommandeById);
router.put('/:id', authMiddleware, UpdateCommande);
router.delete('/:id', authMiddleware, authorizeRoles("vendeur(se)","admin") , DeleteCommande);

export default router;
