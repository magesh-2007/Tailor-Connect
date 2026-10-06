import Certificate from '../models/Certificate.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { generateCertificatePdf } from '../services/pdfService.js'

export const getStudentCertificates = async (req, res, next) => {
  try {
    const certs = await Certificate.find({ studentId: req.user._id }).sort({ createdAt: -1 })
    return sendSuccess(res, 'Student certificates.', { certificates: certs.map((c) => c.toObject()) })
  } catch (err) {
    next(err)
  }
}

export const getCertificateById = async (req, res, next) => {
  try {
    const { id } = req.params
    const isObjectId = /^[a-f\d]{24}$/i.test(id)
    const filter = isObjectId ? { _id: id } : { certificateId: id }

    const cert = await Certificate.findOne(filter).catch(() => null)
    if (!cert) return sendError(res, 'Certificate not found.', 404)
    return sendSuccess(res, 'Certificate details.', { certificate: cert.toObject() })
  } catch (err) {
    next(err)
  }
}

export const downloadCertificate = async (req, res, next) => {
  try {
    const { id } = req.params
    const isObjectId = /^[a-f\d]{24}$/i.test(id)
    const filter = isObjectId ? { _id: id } : { certificateId: id }

    const cert = await Certificate.findOne(filter).catch(() => null)
    if (!cert) return sendError(res, 'Certificate not found.', 404)

    const obj = cert.toObject()
    const mapped = {
      ...obj,
      certificateId: obj.certificateId,
      studentName: obj.studentName,
      studentEmail: obj.studentEmail,
      courseName: obj.courseName,
      tailorName: obj.tailorName,
      shopName: obj.shopName,
      completionDate: obj.completionDate,
      verificationCode: obj.verificationCode
    }
    generateCertificatePdf(mapped, res)
  } catch (err) {
    next(err)
  }
}
