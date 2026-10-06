import mongoose from 'mongoose'

const deliverySchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    status: { type: String, default: 'Out for Delivery' },
    currentLocation: { type: String, default: 'Chennai Central Logistics Hub' },
    deliveryPartner: { type: String, default: 'TailorConnect Express Delivery' },
    expectedDeliveryDate: { type: String }
  },
  { timestamps: true }
)

deliverySchema.virtual('order_id').get(function () { return this.orderId })
deliverySchema.virtual('current_location').get(function () { return this.currentLocation })
deliverySchema.virtual('delivery_partner').get(function () { return this.deliveryPartner })
deliverySchema.virtual('expected_delivery_date').get(function () { return this.expectedDeliveryDate })
deliverySchema.virtual('created_at').get(function () { return this.createdAt })
deliverySchema.virtual('updated_at').get(function () { return this.updatedAt })

deliverySchema.set('toJSON', { virtuals: true })
deliverySchema.set('toObject', { virtuals: true })

export default mongoose.model('Delivery', deliverySchema)
