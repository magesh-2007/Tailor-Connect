import mongoose from 'mongoose'

const certificateSchema = new mongoose.Schema(
  {
    certificateId: { type: String, unique: true, required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    studentName: { type: String, required: true },
    studentEmail: { type: String },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    courseName: { type: String, required: true },
    tailorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tailorName: { type: String, default: 'Master Tailor' },
    shopName: { type: String, default: 'TailorConnect Academy' },
    completionDate: { type: String },
    duration: { type: String, default: '15 Days' },
    grade: { type: String, default: 'Certified Professional Distinction' },
    certificateUrl: { type: String },
    verificationCode: { type: String, unique: true, sparse: true }
  },
  { timestamps: true }
)

certificateSchema.virtual('certificate_id').get(function () { return this.certificateId })
certificateSchema.virtual('student_id').get(function () { return this.studentId })
certificateSchema.virtual('student_name').get(function () { return this.studentName })
certificateSchema.virtual('student_email').get(function () { return this.studentEmail })
certificateSchema.virtual('course_id').get(function () { return this.courseId })
certificateSchema.virtual('course_name').get(function () { return this.courseName })
certificateSchema.virtual('tailor_id').get(function () { return this.tailorId })
certificateSchema.virtual('tailor_name').get(function () { return this.tailorName })
certificateSchema.virtual('shop_name').get(function () { return this.shopName })
certificateSchema.virtual('completion_date').get(function () { return this.completionDate })
certificateSchema.virtual('certificate_url').get(function () { return this.certificateUrl })
certificateSchema.virtual('verification_code').get(function () { return this.verificationCode })
certificateSchema.virtual('created_at').get(function () { return this.createdAt })
certificateSchema.virtual('updated_at').get(function () { return this.updatedAt })

certificateSchema.set('toJSON', { virtuals: true })
certificateSchema.set('toObject', { virtuals: true })

export default mongoose.model('Certificate', certificateSchema)
