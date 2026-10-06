import express from 'express'
import {
  getOffers,
  getMyOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
  updateOfferStatus
} from '../controllers/offerController.js'
import { authenticateUser, requireRole } from '../middleware/auth.js'

const router = express.Router()

router.get('/', getOffers)
router.get('/my', authenticateUser, requireRole('TAILOR'), getMyOffers)
router.get('/:id', getOfferById)

router.post('/', authenticateUser, requireRole('TAILOR', 'ADMIN'), createOffer)
router.put('/:id', authenticateUser, requireRole('TAILOR', 'ADMIN'), updateOffer)
router.delete('/:id', authenticateUser, requireRole('TAILOR', 'ADMIN'), deleteOffer)
router.patch('/:id/status', authenticateUser, requireRole('TAILOR', 'ADMIN'), updateOfferStatus)

export default router
