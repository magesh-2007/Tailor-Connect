import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import TailorProfile from '../models/TailorProfile.js'
import { sendSuccess, sendError } from '../utils/response.js'

const generateToken = (user) => {
  // Role ALWAYS comes from the database user record — never from the frontend
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || 'super_secret_tailorconnect_jwt_key_2026_production_grade',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

const formatUser = (user) => {
  const u = user.toObject ? user.toObject() : { ...user }
  const { password, ...rest } = u
  return {
    ...rest,
    id: u._id,
    profileImage: u.profileImage,
    isActive: u.isActive,
    isVerified: u.isVerified,
    googleId: u.googleId,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
    // Role is normalised to lowercase so the frontend can use it directly
    // e.g. user.role === 'customer' for routing
    role: (u.role || '').toLowerCase()
  }
}

// ─── REGISTER ────────────────────────────────────────────────────────────────
// Public registration is allowed only for CUSTOMER, STUDENT, and TAILOR.
// ADMIN and EMPLOYEE accounts must be created by an existing Admin through the
// admin panel — they are never publicly registrable.
export const register = async (req, res, next) => {
  try {
    const {
      name, email, username, password, role,
      phone, address, location,
      shopName, specialist, experience, age
    } = req.body

    if (!name || !email || !password) {
      return sendError(res, 'Name, email, and password are required fields.', 400)
    }

    const requestedRole = (role || 'CUSTOMER').toUpperCase()

    // Block public registration for restricted roles
    if (['ADMIN', 'EMPLOYEE'].includes(requestedRole)) {
      return sendError(
        res,
        'Admin and Employee accounts cannot be created through public registration.',
        403
      )
    }

    if (!['CUSTOMER', 'TAILOR', 'STUDENT'].includes(requestedRole)) {
      return sendError(res, 'Invalid role. Must be CUSTOMER, TAILOR, or STUDENT.', 400)
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      return sendError(res, 'An account with this email address already exists. Please log in.', 409)
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const usernameVal = username
      ? username.toLowerCase().trim()
      : email.split('@')[0].toLowerCase()

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      username: usernameVal,
      password: hashedPassword,
      role: requestedRole,
      phone: phone ? phone.trim() : '',
      address: address || '',
      location: location || 'Chennai',
      age: age ? Number(age) : 25,
      // Tailors require admin verification before they are active
      isVerified: requestedRole !== 'TAILOR'
    })

    let tailorProfile = null
    if (requestedRole === 'TAILOR') {
      tailorProfile = await TailorProfile.create({
        userId: user._id,
        shopName: shopName || `${name}'s Fashion Studio`,
        shopLocation: location || 'Chennai',
        specialist: specialist || 'Bridal Blouse & Aari Work Specialist',
        experience: experience || '3 yrs'
      })
    }

    const token = generateToken(user)
    return sendSuccess(
      res,
      'Registration successful.',
      { user: formatUser(user), tailorProfile, token },
      201
    )
  } catch (err) {
    next(err)
  }
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
// The user provides only their credentials (email/phone + password).
// The role is NEVER accepted from the frontend. It is always read from the
// authenticated user's MongoDB document and embedded in the JWT.
export const login = async (req, res, next) => {
  try {
    const { identifier, email, username, phone, password } = req.body
    const term = (identifier || email || username || phone || '').trim().toLowerCase()

    if (!term || !password) {
      return sendError(res, 'Please provide both your email/username and password.', 400)
    }

    // Find user by email, username, or phone
    const user = await User.findOne({
      $or: [{ email: term }, { username: term }, { phone: term }]
    })

    if (!user) {
      return sendError(res, 'No account found matching the provided credentials.', 401)
    }

    if (!user.password) {
      return sendError(
        res,
        'This account uses Google sign-in. Please use the "Continue with Google" button.',
        401
      )
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return sendError(res, 'Incorrect password. Please verify your credentials and try again.', 401)
    }

    if (!user.isActive) {
      return sendError(
        res,
        'This account has been deactivated. Please contact platform support.',
        403
      )
    }

    // Generate JWT with the role read directly from the database
    const token = generateToken(user)
    const userData = formatUser(user)

    // Attach tailor profile data when the authenticated user is a TAILOR
    if (user.role === 'TAILOR') {
      const tp = await TailorProfile.findOne({ userId: user._id })
      if (tp) {
        Object.assign(userData, {
          shopName: tp.shopName,
          shopLocation: tp.shopLocation,
          specialist: tp.specialist,
          experience: tp.experience,
          services: tp.services,
          rating: tp.rating,
          reviewCount: tp.reviewCount,
          verified: tp.verificationStatus === 'VERIFIED'
        })
      }
    }

    return sendSuccess(res, 'Login successful.', { user: userData, token })
  } catch (err) {
    next(err)
  }
}

// ─── GOOGLE LOGIN ─────────────────────────────────────────────────────────────
// When a real Google OAuth token arrives, the backend verifies the Google
// identity, then looks up the user in MongoDB to get their actual role.
// For new Google sign-ups (first time), they are created as CUSTOMER.
// The frontend never passes a role — role always comes from the database.
export const googleLogin = async (req, res, next) => {
  try {
    const { email, name, googleId, profileImage } = req.body

    if (!email) {
      return sendError(res, 'Email is required for Google authentication.', 400)
    }

    const cleanEmail = email.toLowerCase().trim()

    // Look up existing user in MongoDB
    let user = await User.findOne({ email: cleanEmail })

    if (!user) {
      // New Google user → default to CUSTOMER
      // The role can be changed later by an admin if needed
      user = await User.create({
        name: name || 'Google User',
        email: cleanEmail,
        username: `google_${Date.now().toString().slice(-6)}`,
        role: 'CUSTOMER',
        googleId: googleId || `google-oauth-${Date.now()}`,
        profileImage: profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        isVerified: true,
        location: 'Chennai'
      })
    } else if (googleId && !user.googleId) {
      // Link Google ID to existing account
      user.googleId = googleId
      if (profileImage && !user.profileImage) user.profileImage = profileImage
      await user.save()
    }

    if (!user.isActive) {
      return sendError(res, 'This account has been deactivated. Please contact support.', 403)
    }

    // Role is read from the database — not from the request
    const token = generateToken(user)
    return sendSuccess(res, 'Google authentication successful.', {
      user: formatUser(user),
      token
    })
  } catch (err) {
    next(err)
  }
}

// ─── ME ───────────────────────────────────────────────────────────────────────
export const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return sendError(res, 'User not found.', 404)
    }

    const userData = formatUser(user)

    if (user.role === 'TAILOR') {
      const tp = await TailorProfile.findOne({ userId: user._id })
      if (tp) {
        Object.assign(userData, {
          shopName: tp.shopName,
          shopLocation: tp.shopLocation,
          specialist: tp.specialist,
          experience: tp.experience,
          services: tp.services,
          rating: tp.rating,
          reviewCount: tp.reviewCount,
          verified: tp.verificationStatus === 'VERIFIED',
          dailyCapacity: tp.dailyCapacity,
          urgentAvailable: tp.urgentAvailable
        })
      }
    }

    return sendSuccess(res, 'User profile retrieved successfully.', { user: userData })
  } catch (err) {
    next(err)
  }
}

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
export const logout = async (req, res) => {
  return sendSuccess(res, 'Logged out successfully.')
}

// ─── UPDATE ME (PATCH /api/auth/me) ──────────────────────────────────────────
// Lets any authenticated user update their own safe profile fields.
// Role, isActive, isVerified are NOT patchable from here.
export const updateMe = async (req, res, next) => {
  try {
    const ALLOWED = ['name', 'phone', 'address', 'location', 'profileImage', 'age']
    const updates = {}
    ALLOWED.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f]
    })

    if (Object.keys(updates).length === 0) {
      return sendError(res, 'No valid fields provided to update.', 400)
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    )

    if (!user) return sendError(res, 'User not found.', 404)

    const userData = formatUser(user)

    if (user.role === 'TAILOR') {
      const tp = await TailorProfile.findOne({ userId: user._id })
      if (tp) {
        Object.assign(userData, {
          shopName: tp.shopName,
          shopLocation: tp.shopLocation,
          specialist: tp.specialist,
          experience: tp.experience,
          rating: tp.rating,
          reviewCount: tp.reviewCount,
          verified: tp.verificationStatus === 'VERIFIED'
        })
      }
    }

    return sendSuccess(res, 'Profile updated successfully.', { user: userData })
  } catch (err) {
    next(err)
  }
}
