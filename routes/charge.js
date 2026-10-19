import express from 'express'
import {
  createCharge,
  getAllCharges,
  getChargeById,
  updateCharge,
  deleteCharge,
  getChargeByUser,
} from '../controllers/ChargeController.js'
import authMiddleware from '../middlewares/auth.js'


const router = express.Router()

router.post('/',authMiddleware, createCharge)
router.get('/',authMiddleware, getAllCharges)
router.get('/users',authMiddleware,getChargeByUser)
router.get('/:id',authMiddleware, getChargeById)
router.put('/:id',authMiddleware, updateCharge)
router.delete('/:id',authMiddleware, deleteCharge)



export default router
