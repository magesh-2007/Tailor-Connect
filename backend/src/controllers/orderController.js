import Order from '../models/Order.js'
import User from '../models/User.js'
import Delivery from '../models/Delivery.js'
import Notification from '../models/Notification.js'
import TailorProfile from '../models/TailorProfile.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { emitNotification, emitOrderStatusUpdate } from '../services/socketService.js'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatOrder = (o) => {
  const obj = o.toObject ? o.toObject() : { ...o }
  return {
    ...obj,
    id: obj._id,
    customerId: obj.customerId,
    tailorId: obj.tailorId,
    orderNumber: obj.orderNumber,
    dressType: obj.dressType,
    designName: obj.designName,
    designImage: obj.designImage,
    deliveryAddress: obj.deliveryAddress,
    deliveryLocation: obj.deliveryLocation,
    paymentStatus: obj.paymentStatus,
    paymentId: obj.paymentId,
    orderStatus: obj.orderStatus,
    orderDate: obj.orderDate,
    deliveredAt: obj.deliveredAt,
    hasReviewed: obj.hasReviewed,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
    measurements: {
      bust: obj.measBust,
      waist: obj.measWaist,
      hip: obj.measHip,
      shoulder: obj.measShoulder,
      sleeveLength: obj.measSleeveLength,
      dressLength: obj.measDressLength,
      armhole: obj.measArmhole,
      neck: obj.measNeck
    },
    item: obj.designName,
    amount: obj.price,
    status: obj.orderStatus,
    deliveryDate: obj.deadline
  }
}

const findOrder = async (id, tailorId = null) => {
  const isObjectId = /^[a-f\d]{24}$/i.test(id)
  const filter = isObjectId ? { _id: id } : { orderNumber: id }
  if (tailorId) filter.tailorId = tailorId
  return Order.findOne(filter)
}

// ─── Controllers ─────────────────────────────────────────────────────────────

export const createOrder = async (req, res, next) => {
  try {
    const {
      tailorId, dressType, designName, designImage, category, fabric, color,
      quantity, measurements, specialInstructions, deliveryAddress, deliveryLocation,
      price, amount, budget, deadline, deliveryDate, urgent
    } = req.body

    if (!tailorId || !designName) {
      return sendError(res, 'Tailor ID and design name are required.', 400)
    }

    const [customer, tailor] = await Promise.all([
      User.findById(req.user._id),
      User.findById(tailorId)
    ])
    if (!tailor) return sendError(res, 'Specified tailor studio does not exist.', 404)

    const orderAmount = Number(price || amount || budget || 1800)
    const m = measurements || {}
    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`
    const deadlineVal = deadline || deliveryDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]

    const order = await Order.create({
      orderNumber,
      customerId: customer._id,
      tailorId: tailor._id,
      dressType: dressType || category || 'Custom Blouse',
      designName: designName.trim(),
      designImage: designImage || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
      category: category || 'Bridal Blouse',
      fabric: fabric || 'Pure Silk',
      color: color || 'Royal Crimson Pink',
      quantity: Number(quantity) || 1,
      measBust: m.bust || '36',
      measWaist: m.waist || '30',
      measHip: m.hip || '38',
      measShoulder: m.shoulder || '14.5',
      measSleeveLength: m.sleeveLength || '11.0',
      measDressLength: m.dressLength || '15.0',
      specialInstructions: specialInstructions || '',
      deliveryAddress: deliveryAddress || customer.address || 'Chennai',
      deliveryLocation: deliveryLocation || customer.location || 'Chennai',
      price: orderAmount,
      deadline: deadlineVal,
      urgent: Boolean(urgent),
      orderStatus: 'REQUEST_RECEIVED',
      progress: 10,
      orderDate: new Date().toISOString().split('T')[0]
    })

    // Create delivery
    await Delivery.create({
      orderId: order._id,
      status: 'Order Confirmed - Awaiting Studio Acceptance',
      currentLocation: customer.location || 'Chennai',
      deliveryPartner: 'TailorConnect Direct Logistics',
      expectedDeliveryDate: deadlineVal
    })

    // Notify tailor
    const tn = await Notification.create({
      userId: tailor._id,
      type: 'ORDER_CREATED',
      title: 'New Customized Order Received',
      message: `${customer.name} placed order #${orderNumber} for "${designName}".`,
      relatedId: order._id.toString()
    })
    emitNotification(tailor._id.toString(), tn.toObject())

    // Notify customer
    const cn = await Notification.create({
      userId: customer._id,
      type: 'ORDER_CREATED',
      title: 'Order Request Placed Successfully',
      message: `Your order #${orderNumber} has been submitted to ${tailor.name}.`,
      relatedId: order._id.toString()
    })
    emitNotification(customer._id.toString(), cn.toObject())

    const json = formatOrder(order)
    json.customer = customer.name
    json.customerEmail = customer.email
    json.customerPhone = customer.phone
    json.tailor = tailor.name
    json.tailorEmail = tailor.email

    return sendSuccess(res, 'Order created successfully.', { order: json }, 201)
  } catch (err) {
    next(err)
  }
}

