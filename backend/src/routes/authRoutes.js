import express from 'express'
import { register, login, googleLogin, me, updateMe, logout } from '../controllers/authController.js'
import { authenticateUser } from '../middleware/auth.js'
import { authRateLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()

router.post('/register', authRateLimiter, register)
router.post('/login',    authRateLimiter, login)
router.post('/google',   authRateLimiter, googleLogin)
router.post('/logout',   logout)
router.get('/me',        authenticateUser, me)
router.patch('/me',      authenticateUser, updateMe)

export default router
