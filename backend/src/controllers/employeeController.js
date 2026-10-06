import User from '../models/User.js'
import Order from '../models/Order.js'
import { sendSuccess, sendError } from '../utils/response.js'

/**
 * GET /api/employees/profile
 * Returns the authenticated employee's own profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return sendError(res, 'Employee profile not found.', 404)
    const { password, ...profile } = user.toObject()
    return sendSuccess(res, 'Employee profile retrieved.', { user: profile })
  } catch (err) {
    next(err)
  }
}

/**
 * PUT /api/employees/profile
 * Update authenticated employee's own profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'phone', 'address', 'location', 'profileImage', 'department']
    const updates = {}
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f] })

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true })
    if (!user) return sendError(res, 'Employee not found.', 404)
    const { password, ...profile } = user.toObject()
    return sendSuccess(res, 'Employee profile updated.', { user: profile })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/employees/dashboard
 * Employee dashboard summary — employees can view platform-level stats (read-only)
 */
export const getDashboard = async (req, res, next) => {
  try {
    const [totalCustomers, totalTailors, totalStudents, totalEmployees] = await Promise.all([
      User.countDocuments({ role: 'CUSTOMER' }),
      User.countDocuments({ role: 'TAILOR' }),
      User.countDocuments({ role: 'STUDENT' }),
      User.countDocuments({ role: 'EMPLOYEE' })
    ])

    const [totalOrders, activeOrders, deliveredOrders] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({
        orderStatus: { $in: ['REQUEST_RECEIVED', 'ACCEPTED', 'STITCHING_STARTED', 'IN_PROGRESS', 'READY', 'OUT_FOR_DELIVERY'] }
      }),
      Order.countDocuments({ orderStatus: 'DELIVERED' })
    ])

    return sendSuccess(res, 'Employee dashboard data retrieved.', {
      employee: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        department: req.user.department || 'Operations',
        role: req.user.role
      },
      stats: {
        totalCustomers,
        totalTailors,
        totalStudents,
        totalEmployees,
        totalOrders,
        activeOrders,
        deliveredOrders
      }
    })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/employees/orders
 * Employees can view all orders (read-only support role)
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const filter = status ? { orderStatus: status.toUpperCase() } : {}
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
    const total = await Order.countDocuments(filter)
    return sendSuccess(res, 'Orders retrieved for employee.', { orders, total, page: Number(page) })
  } catch (err) {
    next(err)
  }
}
