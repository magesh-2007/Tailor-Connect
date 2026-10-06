import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String },
    tailorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
  },
  { timestamps: true }
)

reviewSchema.virtual('customer_id').get(function () { return this.customerId })
reviewSchema.virtual('customer_name').get(function () { return this.customerName })
reviewSchema.virtual('customer_email').get(function () { return this.customerEmail })
reviewSchema.virtual('tailor_id').get(function () { return this.tailorId })
reviewSchema.virtual('order_id').get(function () { return this.orderId })
reviewSchema.virtual('created_at').get(function () { return this.createdAt })
reviewSchema.virtual('updated_at').get(function () { return this.updatedAt })

reviewSchema.set('toJSON', { virtuals: true })
reviewSchema.set('toObject', { virtuals: true })

export default mongoose.model('Review', reviewSchema)
