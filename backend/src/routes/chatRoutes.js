import express from 'express'
import {
  getConversations,
  getMessages,
  sendMessage
} from '../controllers/chatController.js'
import { authenticateUser } from '../middleware/auth.js'

const router = express.Router()

router.get('/conversations', authenticateUser, getConversations)
router.get('/conversations/:id/messages', authenticateUser, getMessages)
router.post('/conversations/:id/messages', authenticateUser, sendMessage)

export default router
