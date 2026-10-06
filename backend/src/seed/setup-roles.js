/**
 * TailorConnect – 5-Role Account Setup Script
 *
 * PURPOSE:
 *   Creates or updates exactly 5 user accounts in MongoDB with the
 *   specified emails, bcrypt-hashed passwords, and roles.
 *   Does NOT delete or modify any other data.
 *
 * Usage:  node src/seed/setup-roles.js
 */

import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { connectDB, disconnectDB } from '../config/db.js'
import User from '../models/User.js'
import TailorProfile from '../models/TailorProfile.js'

dotenv.config()

const ACCOUNTS = [
  {
    name: 'Platform Admin',
    email: 'admin@tailorconnect.com',
    username: 'tc_admin',
    password: 'Admin@12345',
    role: 'ADMIN',
    phone: '9876543213',
    location: 'Headquarters',
    address: 'TailorConnect HQ, Chennai, Tamil Nadu',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80',
    isVerified: true,
    isActive: true
  },
  {
    name: 'Lakshmi Devi',
    email: 'tailor@tailorconnect.com',
    username: 'tc_tailor',
    password: 'Tailor@12345',
    role: 'TAILOR',
    phone: '9876543211',
    location: 'Chennai',
    address: '45, Gandhi Road, T.Nagar, Chennai, Tamil Nadu',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    isVerified: true,
    isActive: true,
    tailorProfile: {
      shopName: 'Lakshmi Stitches & Bridal Studio',
      shopLocation: 'Chennai',
      specialist: 'Aari Blouse & Bridal Wear Specialist',
      experience: '8 yrs',
      about: 'Master tailor with 8+ years specializing in traditional South Indian bridal wear.',
      services: ['Aari Blouse Stitching', 'Bridal Blouse Designing', 'Silk Saree Kuchu', 'Maggam Work'],
      rating: 4.9,
      reviewCount: 42,
      verificationStatus: 'VERIFIED',
      dailyCapacity: 6,
      urgentAvailable: true
    }
  },
  {
    name: 'Priya Sharma',
    email: 'customer@tailorconnect.com',
    username: 'tc_customer',
    password: 'Customer@12345',
    role: 'CUSTOMER',
    phone: '9876543210',
    location: 'Chennai',
    address: '12, 4th Cross Street, Anna Nagar, Chennai, Tamil Nadu',
    age: 26,
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    isVerified: true,
    isActive: true
  },
  {
    name: 'Meena Sundaram',
    email: 'student@tailorconnect.com',
    username: 'tc_student',
    password: 'Student@12345',
    role: 'STUDENT',
    phone: '9876543212',
    location: 'Madurai',
    address: '88, West Masi Street, Madurai, Tamil Nadu',
    age: 22,
    profileImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
    isVerified: true,
    isActive: true
  },
  {
    name: 'Karthik Raj',
    email: 'employee@tailorconnect.com',
    username: 'tc_employee',
    password: 'Employee@12345',
    role: 'EMPLOYEE',
    phone: '9876543299',
    location: 'Chennai',
    address: '5, Mount Road, Chennai, Tamil Nadu',
    age: 30,
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80',
    isVerified: true,
    isActive: true
  }
]

async function setupRoles() {
  console.log('\n' + '='.repeat(65))
  console.log('  TailorConnect – 5-Role Account Setup')
  console.log('='.repeat(65))

  await connectDB()

  for (const account of ACCOUNTS) {
    const { tailorProfile: tailorProfileData, password: plainPassword, ...fields } = account

    // Bcrypt hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, 12)

    // Upsert: find by email, update or create
    const existing = await User.findOne({ email: account.email.toLowerCase() })

    let user
    if (existing) {
      // Update password + role + isActive (preserve other data)
      existing.password = hashedPassword
      existing.role = fields.role
      existing.isActive = true
      existing.isVerified = true
      // Update name/username only if we're replacing the record
      Object.assign(existing, { ...fields, password: hashedPassword })
      user = await existing.save()
      console.log(`\n  [${fields.role.padEnd(8)}] ✅ UPDATED  ${account.email}`)
    } else {
      user = await User.create({ ...fields, password: hashedPassword })
      console.log(`\n  [${fields.role.padEnd(8)}] ✅ CREATED  ${account.email}`)
    }

    console.log(`             Name     : ${user.name}`)
    console.log(`             Role     : ${user.role}`)
    console.log(`             Password : ${plainPassword}  (bcrypt hash stored)`)
    console.log(`             Active   : ${user.isActive}  |  Verified: ${user.isVerified}`)

    // Ensure TailorProfile exists for TAILOR accounts
    if (fields.role === 'TAILOR' && tailorProfileData) {
      const existingProfile = await TailorProfile.findOne({ userId: user._id })
      if (existingProfile) {
        Object.assign(existingProfile, tailorProfileData)
        await existingProfile.save()
        console.log(`             Profile  : TailorProfile UPDATED`)
      } else {
        await TailorProfile.create({ userId: user._id, ...tailorProfileData })
        console.log(`             Profile  : TailorProfile CREATED`)
      }
    }
  }

  console.log('\n' + '─'.repeat(65))
  console.log('  Setup Complete! Credentials Summary:')
  console.log('─'.repeat(65))
  console.log('  Role       Email                            Password')
  console.log('  ─────────────────────────────────────────────────────')
  for (const a of ACCOUNTS) {
    console.log(`  ${a.role.padEnd(10)} ${a.email.padEnd(35)} ${a.password}`)
  }
  console.log('─'.repeat(65) + '\n')

  await disconnectDB()
  process.exit(0)
}

setupRoles().catch((err) => {
  console.error('[Setup] ❌ Error:', err.message || err)
  process.exit(1)
})
