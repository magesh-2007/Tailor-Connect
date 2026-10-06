import Order from '../models/Order.js'
import Notification from '../models/Notification.js'
import { emitNotification } from '../services/socketService.js'

/**
 * Check for approaching order deadlines and notify tailors
 */
export const checkApproachingDeadlines = async () => {
  try {
    const activeOrders = await Order.find({
      orderStatus: { $in: ['REQUEST_RECEIVED', 'ACCEPTED', 'STITCHING_STARTED', 'IN_PROGRESS'] }
    }).populate('customerId tailorId')

    const now = new Date()

    for (const order of activeOrders) {
      if (!order.deadline) continue

      const deadlineDate = new Date(order.deadline)
      const diffTime = deadlineDate.getTime() - now.getTime()
      const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (remainingDays >= 0 && remainingDays <= 3) {
        // Check if reminder already sent today
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const existing = await Notification.findOne({
          userId: order.tailorId._id || order.tailorId,
          type: 'DEADLINE_REMINDER',
          relatedId: order._id.toString(),
          createdAt: { $gte: oneDayAgo }
        })

        if (!existing) {
          const tailorId = order.tailorId._id || order.tailorId
          const customerName = order.customerId?.name || 'Customer'
          const notif = await Notification.create({
            userId: tailorId,
            type: 'DEADLINE_REMINDER',
            title: `Deadline Approaching: Order #${order.orderNumber || order._id.toString().slice(-6)}`,
            message: `Order for ${customerName} (${order.designName}) is due in ${remainingDays} day(s) on ${order.deadline}.`,
            relatedId: order._id.toString()
          })
          emitNotification(tailorId.toString(), notif.toObject())
        }
      }
    }
  } catch (err) {
    console.error('[Deadline Reminder Error]', err.message)
  }
}
