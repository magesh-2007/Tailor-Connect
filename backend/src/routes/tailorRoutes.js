import express from 'express'
import {
  getTailors,
  getTailorById,
  getProfile,
  updateProfile,
  getPortfolio,
  createPortfolio,
  updatePortfolio,
  deletePortfolio
} from '../controllers/tailorController.js'
import { getTailorOrders } from '../controllers/orderController.js'
import { getTailorReviews } from '../controllers/reviewController.js'
import { authenticateUser, requireRole } from '../middleware/auth.js'

const router = express.Router()

// Discovery & Search (Public)
router.get('/', getTailors)
router.get('/search', getTailors)
router.get('/location', getTailors)

// Authenticated Tailor Profile & Incoming Orders
router.get('/profile', authenticateUser, requireRole('TAILOR'), getProfile)
router.put('/profile', authenticateUser, requireRole('TAILOR'), updateProfile)
router.get('/orders', authenticateUser, requireRole('TAILOR'), getTailorOrders)

// Portfolio Management
router.post('/portfolio', authenticateUser, requireRole('TAILOR'), createPortfolio)
router.put('/portfolio/:id', authenticateUser, requireRole('TAILOR'), updatePortfolio)
router.delete('/portfolio/:id', authenticateUser, requireRole('TAILOR'), deletePortfolio)

// Single Tailor Details & Relations
router.get('/:id', getTailorById)
router.get('/:tailorId/portfolio', getPortfolio)
router.get('/:tailorId/reviews', getTailorReviews)

export default router
