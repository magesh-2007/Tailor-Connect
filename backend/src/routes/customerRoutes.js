import express from 'express'
import { getProfile, updateProfile } from '../controllers/customerController.js'
import { authenticateUser, requireRole } from '../middleware/auth.js'

const router = express.Router()

router.get('/profile', authenticateUser, requireRole('CUSTOMER', 'ADMIN'), getProfile)
router.put('/profile', authenticateUser, requireRole('CUSTOMER', 'ADMIN'), updateProfile)

export default router
