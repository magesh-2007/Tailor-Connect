import Payment from '../models/Payment.js'
import Order from '../models/Order.js'
import Course from '../models/Course.js'
import User from '../models/User.js'
import TailorProfile from '../models/TailorProfile.js'
import Notification from '../models/Notification.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { generateReceiptPdf } from '../services/pdfService.js'
import { emitNotification, emitOrderStatusUpdate } from '../services/socketService.js'

const formatPayment = (p) => {
  const obj = p.toObject ? p.toObject() : { ...p }
  return {
    ...obj,
    id: obj.paymentNumber || obj._id,
    paymentNumber: obj.paymentNumber,
    userId: obj.userId,
    userName: obj.userName,
    userType: obj.userType,
    orderId: obj.orderId,
    orderNumber: obj.orderNumber,
    courseId: obj.courseId,
    tailorId: obj.tailorId,
    tailorName: obj.tailorName,
    platformFee: obj.platformFee,
    paymentMethod: obj.paymentMethod,
    transactionId: obj.transactionId,
    paidAt: obj.paidAt,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
    referenceId: obj.orderNumber || obj.paymentNumber || obj._id,
    date: new Date(obj.paidAt || obj.createdAt).toLocaleString()
  }
}

export const createPayment = async (req, res, next) => {
  try {
    const { orderId, courseId, tailorId, amount, paymentMethod, method, title } = req.body

    const user = await User.findById(req.user._id)
    const paidAmount = Number(amount) || 1800
    const txId = `TXN-TC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`
    const payNum = `PAY-${orderId ? 'ORD' : 'CRS'}-${Date.now().toString().slice(-4)}`

    let resolvedTailorId = tailorId || null
    let resolvedTailorName = 'Tailor Studio'
    let orderDoc = null
    let courseDoc = null
    let resolvedOrderId = null
    let resolvedCourseId = null

    if (orderId) {
      const isObjectId = /^[a-f\d]{24}$/i.test(orderId)
      const orderFilter = isObjectId ? { _id: orderId } : { orderNumber: orderId }
      orderDoc = await Order.findOne(orderFilter)

      if (orderDoc) {
        const tailor = await User.findById(orderDoc.tailorId)
        const tailorProfile = await TailorProfile.findOne({ userId: orderDoc.tailorId })
        orderDoc.payment_status = 'SUCCESS'
        orderDoc.paymentStatus = 'SUCCESS'
        orderDoc.paymentId = payNum
        await Order.findByIdAndUpdate(orderDoc._id, { paymentStatus: 'SUCCESS', paymentId: payNum })
        emitOrderStatusUpdate(orderDoc.toObject())
        resolvedTailorId = orderDoc.tailorId
        resolvedTailorName = tailor?.name || resolvedTailorName
        resolvedOrderId = orderDoc._id
      }
    } else if (courseId) {
      courseDoc = await Course.findById(courseId)
      if (courseDoc) {
        const tailor = await User.findById(courseDoc.tailorId)
        resolvedTailorId = courseDoc.tailorId
        resolvedTailorName = tailor?.name || resolvedTailorName
        resolvedCourseId = courseDoc._id
      }
    }

    const paymentTitle = title || (orderDoc ? `Custom Tailoring: ${orderDoc.designName}` : courseDoc ? `Course: ${courseDoc.title}` : 'TailorConnect Service Payment')

    const payment = await Payment.create({
      paymentNumber: payNum,
      userId: user._id,
      userName: user.name,
      userType: user.role === 'STUDENT' ? 'Student' : 'Customer',
      type: courseId ? 'Course' : 'Order',
      orderId: resolvedOrderId,
      orderNumber: orderDoc ? orderDoc.orderNumber : (orderId || null),
      courseId: resolvedCourseId,
      tailorId: resolvedTailorId,
      tailorName: resolvedTailorName,
      title: paymentTitle,
      amount: paidAmount,
      platformFee: 50,
      gst: Math.round(paidAmount * 0.05),
      paymentMethod: paymentMethod || method || 'UPI',
      transactionId: txId,
      status: 'SUCCESS'
    })

    // Customer notification
    const cn = await Notification.create({
      userId: user._id,
      type: 'PAYMENT_SUCCESS',
      title: 'Payment Successful 💳',
      message: `Your payment of ₹${paidAmount} was processed. Receipt #${payNum} is available for download.`,
      relatedId: payment._id.toString()
    })
    emitNotification(user._id.toString(), cn.toObject())

    // Tailor notification
    if (resolvedTailorId) {
      const tn = await Notification.create({
        userId: resolvedTailorId,
        type: 'PAYMENT_SUCCESS',
        title: 'Payment Received in Escrow 💰',
        message: `Customer ${user.name} paid ₹${paidAmount} for ${paymentTitle}.`,
        relatedId: payment._id.toString()
      })
      emitNotification(resolvedTailorId.toString(), tn.toObject())
    }

    return sendSuccess(res, 'Payment processed successfully.', { payment: formatPayment(payment) }, 201)
  } catch (err) {
    next(err)
  }
}

export const getPayments = async (req, res, next) => {
  try {
    const isTailor = req.user.role === 'TAILOR'
    const filter = isTailor ? { tailorId: req.user._id } : { userId: req.user._id }
    const payments = await Payment.find(filter).sort({ createdAt: -1 })
    return sendSuccess(res, 'Payments retrieved.', { payments: payments.map(formatPayment) })
  } catch (err) {
    next(err)
  }
}

export const getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params
    const isObjectId = /^[a-f\d]{24}$/i.test(id)
    const filter = isObjectId
      ? { _id: id }
      : { $or: [{ paymentNumber: id }, { transactionId: id }] }

    const payment = await Payment.findOne(filter)
    if (!payment) return sendError(res, 'Payment record not found.', 404)
    return sendSuccess(res, 'Payment details.', { payment: formatPayment(payment) })
  } catch (err) {
    next(err)
  }
}

export const downloadReceipt = async (req, res, next) => {
  try {
    const { id } = req.params
    const isObjectId = /^[a-f\d]{24}$/i.test(id)
    const filter = isObjectId
      ? { _id: id }
      : { $or: [{ paymentNumber: id }, { transactionId: id }] }

    const payment = await Payment.findOne(filter)
    if (!payment) return sendError(res, 'Payment receipt not found.', 404)
    generateReceiptPdf(formatPayment(payment), res)
  } catch (err) {
    next(err)
  }
}
