import User from '../models/User.js'
import CourseRegistration from '../models/CourseRegistration.js'
import Course from '../models/Course.js'
import TailorProfile from '../models/TailorProfile.js'
import Certificate from '../models/Certificate.js'
import { sendSuccess, sendError } from '../utils/response.js'

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return sendError(res, 'Student profile not found.', 404)

    const registrations = await CourseRegistration.find({ studentId: req.user._id })
    const courseIds = registrations.map((r) => r.courseId)
    const courses = await Course.find({ _id: { $in: courseIds } })
    const courseMap = Object.fromEntries(courses.map((c) => [c._id.toString(), c]))
    const trainerIds = [...new Set(registrations.map((r) => r.tailorId.toString()))]
    const trainers = await User.find({ _id: { $in: trainerIds } })
    const trainerProfiles = await TailorProfile.find({ userId: { $in: trainerIds } })
    const trainerMap = Object.fromEntries(trainers.map((u) => [u._id.toString(), u]))
    const profileMap = Object.fromEntries(trainerProfiles.map((p) => [p.userId.toString(), p]))

    const enrolledCourses = registrations.map((r) => {
      const c = courseMap[r.courseId.toString()]
      const t = trainerMap[r.tailorId.toString()]
      const tp = profileMap[r.tailorId.toString()]
      return {
        ...r.toObject(),
        course_title: c?.title,
        category: c?.category,
        duration: c?.duration,
        start_date: c?.startDate,
        end_date: c?.endDate,
        location: c?.location,
        mode: c?.mode,
        price: c?.price,
        image: c?.image,
        course_status: c?.status,
        tailor_name: t?.name,
        tailor_shop: tp?.shopName
      }
    })

    const certificates = await Certificate.find({ studentId: req.user._id }).sort({ createdAt: -1 })

    const { password, ...userData } = user.toObject()
    return sendSuccess(res, 'Student profile.', {
      profile: {
        ...userData,
        id: user._id,
        role: 'student',
        profileImage: user.profileImage,
        isActive: user.isActive,
        isVerified: user.isVerified,
        enrolledCourses,
        completedCourses: certificates.map((c) => c.toObject())
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
    return sendSuccess(res, 'Student profile updated successfully.', {
      profile: { ...userData, id: user._id, role: 'student', profileImage: user.profileImage }
    })
  } catch (err) {
    next(err)
  }
}

export const getMyCourses = async (req, res, next) => {
  try {
    const registrations = await CourseRegistration.find({ studentId: req.user._id }).sort({ createdAt: -1 })
    const courseIds = registrations.map((r) => r.courseId)
    const courses = await Course.find({ _id: { $in: courseIds } })
    const courseMap = Object.fromEntries(courses.map((c) => [c._id.toString(), c]))
    const trainerIds = [...new Set(registrations.map((r) => r.tailorId.toString()))]
    const trainers = await User.find({ _id: { $in: trainerIds } })
    const trainerProfiles = await TailorProfile.find({ userId: { $in: trainerIds } })
    const trainerMap = Object.fromEntries(trainers.map((u) => [u._id.toString(), u]))
    const profileMap = Object.fromEntries(trainerProfiles.map((p) => [p.userId.toString(), p]))

    const result = registrations.map((r) => {
      const c = courseMap[r.courseId.toString()]
      const t = trainerMap[r.tailorId.toString()]
      const tp = profileMap[r.tailorId.toString()]
      return {
        ...r.toObject(),
        course: {
          id: c?._id,
          title: c?.title,
          category: c?.category,
          duration: c?.duration,
          startDate: c?.startDate,
          endDate: c?.endDate,
          location: c?.location,
          mode: c?.mode,
          price: c?.price,
          image: c?.image,
          status: c?.status
        },
        tailor: {
          id: t?._id,
          name: t?.name,
          shopName: tp?.shopName,
          email: t?.email,
          phone: t?.phone
        }
      }
    })

    return sendSuccess(res, 'Enrolled courses retrieved.', { courses: result })
  } catch (err) {
    next(err)
  }
}

export const getCertificates = async (req, res, next) => {
  try {
    const certs = await Certificate.find({ studentId: req.user._id }).sort({ createdAt: -1 })
    return sendSuccess(res, 'Student certificates.', { certificates: certs.map((c) => c.toObject()) })
  } catch (err) {
    next(err)
  }
}
