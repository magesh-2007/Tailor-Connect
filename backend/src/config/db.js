import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tailorconnect'
  await mongoose.connect(uri)
  console.log('MongoDB Connected')
}

export const disconnectDB = async () => {
  await mongoose.disconnect()
}