export const getCustomerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customerId: req.user._id }).sort({ createdAt: -1 })

    const tailorIds = [...new Set(orders.map((o) => o.tailorId.toString()))]
    const tailors = await User.find({ _id: { $in: tailorIds } })
    const tailorProfiles = await TailorProfile.find({ userId: { $in: tailorIds } })
    const tailorMap = Object.fromEntries(tailors.map((u) => [u._id.toString(), u]))
    const profileMap = Object.fromEntries(tailorProfiles.map((p) => [p.userId.toString(), p]))

    const formatted = orders.map((o) => {
      const json = formatOrder(o)
      const t = tailorMap[o.tailorId.toString()]
      const tp = profileMap[o.tailorId.toString()]
      json.tailor = t?.name || ''
      json.tailorShop = tp?.shopName || `${t?.name || ''}'s Studio`
      json.tailorPhone = t?.phone || ''
      json.tailorEmail = t?.email || ''
      return json
    })

    return sendSuccess(res, 'Customer orders retrieved.', { orders: formatted })
  } catch (err) {
    next(err)
  }
}

export const getTailorOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ tailorId: req.user._id }).sort({ createdAt: -1 })

    const customerIds = [...new Set(orders.map((o) => o.customerId.toString()))]
    const customers = await User.find({ _id: { $in: customerIds } })
    const custMap = Object.fromEntries(customers.map((u) => [u._id.toString(), u]))

    const formatted = orders.map((o) => {
      const json = formatOrder(o)
      const c = custMap[o.customerId.toString()]
      json.customer = c?.name || ''
      json.customerEmail = c?.email || ''
      json.customerPhone = c?.phone || ''
      json.customerAddress = c?.address || ''
      return json
    })

    return sendSuccess(res, 'Tailor orders retrieved.', { orders: formatted })
  } catch (err) {
    next(err)
  }
}

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params
    const order = await findOrder(id)
    if (!order) return sendError(res, 'Order not found.', 404)

    const isOwner =
      req.user.role === 'ADMIN' ||
      order.customerId.toString() === req.user._id.toString() ||
      order.tailorId.toString() === req.user._id.toString()

    if (!isOwner) return sendError(res, 'Access denied. You do not have permission to view this order.', 403)

    const [customer, tailor, tailorProfile] = await Promise.all([
      User.findById(order.customerId),
      User.findById(order.tailorId),
      TailorProfile.findOne({ userId: order.tailorId })
    ])

    const json = formatOrder(order)
    json.customer = customer?.name
    json.customerPhone = customer?.phone
    json.customerEmail = customer?.email
    json.tailor = tailor?.name
    json.tailorPhone = tailor?.phone
    json.tailorEmail = tailor?.email

    return sendSuccess(res, 'Order details.', { order: json })
  } catch (err) {
    next(err)
  }
}

export const acceptOrder = async (req, res, next) => {
  try {
    const { id } = req.params
    const order = await findOrder(id, req.user._id)
    if (!order) return sendError(res, 'Order not found or you are not authorized to accept this order.', 404)

    order.orderStatus = 'ACCEPTED'
    order.progress = Math.max(order.progress, 20)
    await order.save()

    const notif = await Notification.create({
      userId: order.customerId,
      type: 'ORDER_ACCEPTED',
      title: 'Order Request Accepted! 🎉',
      message: `Your customized dress order #${order.orderNumber || order._id} has been accepted by the tailor studio.`,
      relatedId: order._id.toString()
    })
    emitNotification(order.customerId.toString(), notif.toObject())
    emitOrderStatusUpdate(order.toObject())

    return sendSuccess(res, 'Order accepted successfully.', { order: formatOrder(order) })
  } catch (err) {
    next(err)
  }
}

