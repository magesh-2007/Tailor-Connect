import express from 'express'
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  registerForCourse,
  completeCourse,
  getCourseStudents
} from '../controllers/courseController.js'
import { authenticateUser, requireRole } from '../middleware/auth.js'

const router = express.Router()

// Public Course Catalog & Search
router.get('/', getCourses)
router.get('/search', getCourses)
router.get('/:id', getCourseById)

// Tailor Management
router.post('/', authenticateUser, requireRole('TAILOR', 'ADMIN'), createCourse)
router.put('/:id', authenticateUser, requireRole('TAILOR', 'ADMIN'), updateCourse)
router.get('/:courseId/students', authenticateUser, requireRole('TAILOR', 'ADMIN'), getCourseStudents)

// Student Enrollment & Completion
router.post('/:courseId/register', authenticateUser, requireRole('STUDENT', 'ADMIN'), registerForCourse)
router.patch('/:courseId/complete', authenticateUser, completeCourse)
router.patch('/:courseId/complete/:studentId', authenticateUser, completeCourse)

export default router
