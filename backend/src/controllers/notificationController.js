import Notification from '../models/Notification.js'
import { sendSuccess, sendError } from '../utils/response.js'

function formatRelativeTime(date) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / (1000 * 60))
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 })
    return sendSuccess(res, 'Notifications retrieved.', {
      notifications: notifications.map((n) => {
        const obj = n.toObject()
        return {
          ...obj,
          id: obj._id,
          read: obj.isRead,
          isRead: obj.isRead,
          userId: obj.userId,
          relatedId: obj.relatedId,
          createdAt: obj.createdAt,
          time: formatRelativeTime(obj.createdAt)
        }
      })
    })
  } catch (err) {
    next(err)
  }
}

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params
    const notif = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { isRead: true },
      { new: true }
    ).catch(() => null)

    if (!notif) return sendError(res, 'Notification not found.', 404)
    return sendSuccess(res, 'Notification marked as read.', { notification: notif.toObject() })
  } catch (err) {
    next(err)
  }
}

export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true })
    return sendSuccess(res, 'All notifications marked as read.')
  } catch (err) {
    next(err)
  }
}
