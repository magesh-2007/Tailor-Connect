import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tailorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dressType: { type: String, default: 'Bridal Blouse' },
    designName: { type: String, required: true },
    designImage: { type: String },
    category: { type: String, default: 'Bridal Blouse' },
    fabric: { type: String, default: 'Pure Silk' },
    color: { type: String, default: 'Crimson Pink & Gold' },
    quantity: { type: Number, default: 1 },
    measBust: { type: String, default: '36' },
    measWaist: { type: String, default: '30' },
    measHip: { type: String, default: '38' },
    measShoulder: { type: String, default: '14.5' },
    measSleeveLength: { type: String, default: '11.0' },
    measDressLength: { type: String, default: '15.0' },
    measArmhole: { type: String, default: '16.5' },
    measNeck: { type: String, default: '7.0' },
    specialInstructions: { type: String },
    deliveryAddress: { type: String, required: true },
    deliveryLocation: { type: String, default: 'Chennai' },
    price: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' },
    paymentId: { type: String },
    orderStatus: {
      type: String,
      enum: ['REQUEST_RECEIVED', 'ACCEPTED', 'STITCHING_STARTED', 'IN_PROGRESS', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED', 'REJECTED', 'CANCELLED'],
      default: 'REQUEST_RECEIVED'
    },
    progress: { type: Number, default: 10 },
    urgent: { type: Boolean, default: false },
    orderDate: { type: String },
    deadline: { type: String, required: true },
    deliveredAt: { type: Date },
    hasReviewed: { type: Boolean, default: false }
  },
  { timestamps: true }
)

// Snake_case virtuals for controller compatibility
orderSchema.virtual('order_number').get(function () { return this.orderNumber })
orderSchema.virtual('customer_id').get(function () { return this.customerId })
orderSchema.virtual('tailor_id').get(function () { return this.tailorId })
orderSchema.virtual('dress_type').get(function () { return this.dressType })
orderSchema.virtual('design_name').get(function () { return this.designName })
orderSchema.virtual('design_image').get(function () { return this.designImage })
orderSchema.virtual('meas_bust').get(function () { return this.measBust })
orderSchema.virtual('meas_waist').get(function () { return this.measWaist })
orderSchema.virtual('meas_hip').get(function () { return this.measHip })
orderSchema.virtual('meas_shoulder').get(function () { return this.measShoulder })
orderSchema.virtual('meas_sleeve_length').get(function () { return this.measSleeveLength })
orderSchema.virtual('meas_dress_length').get(function () { return this.measDressLength })
orderSchema.virtual('meas_armhole').get(function () { return this.measArmhole })
orderSchema.virtual('meas_neck').get(function () { return this.measNeck })
orderSchema.virtual('special_instructions').get(function () { return this.specialInstructions })
orderSchema.virtual('delivery_address').get(function () { return this.deliveryAddress })
orderSchema.virtual('delivery_location').get(function () { return this.deliveryLocation })
orderSchema.virtual('payment_status').get(function () { return this.paymentStatus })
orderSchema.virtual('payment_id').get(function () { return this.paymentId })
orderSchema.virtual('order_status').get(function () { return this.orderStatus })
orderSchema.virtual('order_date').get(function () { return this.orderDate })
orderSchema.virtual('delivered_at').get(function () { return this.deliveredAt })
orderSchema.virtual('has_reviewed').get(function () { return this.hasReviewed })
orderSchema.virtual('created_at').get(function () { return this.createdAt })
orderSchema.virtual('updated_at').get(function () { return this.updatedAt })

orderSchema.set('toJSON', { virtuals: true })
orderSchema.set('toObject', { virtuals: true })

export default mongoose.model('Order', orderSchema)
