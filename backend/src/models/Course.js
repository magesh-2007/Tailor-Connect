import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema(
  {
    tailorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    category: { type: String, default: 'Bridal Blouse' },
    description: { type: String },
    duration: { type: String, default: '15 Days' },
    durationDays: { type: Number, default: 15 },
    mode: { type: String, enum: ['ONLINE', 'OFFLINE'], default: 'OFFLINE' },
    location: { type: String, default: 'Chennai' },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    days: { type: String, default: 'Monday to Friday' },
    startTime: { type: String, default: '10:00 AM' },
    endTime: { type: String, default: '12:00 PM' },
    price: { type: Number, required: true },
    capacity: { type: Number, default: 20 },
    registeredCount: { type: Number, default: 0 },
    image: { type: String },
    requirements: { type: String, default: 'Basic interest in stitching and embroidery' },
    courseContent: { type: String, default: 'Needle handling, chain stitch, stone chain fixing, motif tracing, and border finish' },
    status: { type: String, enum: ['ACTIVE', 'CLOSED', 'COMPLETED'], default: 'ACTIVE' }
  },
  { timestamps: true }
)

courseSchema.virtual('tailor_id').get(function () { return this.tailorId })
courseSchema.virtual('duration_days').get(function () { return this.durationDays })
courseSchema.virtual('start_date').get(function () { return this.startDate })
courseSchema.virtual('end_date').get(function () { return this.endDate })
courseSchema.virtual('start_time').get(function () { return this.startTime })
courseSchema.virtual('end_time').get(function () { return this.endTime })
courseSchema.virtual('registered_count').get(function () { return this.registeredCount })
courseSchema.virtual('course_content').get(function () { return this.courseContent })
courseSchema.virtual('created_at').get(function () { return this.createdAt })
courseSchema.virtual('updated_at').get(function () { return this.updatedAt })

courseSchema.set('toJSON', { virtuals: true })
courseSchema.set('toObject', { virtuals: true })

export default mongoose.model('Course', courseSchema)
