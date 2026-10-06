import Wishlist from '../models/Wishlist.js'
import { sendSuccess, sendError } from '../utils/response.js'

export const getWishlist = async (req, res, next) => {
  try {
    const items = await Wishlist.find({ customerId: req.user._id }).sort({ createdAt: -1 })
    return sendSuccess(res, 'Wishlist items.', { wishlist: items.map((w) => w.toObject()) })
  } catch (err) {
    next(err)
  }
}

export const addToWishlist = async (req, res, next) => {
  try {
    const { itemType, itemId, title, image, category, price, tailor } = req.body

    if (!itemId) return sendError(res, 'Item ID is required.', 400)

    const existing = await Wishlist.findOne({ customerId: req.user._id, itemId: String(itemId) })

    if (existing) {
      await Wishlist.findByIdAndDelete(existing._id)
      const list = await Wishlist.find({ customerId: req.user._id })
      return sendSuccess(res, 'Item removed from wishlist.', { added: false, wishlist: list.map((w) => w.toObject()) })
    }

    const item = await Wishlist.create({
      customerId: req.user._id,
      itemType: itemType || 'DESIGN',
      itemId: String(itemId),
      title: title || 'Custom Design',
      image: image || null,
      category: category || 'Bridal Blouse',
      price: price || '₹1,500',
      tailor: tailor || 'Lakshmi Devi (Lakshmi Stitches)'
    })

    const list = await Wishlist.find({ customerId: req.user._id })
    return sendSuccess(res, 'Item added to wishlist.', { added: true, item: item.toObject(), wishlist: list.map((w) => w.toObject()) }, 201)
  } catch (err) {
    next(err)
  }
}

export const removeFromWishlist = async (req, res, next) => {
  try {
    const { id } = req.params
    const isObjectId = /^[a-f\d]{24}$/i.test(id)

    const filter = isObjectId
      ? { _id: id, customerId: req.user._id }
      : { itemId: id, customerId: req.user._id }

    const item = await Wishlist.findOneAndDelete(filter).catch(() => null)
    if (!item) return sendError(res, 'Wishlist item not found.', 404)

    const list = await Wishlist.find({ customerId: req.user._id })
    return sendSuccess(res, 'Wishlist item removed.', { wishlist: list.map((w) => w.toObject()) })
  } catch (err) {
    next(err)
  }
}
