import express from 'express';
import { 
  CreateFerme, 
  GetAllFermesUser,
  GetAllFermes, 
  GetFermeById, 
  UpdateFerme, 
  DeleteFerme,
  GetFermesAvecParcellesEtCultures
} from '../controllers/FermeController.js';
import authMiddleware from '../middlewares/auth.js';
import authorizeRoles from "../middlewares/roleMiddleware.js";


const router = express.Router();

router.post('/', authMiddleware, CreateFerme);
router.get('/', authMiddleware,authorizeRoles("admin"), GetAllFermes);
router.get('/user', authMiddleware, GetAllFermesUser);
router.get('/:id', authMiddleware, GetFermeById);
router.get('/details/:userId', GetFermesAvecParcellesEtCultures)
router.put('/:id', authMiddleware, UpdateFerme);
router.delete('/:id', authMiddleware,authorizeRoles('admin'), DeleteFerme);



export default router;
