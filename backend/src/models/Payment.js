import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema(
  {
    paymentNumber: { type: String, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, default: 'Customer' },
    userType: { type: String, default: 'Customer' },
    type: { type: String, enum: ['Order', 'Course', 'ORDER', 'COURSE'], default: 'Order' },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    orderNumber: { type: String },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    tailorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tailorName: { type: String },
    title: { type: String, default: 'Tailoring Service Payment' },
    amount: { type: Number, required: true },
    platformFee: { type: Number, default: 50 },
    gst: { type: Number, default: 0 },
    paymentMethod: { type: String, default: 'UPI' },
    transactionId: { type: String, unique: true, required: true },
    status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'SUCCESS' },
    paidAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

paymentSchema.virtual('payment_number').get(function () { return this.paymentNumber })
paymentSchema.virtual('user_id').get(function () { return this.userId })
paymentSchema.virtual('user_name').get(function () { return this.userName })
paymentSchema.virtual('user_type').get(function () { return this.userType })
paymentSchema.virtual('order_id').get(function () { return this.orderId })
paymentSchema.virtual('order_number').get(function () { return this.orderNumber })
paymentSchema.virtual('course_id').get(function () { return this.courseId })
paymentSchema.virtual('tailor_id').get(function () { return this.tailorId })
paymentSchema.virtual('tailor_name').get(function () { return this.tailorName })
paymentSchema.virtual('platform_fee').get(function () { return this.platformFee })
paymentSchema.virtual('payment_method').get(function () { return this.paymentMethod })
paymentSchema.virtual('transaction_id').get(function () { return this.transactionId })
paymentSchema.virtual('paid_at').get(function () { return this.paidAt })
paymentSchema.virtual('created_at').get(function () { return this.createdAt })
paymentSchema.virtual('updated_at').get(function () { return this.updatedAt })

paymentSchema.set('toJSON', { virtuals: true })
paymentSchema.set('toObject', { virtuals: true })

export default mongoose.model('Payment', paymentSchema)
