import express from 'express'
import { getProfile, updateProfile, getMyCourses, getCertificates } from '../controllers/studentController.js'
import { authenticateUser, requireRole } from '../middleware/auth.js'

const router = express.Router()

router.get('/profile', authenticateUser, requireRole('STUDENT', 'ADMIN'), getProfile)
router.put('/profile', authenticateUser, requireRole('STUDENT', 'ADMIN'), updateProfile)
router.get('/my-courses', authenticateUser, requireRole('STUDENT', 'ADMIN'), getMyCourses)
router.get('/certificates', authenticateUser, requireRole('STUDENT', 'ADMIN'), getCertificates)

export default router
