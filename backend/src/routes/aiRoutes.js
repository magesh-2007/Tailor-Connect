import express from 'express'
import multer from 'multer'
import { aiChat, aiChatWithImage, aiFindTailors, aiStatus } from '../controllers/aiController.js'
import { authenticateUser } from '../middleware/auth.js'

const router = express.Router()

// Use memory storage for image uploads (no disk write needed — sent directly to Gemini)
const memUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only image files are allowed.'))
  }
})

// Public status check (no auth required so frontend can show setup message)
router.get('/status', aiStatus)

// All other AI routes require authentication
router.use(authenticateUser)

// Text chat with conversation history
router.post('/chat', aiChat)

// Chat with image attachment (vision)
router.post('/chat-image', memUpload.single('image'), aiChatWithImage)

// Natural language tailor search
router.post('/find-tailors', aiFindTailors)

export default router
