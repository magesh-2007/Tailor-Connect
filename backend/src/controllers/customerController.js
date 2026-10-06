import User from '../models/User.js'
import { sendSuccess, sendError } from '../utils/response.js'

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return sendError(res, 'Customer profile not found.', 404)

    const { password, ...userData } = user.toObject()
    return sendSuccess(res, 'Customer profile.', {
      profile: {
        ...userData,
        id: user._id,
        role: 'customer',
        profileImage: user.profileImage,
        isActive: user.isActive,
        isVerified: user.isVerified
      }
    })
  } catch (err) {
    next(err)
  }
}

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, location, age, profileImage } = req.body

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(name?.trim() && { name: name.trim() }),
        ...(phone?.trim() && { phone: phone.trim() }),
        ...(address?.trim() && { address: address.trim() }),
        ...(location?.trim() && { location: location.trim() }),
        ...(age && { age: Number(age) }),
        ...(profileImage && { profileImage })
      },
      { new: true }
    )

    const { password, ...userData } = user.toObject()
    return sendSuccess(res, 'Customer profile updated successfully.', {
      profile: { ...userData, id: user._id, role: 'customer', profileImage: user.profileImage }
    })
  } catch (err) {
    next(err)
  }
}
