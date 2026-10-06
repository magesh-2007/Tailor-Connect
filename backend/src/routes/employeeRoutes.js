import express from 'express'
import { getProfile, updateProfile, getDashboard, getAllOrders } from '../controllers/employeeController.js'
import { authenticateUser, requireRole } from '../middleware/auth.js'

const router = express.Router()

// All employee routes require authentication + EMPLOYEE or ADMIN role
router.use(authenticateUser, requireRole('EMPLOYEE', 'ADMIN'))

router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.get('/dashboard', getDashboard)
router.get('/orders', getAllOrders)

export default router