export const rejectOrder = async (req, res, next) => {
  try {
    const { id } = req.params
    const order = await findOrder(id, req.user._id)
    if (!order) return sendError(res, 'Order not found or unauthorized.', 404)

    order.orderStatus = 'REJECTED'
    await order.save()

    const notif = await Notification.create({
      userId: order.customerId,
      type: 'ORDER_REJECTED',
      title: 'Order Request Declined',
      message: `Your customized order #${order.orderNumber || order._id} could not be accepted at this time.`,
      relatedId: order._id.toString()
    })
    emitNotification(order.customerId.toString(), notif.toObject())
    emitOrderStatusUpdate(order.toObject())

    return sendSuccess(res, 'Order declined.', { order: formatOrder(order) })
  } catch (err) {
    next(err)
  }
}

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status, orderStatus } = req.body
    const rawStatus = (orderStatus || status || '').trim()

    const statusMap = {
      'Request Received': 'REQUEST_RECEIVED',
      'Accepted': 'ACCEPTED',
      'Fabric': 'IN_PROGRESS',
      'Cutting': 'IN_PROGRESS',
      'Stitching': 'STITCHING_STARTED',
      'Stitching Started': 'STITCHING_STARTED',
      'Aari / Embroidery': 'IN_PROGRESS',
      'Finishing': 'IN_PROGRESS',
      'Quality Check': 'IN_PROGRESS',
      'In Progress': 'IN_PROGRESS',
      'Ready': 'READY',
      'Out for Delivery': 'OUT_FOR_DELIVERY',
      'Delivered': 'DELIVERED',
      'Completed': 'COMPLETED',
      'Rejected': 'REJECTED',
      'Cancelled': 'CANCELLED'
    }
    const newStatus = statusMap[rawStatus] || rawStatus.toUpperCase().replace(/\s+/g, '_')

    const progressMap = {
      ACCEPTED: 20, STITCHING_STARTED: 40, IN_PROGRESS: 65,
      READY: 90, OUT_FOR_DELIVERY: 95, DELIVERED: 100, COMPLETED: 100
    }
    const newProgress = progressMap[newStatus]
    const isDelivered = newStatus === 'DELIVERED' || newStatus === 'COMPLETED'

    const isObjectId = /^[a-f\d]{24}$/i.test(id)
    const filter = isObjectId ? { _id: id } : { orderNumber: id }
    if (req.user.role !== 'ADMIN') filter.tailorId = req.user._id

    const order = await Order.findOne(filter)
    if (!order) return sendError(res, 'Order not found or unauthorized.', 404)

    order.orderStatus = newStatus
    if (newProgress) order.progress = Math.max(order.progress, newProgress)
    if (isDelivered) order.deliveredAt = new Date()
    await order.save()

    let notifTitle = `Order Status: ${rawStatus}`
    let notifMsg = `Your order #${order.orderNumber || order._id} (${order.designName}) is now marked as "${rawStatus}".`
    let notifType = 'ORDER_PROGRESS'
    if (newStatus === 'STITCHING_STARTED') {
      notifTitle = 'Stitching Started 🪡'; notifMsg = `Your ${order.designName} stitching has started.`
    } else if (newStatus === 'READY') {
      notifTitle = 'Order Ready! ✨'; notifMsg = 'Your order is ready.'
    } else if (newStatus === 'OUT_FOR_DELIVERY') {
      notifTitle = 'Out for Delivery 🚚'; notifMsg = 'Your order is out for delivery.'
    } else if (newStatus === 'DELIVERED') {
      notifTitle = 'Order Delivered 👗'; notifMsg = 'Your order has been delivered. Please share your rating and review!'; notifType = 'ORDER_DELIVERED'
    }

    const notif = await Notification.create({
      userId: order.customerId,
      type: notifType,
      title: notifTitle,
      message: notifMsg,
      relatedId: order._id.toString()
    })
    emitNotification(order.customerId.toString(), notif.toObject())
    emitOrderStatusUpdate(order.toObject())

    return sendSuccess(res, 'Order status updated successfully.', { order: formatOrder(order) })
  } catch (err) {
    next(err)
  }
}

export const updateOrderProgress = async (req, res, next) => {
  try {
    const { id } = req.params
    const { progress } = req.body
    const isObjectId = /^[a-f\d]{24}$/i.test(id)
    const filter = isObjectId ? { _id: id, tailorId: req.user._id } : { orderNumber: id, tailorId: req.user._id }

    const order = await Order.findOneAndUpdate(
      filter,
      { progress: Math.min(100, Math.max(0, Number(progress))) },
      { new: true }
    )
    if (!order) return sendError(res, 'Order not found or unauthorized.', 404)
    emitOrderStatusUpdate(order.toObject())
    return sendSuccess(res, 'Order progress percentage updated.', { order: formatOrder(order) })
  } catch (err) {
    next(err)
  }
}

export const getOrderTracking = async (req, res, next) => {
  try {
    const { id } = req.params
    const order = await findOrder(id)
    if (!order) return sendError(res, 'Order not found.', 404)

    let delivery = await Delivery.findOne({ orderId: order._id })
    if (!delivery) {
      delivery = await Delivery.create({
        orderId: order._id,
        status: order.orderStatus,
        currentLocation: order.deliveryLocation || 'Chennai Logistics Hub',
        expectedDeliveryDate: order.deadline
      })
    }

    return sendSuccess(res, 'Order tracking details.', {
      tracking: {
        orderId: order.orderNumber || order._id,
        orderStatus: order.orderStatus,
        progress: order.progress,
        deliveryStatus: delivery.status,
        currentLocation: delivery.currentLocation,
        deliveryPartner: delivery.deliveryPartner,
        expectedDeliveryDate: delivery.expectedDeliveryDate || order.deadline,
        updatedAt: delivery.updatedAt
      }
    })
  } catch (err) {
    next(err)
  }
}

export const updateOrderTracking = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status, currentLocation, deliveryPartner, expectedDeliveryDate } = req.body

    const order = await findOrder(id)
    if (!order) return sendError(res, 'Order not found.', 404)

    const delivery = await Delivery.findOneAndUpdate(
      { orderId: order._id },
      {
        ...(status && { status }),
        ...(currentLocation && { currentLocation }),
        ...(deliveryPartner && { deliveryPartner }),
        ...(expectedDeliveryDate && { expectedDeliveryDate })
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )

    return sendSuccess(res, 'Delivery tracking updated.', { delivery: delivery.toObject() })
  } catch (err) {
    next(err)
  }
}
