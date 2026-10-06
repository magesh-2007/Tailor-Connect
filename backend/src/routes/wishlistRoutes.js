import express from 'express'
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController.js'
import { authenticateUser, requireRole } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticateUser, requireRole('CUSTOMER', 'ADMIN'), getWishlist)
router.post('/', authenticateUser, requireRole('CUSTOMER', 'ADMIN'), addToWishlist)
router.delete('/:id', authenticateUser, requireRole('CUSTOMER', 'ADMIN'), removeFromWishlist)

export default router
