import express from 'express'
import { uploadFile } from '../controllers/uploadController.js'
import { upload } from '../config/upload.js'
import { authenticateUser } from '../middleware/auth.js'

const router = express.Router()

// Accepts either 'file' or 'image' field
router.post('/', authenticateUser, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      // If error or field wasn't 'file', try 'image'
      return upload.single('image')(req, res, (err2) => {
        if (err2) return next(err2)
        uploadFile(req, res)
      })
    }
    uploadFile(req, res)
  })
})

export default router
