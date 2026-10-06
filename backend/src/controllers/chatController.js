import Order from '../models/Order.js'
import User from '../models/User.js'
import TailorProfile from '../models/TailorProfile.js'
import Conversation from '../models/Conversation.js'
import Message from '../models/Message.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { emitChatMessage } from '../services/socketService.js'

export const getConversations = async (req, res, next) => {
  try {
    const isTailor = req.user.role === 'TAILOR'
    const myId = req.user._id

    const orderFilter = isTailor ? { tailorId: myId } : { customerId: myId }
    const orders = await Order.find(orderFilter)

    const contactMap = new Map()

    for (const ord of orders) {
      const pairKey = `${ord.customerId}_${ord.tailorId}`
      if (contactMap.has(pairKey)) continue

      let conv = await Conversation.findOne({ customerId: ord.customerId, tailorId: ord.tailorId })
      if (!conv) {
        conv = await Conversation.create({
          customerId: ord.customerId,
          tailorId: ord.tailorId,
          orderId: ord._id
        })
      }

      const [customer, tailor, tailorProfile] = await Promise.all([
        User.findById(ord.customerId),
        User.findById(ord.tailorId),
        TailorProfile.findOne({ userId: ord.tailorId })
      ])

      const contactId = isTailor ? ord.customerId : ord.tailorId
      const contactName = isTailor ? customer?.name : (tailorProfile?.shopName || tailor?.name)
      const contactPhone = isTailor ? customer?.phone : tailor?.phone
      const contactImage = isTailor ? customer?.profileImage : tailor?.profileImage

      contactMap.set(pairKey, {
        id: conv._id,
        conversationId: conv._id,
        contactId,
        name: contactName,
        shopName: isTailor ? null : (tailorProfile?.shopName || `${tailor?.name || ''}'s Studio`),
        phone: contactPhone,
        orderId: ord.orderNumber || ord._id,
        orderItem: ord.designName,
        status: ord.orderStatus,
        avatar: contactImage || (isTailor
          ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'
          : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'),
        lastMessage: conv.lastMessage || `Order #${ord.orderNumber || ord._id} discussion`,
        lastMessageAt: conv.lastMessageAt
      })
    }

    return sendSuccess(res, 'Chat conversations retrieved.', { conversations: Array.from(contactMap.values()) })
  } catch (err) {
    next(err)
  }
}

export const getMessages = async (req, res, next) => {
  try {
    const { id } = req.params
    const myId = req.user._id
    const isObjectId = /^[a-f\d]{24}$/i.test(id)

    let conv = null
    if (isObjectId) {
      conv = await Conversation.findOne({
        $or: [
          { _id: id },
          { customerId: myId, tailorId: id },
          { tailorId: myId, customerId: id }
        ]
      }).catch(() => null)
    }

    if (!conv) {
      return sendSuccess(res, 'No conversation history found.', { messages: [] })
    }

    const messages = await Message.find({ conversationId: conv._id }).sort({ createdAt: 1 })
    const senderIds = [...new Set(messages.map((m) => m.senderId.toString()))]
    const senders = await User.find({ _id: { $in: senderIds } })
    const senderMap = Object.fromEntries(senders.map((u) => [u._id.toString(), u]))

    const formatted = messages.map((m) => {
      const sender = senderMap[m.senderId.toString()]
      return {
        ...m.toObject(),
        id: m._id,
        text: m.message,
        timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        senderId: m.senderId,
        receiverId: m.receiverId,
        conversationId: m.conversationId,
        senderRole: m.senderRole,
        senderName: sender?.name,
        senderImage: sender?.profileImage,
        readAt: m.readAt,
        createdAt: m.createdAt
      }
    })

    return sendSuccess(res, 'Chat messages retrieved.', { messages: formatted })
  } catch (err) {
    next(err)
  }
}

export const sendMessage = async (req, res, next) => {
  try {
    const { id } = req.params
    const { message, text, image, orderId } = req.body
    const content = (message || text || '').trim()
    const myId = req.user._id
    const isObjectId = /^[a-f\d]{24}$/i.test(id)

    if (!content && !image) return sendError(res, 'Message text or image is required.', 400)

    let conv = null
    if (isObjectId) {
      conv = await Conversation.findOne({
        $or: [
          { _id: id },
          { customerId: myId, tailorId: id },
          { tailorId: myId, customerId: id }
        ]
      }).catch(() => null)
    }

    if (!conv) {
      const orderFilter = isObjectId
        ? {
            $or: [
              { customerId: myId, tailorId: id },
              { tailorId: myId, customerId: id }
            ]
          }
        : { _id: null }

      const ord = await Order.findOne(orderFilter)
      if (!ord) return sendError(res, 'Cannot start chat without a valid order relationship.', 403)

      conv = await Conversation.create({
        customerId: ord.customerId,
        tailorId: ord.tailorId,
        orderId: ord._id
      })
    }

    const receiverId = conv.customerId.toString() === myId.toString() ? conv.tailorId : conv.customerId

    const newMsg = await Message.create({
      conversationId: conv._id,
      orderId: orderId || null,
      senderId: myId,
      senderRole: req.user.role.toLowerCase(),
      receiverId,
      message: content,
      image: image || null
    })

    conv.lastMessage = content
    conv.lastMessageAt = new Date()
    await conv.save()

    const formatted = {
      ...newMsg.toObject(),
      text: content,
      timestamp: new Date(newMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      senderId: newMsg.senderId,
      receiverId: newMsg.receiverId
    }

    emitChatMessage(receiverId.toString(), formatted)

    return sendSuccess(res, 'Message sent successfully.', { message: formatted }, 201)
  } catch (err) {
    next(err)
  }
}
