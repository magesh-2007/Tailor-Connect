import { sendError } from '../utils/response.js'

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal Server Error'

  // Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyValue || {})[0] || 'Field'
    message = `A record with this ${field} already exists.`
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 422
    const messages = Object.values(err.errors).map((val) => val.message)
    message = messages.join(', ')
  }

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 400
    message = `Invalid ID format for parameter: ${err.path}`
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid authentication token'
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Authentication token expired'
  }

  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    console.error('[Error]', err)
  }

  return sendError(res, message, statusCode)
}

export const notFound = (req, res, next) => {
  return sendError(res, `API route not found: ${req.method} ${req.originalUrl}`, 404)
}
