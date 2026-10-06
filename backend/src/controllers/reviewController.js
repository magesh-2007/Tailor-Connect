import Review from '../models/Review.js'
import Order from '../models/Order.js'
import User from '../models/User.js'
import TailorProfile from '../models/TailorProfile.js'
import Notification from '../models/Notification.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { emitNotification } from '../services/socketService.js'

export const createReview = async (req, res, next) => {
  try {
    const { tailorId, orderId, rating, comment } = req.body

    if (!orderId || !rating || !comment) {
      return sendError(res, 'Order ID, rating (1-5), and comment are required.', 400)
    }

    const isObjectId = /^[a-f\d]{24}$/i.test(orderId)
    const orderFilter = isObjectId
      ? { _id: orderId, customerId: req.user._id }
      : { orderNumber: orderId, customerId: req.user._id }

    const order = await Order.findOne(orderFilter)
    if (!order) return sendError(res, 'Order not found or unauthorized.', 404)

    if (!['DELIVERED', 'COMPLETED'].includes(order.orderStatus)) {
      return sendError(
        res,
        `Reviews can only be submitted after your order is DELIVERED or COMPLETED. Current status: "${order.orderStatus}".`,
        400
      )
    }

    const existingReview = await Review.findOne({ orderId: order._id })
    if (existingReview) return sendError(res, 'You have already submitted a review for this order.', 409)

    const customer = await User.findById(req.user._id)
    const targetTailorId = tailorId || order.tailorId

    const review = await Review.create({
      customerId: customer._id,
      customerName: customer.name,
      customerEmail: customer.email,
      tailorId: targetTailorId,
      orderId: order._id,
      rating: Number(rating),
      comment: comment.trim()
    })

    // Mark order reviewed
    await Order.findByIdAndUpdate(order._id, { hasReviewed: true })

    // Recalculate tailor avg rating
    const allReviews = await Review.find({ tailorId: targetTailorId })
    const avgRating = parseFloat((allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1))
    await TailorProfile.findOneAndUpdate(
      { userId: targetTailorId },
      { rating: avgRating, reviewCount: allReviews.length }
    )

    // Notify tailor
    const notif = await Notification.create({
      userId: targetTailorId,
      type: 'NEW_REVIEW',
      title: 'New Customer Review ⭐',
      message: `${customer.name} gave you a ${rating}-star rating: "${comment.slice(0, 60)}..."`,
      relatedId: review._id.toString()
    })
    emitNotification(targetTailorId.toString(), notif.toObject())

    return sendSuccess(res, 'Review submitted successfully.', { review: review.toObject() }, 201)
  } catch (err) {
    next(err)
  }
}

export const getTailorReviews = async (req, res, next) => {
  try {
    const { tailorId } = req.params
    const reviews = await Review.find({ tailorId }).sort({ createdAt: -1 })
    return sendSuccess(res, 'Tailor reviews.', { reviews: reviews.map((r) => r.toObject()) })
  } catch (err) {
    next(err)
  }
}
