import mongoose from 'mongoose'

const offerSchema = new mongoose.Schema(
  {
    tailorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    targetAudience: { type: String, enum: ['CUSTOMER', 'STUDENT', 'BOTH'], default: 'STUDENT' },
    mode: { type: String, enum: ['ONLINE', 'OFFLINE'], default: 'OFFLINE' },
    duration: { type: String, default: '15 Days' },
    durationDays: { type: Number, default: 15 },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    days: { type: String, default: 'Monday to Friday' },
    startTime: { type: String, default: '10:00 AM' },
    endTime: { type: String, default: '12:00 PM' },
    location: { type: String, default: 'Chennai' },
    price: { type: Number, required: true },
    maxRegistrations: { type: Number, default: 20 },
    currentRegistrations: { type: Number, default: 0 },
    image: { type: String },
    requirements: { type: String, default: 'Basic interest in stitching' },
    content: { type: String, default: 'Complete hands-on tailoring and embroidery instruction' },
    status: { type: String, enum: ['ACTIVE', 'FULL', 'CLOSED', 'COMPLETED'], default: 'ACTIVE' },
    registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
)

offerSchema.virtual('tailor_id').get(function () { return this.tailorId })
offerSchema.virtual('target_audience').get(function () { return this.targetAudience })
offerSchema.virtual('duration_days').get(function () { return this.durationDays })
offerSchema.virtual('start_date').get(function () { return this.startDate })
offerSchema.virtual('end_date').get(function () { return this.endDate })
offerSchema.virtual('start_time').get(function () { return this.startTime })
offerSchema.virtual('end_time').get(function () { return this.endTime })
offerSchema.virtual('max_registrations').get(function () { return this.maxRegistrations })
offerSchema.virtual('current_registrations').get(function () { return this.currentRegistrations })
offerSchema.virtual('created_at').get(function () { return this.createdAt })
offerSchema.virtual('updated_at').get(function () { return this.updatedAt })

offerSchema.set('toJSON', { virtuals: true })
offerSchema.set('toObject', { virtuals: true })

export default mongoose.model('Offer', offerSchema)
