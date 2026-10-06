import mongoose from 'mongoose'

const wishlistSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemType: { type: String, enum: ['TAILOR', 'PORTFOLIO', 'DESIGN', 'OFFER'], default: 'DESIGN' },
    itemId: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, default: 'Bridal Blouse' },
    image: { type: String },
    price: { type: String, default: '₹1,500' },
    tailor: { type: String }
  },
  { timestamps: true }
)

wishlistSchema.index({ customerId: 1, itemId: 1 }, { unique: true })

wishlistSchema.virtual('customer_id').get(function () { return this.customerId })
wishlistSchema.virtual('item_type').get(function () { return this.itemType })
wishlistSchema.virtual('item_id').get(function () { return this.itemId })
wishlistSchema.virtual('created_at').get(function () { return this.createdAt })
wishlistSchema.virtual('updated_at').get(function () { return this.updatedAt })

wishlistSchema.set('toJSON', { virtuals: true })
wishlistSchema.set('toObject', { virtuals: true })

export default mongoose.model('Wishlist', wishlistSchema)
