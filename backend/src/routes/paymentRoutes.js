import express from 'express'
import {
  createPayment,
  getPayments,
  getPaymentById,
  downloadReceipt
} from '../controllers/paymentController.js'
import { authenticateUser } from '../middleware/auth.js'

const router = express.Router()

router.post('/', authenticateUser, createPayment)
router.get('/', authenticateUser, getPayments)
router.get('/:id', authenticateUser, getPaymentById)
router.get('/:id/receipt', downloadReceipt)

export default router
