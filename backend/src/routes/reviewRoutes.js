import express from 'express'
import { createReview, getTailorReviews } from '../controllers/reviewController.js'
import { authenticateUser, requireRole } from '../middleware/auth.js'

const router = express.Router()

router.post('/', authenticateUser, requireRole('CUSTOMER', 'ADMIN'), createReview)
router.get('/tailor/:tailorId', getTailorReviews)

export default router
