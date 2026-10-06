import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    orderId: { type: String },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderRole: { type: String, default: 'customer' },
    message: { type: String, required: true },
    image: { type: String },
    readAt: { type: Date }
  },
  { timestamps: true }
)

messageSchema.virtual('conversation_id').get(function () { return this.conversationId })
messageSchema.virtual('order_id').get(function () { return this.orderId })
messageSchema.virtual('sender_id').get(function () { return this.senderId })
messageSchema.virtual('receiver_id').get(function () { return this.receiverId })
messageSchema.virtual('sender_role').get(function () { return this.senderRole })
messageSchema.virtual('read_at').get(function () { return this.readAt })
messageSchema.virtual('created_at').get(function () { return this.createdAt })
messageSchema.virtual('updated_at').get(function () { return this.updatedAt })

messageSchema.set('toJSON', { virtuals: true })
messageSchema.set('toObject', { virtuals: true })

export default mongoose.model('Message', messageSchema)
