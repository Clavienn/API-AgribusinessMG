
import express from 'express'
import {
  createResultatCulture,
  getResultatsCulture,
  getResultatCultureById,
  updateResultatCulture,
  deleteResultatCulture,
  getResultByUser
} from '../controllers/ResultatController.js'
import authMiddleware from '../middlewares/auth.js'

const router = express.Router()

router.post('/',authMiddleware, createResultatCulture)
router.get('/',authMiddleware, getResultatsCulture)
router.get('/user',authMiddleware, getResultByUser)
router.get('/:id',authMiddleware, getResultatCultureById)
router.put('/:id',authMiddleware, updateResultatCulture)
router.delete('/:id',authMiddleware, deleteResultatCulture)

export default router
