import mongoose from 'mongoose'

const conversationSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tailorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    lastMessage: { type: String },
    lastMessageAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

conversationSchema.virtual('customer_id').get(function () { return this.customerId })
conversationSchema.virtual('tailor_id').get(function () { return this.tailorId })
conversationSchema.virtual('order_id').get(function () { return this.orderId })
conversationSchema.virtual('last_message').get(function () { return this.lastMessage })
conversationSchema.virtual('last_message_at').get(function () { return this.lastMessageAt })
conversationSchema.virtual('created_at').get(function () { return this.createdAt })
conversationSchema.virtual('updated_at').get(function () { return this.updatedAt })

conversationSchema.set('toJSON', { virtuals: true })
conversationSchema.set('toObject', { virtuals: true })

export default mongoose.model('Conversation', conversationSchema)
