import express from 'express'
import {
  getNotifications,
  markAsRead,
  markAllAsRead
} from '../controllers/notificationController.js'
import { authenticateUser } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticateUser, getNotifications)
router.patch('/read-all', authenticateUser, markAllAsRead)
router.patch('/:id/read', authenticateUser, markAsRead)

export default router
