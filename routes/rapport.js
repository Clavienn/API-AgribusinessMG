import express from 'express';
import { getRapportParParcelle } from '../controllers/RapportController.js';

const router = express.Router();

router.get('/:fermeID', getRapportParParcelle);

export default router;
