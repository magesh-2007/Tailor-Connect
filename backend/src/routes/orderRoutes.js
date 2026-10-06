import express from 'express'
import {
  createOrder,
  getCustomerOrders,
  getOrderById,
  acceptOrder,
  rejectOrder,
  updateOrderStatus,
  updateOrderProgress,
  getOrderTracking,
  updateOrderTracking
} from '../controllers/orderController.js'
import { authenticateUser, requireRole } from '../middleware/auth.js'

const router = express.Router()

// Customer Order Operations
router.post('/', authenticateUser, requireRole('CUSTOMER', 'ADMIN'), createOrder)
router.get('/my', authenticateUser, getCustomerOrders)
router.get('/', authenticateUser, getCustomerOrders)

// Single Order Operations
router.get('/:id', authenticateUser, getOrderById)
router.patch('/:id/accept', authenticateUser, requireRole('TAILOR', 'ADMIN'), acceptOrder)
router.patch('/:id/reject', authenticateUser, requireRole('TAILOR', 'ADMIN'), rejectOrder)
router.patch('/:id/status', authenticateUser, requireRole('TAILOR', 'ADMIN'), updateOrderStatus)
router.patch('/:id/progress', authenticateUser, requireRole('TAILOR', 'ADMIN'), updateOrderProgress)

// Delivery Tracking
router.get('/:id/tracking', getOrderTracking)
router.patch('/:id/tracking', authenticateUser, requireRole('TAILOR', 'ADMIN'), updateOrderTracking)

export default router
