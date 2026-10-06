import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, default: 'ORDER_PROGRESS' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedId: { type: String },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
)

notificationSchema.virtual('user_id').get(function () { return this.userId })
notificationSchema.virtual('related_id').get(function () { return this.relatedId })
notificationSchema.virtual('is_read').get(function () { return this.isRead })
notificationSchema.virtual('created_at').get(function () { return this.createdAt })
notificationSchema.virtual('updated_at').get(function () { return this.updatedAt })

notificationSchema.set('toJSON', { virtuals: true })
notificationSchema.set('toObject', { virtuals: true })

export default mongoose.model('Notification', notificationSchema)
