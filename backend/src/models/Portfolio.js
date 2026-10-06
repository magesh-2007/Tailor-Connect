import mongoose from 'mongoose'

const portfolioSchema = new mongoose.Schema(
  {
    tailorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    fabric: { type: String, default: 'Pure Silk' },
    description: { type: String },
    image: { type: String, required: true }
  },
  { timestamps: true }
)

portfolioSchema.virtual('tailor_id').get(function () { return this.tailorId })
portfolioSchema.virtual('created_at').get(function () { return this.createdAt })
portfolioSchema.virtual('updated_at').get(function () { return this.updatedAt })

portfolioSchema.set('toJSON', { virtuals: true })
portfolioSchema.set('toObject', { virtuals: true })

export default mongoose.model('Portfolio', portfolioSchema)
