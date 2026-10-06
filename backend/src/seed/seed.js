import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { connectDB, disconnectDB } from '../config/db.js'
import User from '../models/User.js'
import TailorProfile from '../models/TailorProfile.js'
import Portfolio from '../models/Portfolio.js'
import Course from '../models/Course.js'
import CourseRegistration from '../models/CourseRegistration.js'
import Order from '../models/Order.js'
import Delivery from '../models/Delivery.js'
import Payment from '../models/Payment.js'
import Review from '../models/Review.js'
import Conversation from '../models/Conversation.js'
import Message from '../models/Message.js'
import Notification from '../models/Notification.js'
import Wishlist from '../models/Wishlist.js'
import Offer from '../models/Offer.js'
import Certificate from '../models/Certificate.js'

dotenv.config()

export const seedDatabase = async (disconnectAfter = false, skipConnect = false) => {
  console.log('[Seed] Starting database seeding...')
  if (!skipConnect) await connectDB()

  // Clear all collections
  await Promise.all([
    User.deleteMany({}),
    TailorProfile.deleteMany({}),
    Portfolio.deleteMany({}),
    Course.deleteMany({}),
    CourseRegistration.deleteMany({}),
    Order.deleteMany({}),
    Delivery.deleteMany({}),
    Payment.deleteMany({}),
    Review.deleteMany({}),
    Conversation.deleteMany({}),
    Message.deleteMany({}),
    Notification.deleteMany({}),
    Wishlist.deleteMany({}),
    Offer.deleteMany({}),
    Certificate.deleteMany({})
  ])
  console.log('[Seed] Cleared existing data.')

  const hash = async (pw) => bcrypt.hash(pw, 10)

  // ── 1. ADMIN ────────────────────────────────────────────────────────
  const admin = await User.create({
    name: 'Platform Admin',
    email: 'admin@tailorconnect.com',
    username: 'admin',
    password: await hash('admin123'),
    role: 'ADMIN',
    phone: '9876543213',
    location: 'Headquarters',
    isVerified: true
  })

  // ── 1b. EMPLOYEE ────────────────────────────────────────────────────
  const employee = await User.create({
    name: 'Karthik Raj',
    email: 'employee@tailorconnect.com',
    username: 'employee',
    password: await hash('employee123'),
    role: 'EMPLOYEE',
    phone: '9876543299',
    location: 'Chennai',
    address: '5, Mount Road, Chennai, Tamil Nadu',
    age: 30,
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80',
    isVerified: true
  })

  // ── 2. CUSTOMERS ────────────────────────────────────────────────────
  const priya = await User.create({
    name: 'Priya Sharma',
    email: 'customer@tailorconnect.com',
    username: 'customer',
    password: await hash('customer123'),
    role: 'CUSTOMER',
    phone: '9876543210',
    location: 'Chennai',
    address: '12, 4th Cross Street, Anna Nagar, Chennai, Tamil Nadu',
    age: 26,
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    isVerified: true
  })

  const anitha = await User.create({
    name: 'Anitha Raj',
    email: 'anitha@example.com',
    username: 'anitha_r',
    password: await hash('customer123'),
    role: 'CUSTOMER',
    phone: '9876543214',
    location: 'Coimbatore',
    address: '56, Race Course Road, Coimbatore, Tamil Nadu',
    age: 29,
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    isVerified: true
  })

  const divya = await User.create({
    name: 'Divya Kumar',
    email: 'divya@example.com',
    username: 'divya_k',
    password: await hash('customer123'),
    role: 'CUSTOMER',
    phone: '9876543215',
    location: 'Trichy',
    address: '18, Thillai Nagar Main Road, Trichy, Tamil Nadu',
    age: 24,
    profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    isVerified: true
  })

  // ── 3. STUDENTS ─────────────────────────────────────────────────────
  const meena = await User.create({
    name: 'Meena Sundaram',
    email: 'student@tailorconnect.com',
    username: 'student',
    password: await hash('student123'),
    role: 'STUDENT',
    phone: '9876543212',
    location: 'Madurai',
    address: '88, West Masi Street, Madurai, Tamil Nadu',
    age: 22,
    profileImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
    isVerified: true
  })

  const ravi = await User.create({
    name: 'Ravi Kumar',
    email: 'ravi.k@example.com',
    username: 'ravi_learns',
    password: await hash('student123'),
    role: 'STUDENT',
    phone: '9876543288',
    location: 'Chennai',
    address: '24, Velachery Main Road, Chennai, Tamil Nadu',
    age: 25,
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    isVerified: true
  })

  // ── 4. TAILORS ───────────────────────────────────────────────────────
  const lakshmi = await User.create({
    name: 'Lakshmi Devi',
    email: 'tailor@tailorconnect.com',
    username: 'tailor',
    password: await hash('tailor123'),
    role: 'TAILOR',
    phone: '9876543211',
    location: 'Chennai',
    address: '45, Gandhi Road, T.Nagar, Chennai, Tamil Nadu',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    isVerified: true
  })
  await TailorProfile.create({
    userId: lakshmi._id,
    shopName: 'Lakshmi Stitches & Bridal Studio',
    shopLocation: 'Chennai',
    specialist: 'Aari Blouse & Bridal Wear Specialist',
    experience: '8 yrs',
    about: 'Master tailor with 8+ years specializing in traditional South Indian bridal wear, heavy Aari needlework, and customized Silk Saree blouses.',
    services: ['Aari Blouse Stitching', 'Bridal Blouse Designing', 'Silk Saree Kuchu', 'Custom Fit Alteration', 'Maggam Work'],
    rating: 4.9,
    reviewCount: 42,
    verificationStatus: 'VERIFIED',
    dailyCapacity: 6,
    urgentAvailable: true,
    avatar: lakshmi.profileImage,
    coverImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80'
  })

  const radha = await User.create({
    name: 'Mrs. Radha Raman',
    email: 'vintage.needle@tailorconnect.com',
    username: 'radha_tailor',
    password: await hash('tailor123'),
    role: 'TAILOR',
    phone: '9876543233',
    location: 'Madurai',
    address: '88, West Masi Street, Madurai, Tamil Nadu',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    isVerified: true
  })
  await TailorProfile.create({
    userId: radha._id,
    shopName: 'Vintage Needle Heritage Tailors',
    shopLocation: 'Madurai',
    specialist: 'Maggam Work & Antique Zari Specialist',
    experience: '12 yrs',
    about: 'Specialists in heirloom wedding blouses, handcrafted Maggam embroidery, and antique zari neck borders with 12 years of craftsmanship.',
    services: ['Maggam Work Blouse', 'Bridal Blouse', 'Zardosi Work', 'Wedding Trousseau Stitching'],
    rating: 4.9,
    reviewCount: 35,
    verificationStatus: 'VERIFIED',
    dailyCapacity: 5,
    urgentAvailable: true,
    avatar: radha.profileImage,
    coverImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80'
  })

  const suresh = await User.create({
    name: 'Suresh Kumar',
    email: 'royal.threads@tailorconnect.com',
    username: 'suresh_threads',
    password: await hash('tailor123'),
    role: 'TAILOR',
    phone: '9876543222',
    location: 'Coimbatore',
    address: '14, DB Road, RS Puram, Coimbatore, Tamil Nadu',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    isVerified: true
  })
  await TailorProfile.create({
    userId: suresh._id,
    shopName: 'Royal Threads & Embroidery Studio',
    shopLocation: 'Coimbatore',
    specialist: 'Designer Lehenga & Zardosi Specialist',
    experience: '6 yrs',
    about: 'Premier boutique for royal bridal wear, custom-tailored lehengas, machine zardosi embroidery, and contemporary festive outfits.',
    services: ['Designer Lehenga Stitching', 'Zardosi Embroidery', 'Party Wear Gowns', 'Saree Blouse'],
    rating: 4.7,
    reviewCount: 28,
    verificationStatus: 'VERIFIED',
    dailyCapacity: 4,
    urgentAvailable: false,
    avatar: suresh.profileImage,
    coverImage: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&auto=format&fit=crop&q=80'
  })

  const anandhi = await User.create({
    name: 'Anandhi Nathan',
    email: 'modern.stitch@tailorconnect.com',
    username: 'anandhi_stitch',
    password: await hash('tailor123'),
    role: 'TAILOR',
    phone: '9876543244',
    location: 'Chennai',
    address: '102, 2nd Avenue, Anna Nagar, Chennai, Tamil Nadu',
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80',
    isVerified: true
  })
  await TailorProfile.create({
    userId: anandhi._id,
    shopName: 'Modern Stitch Fashion Lab',
    shopLocation: 'Chennai',
    specialist: 'Designer Kurtis & Western Gowns Specialist',
    experience: '5 yrs',
    about: 'Contemporary stitching boutique tailored for modern trends, formal suits, palazzo suits, and everyday chic ethnic wear.',
    services: ['Designer Kurtis', 'Western Gowns', 'Salwar Kameez', 'Pattern Drafting', 'Fast Alteration'],
    rating: 4.6,
    reviewCount: 19,
    verificationStatus: 'VERIFIED',
    dailyCapacity: 8,
    urgentAvailable: true,
    avatar: anandhi.profileImage,
    coverImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80'
  })

  const grace = await User.create({
    name: 'Grace Mary',
    email: 'grace.bridal@tailorconnect.com',
    username: 'grace_couture',
    password: await hash('tailor123'),
    role: 'TAILOR',
    phone: '9876543255',
    location: 'Trichy',
    address: '22, Williams Road, Cantonment, Trichy, Tamil Nadu',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    isVerified: true
  })
  await TailorProfile.create({
    userId: grace._id,
    shopName: 'Grace Bridal Couture Hub',
    shopLocation: 'Trichy',
    specialist: 'Bridal Gowns & Reception Blouse Specialist',
    experience: '10 yrs',
    about: 'Bespoke bridal styling, couture bridal blouses, reception gowns, and handcrafted veil stitching with door delivery.',
    services: ['Bridal Blouse', 'Reception Gowns', 'Bridal Veils', 'Aari Work', 'Kids Ethnic Wear'],
    rating: 4.8,
    reviewCount: 31,
    verificationStatus: 'VERIFIED',
    dailyCapacity: 4,
    urgentAvailable: true,
    avatar: grace.profileImage,
    coverImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'
  })

  // ── 5. PORTFOLIO ────────────────────────────────────────────────────
  await Portfolio.insertMany([
    { tailorId: lakshmi._id, title: 'Royal Peacock Aari Bridal Blouse', category: 'Aari Blouse', fabric: 'Kanchipuram Pure Silk', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80', description: 'Heavy gold zardosi with cut dana and micro pearl embellishment.' },
    { tailorId: lakshmi._id, title: 'Contemporary Saree Blouse with Tassels', category: 'Saree Blouse', fabric: 'Brocade Silk', image: 'https://images.unsplash.com/photo-1583391733975-0210f9689408?w=600&auto=format&fit=crop&q=80', description: 'Festive high-neck cut-work design with handmade silk latkans.' },
    { tailorId: lakshmi._id, title: 'Embroidered Kids Pattu Pavadai', category: 'Kids Wear', fabric: 'Raw Silk', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80', description: 'Comfortable pure silk festive attire tailored for young girls.' },
    { tailorId: radha._id, title: 'Antique Temple Maggam Work Blouse', category: 'Embroidery', fabric: 'Raw Silk', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80', description: 'Stunning peacock motifs handcrafted using antique gold zari.' },
    { tailorId: suresh._id, title: 'Flared Velvet Bridal Lehenga Set', category: 'Lehenga', fabric: 'Silk Velvet & Net', image: 'https://images.unsplash.com/photo-1610030469668-932d59f77f52?w=600&auto=format&fit=crop&q=80', description: 'Deep crimson velvet flared lehenga with heavy hem gold thread embroidery.' },
    { tailorId: anandhi._id, title: 'Handloom Cotton Designer Kurti', category: 'Custom Dress', fabric: 'Handloom Cotton', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80', description: 'Breathable handloom cotton straight-cut designer kurti.' }
  ])

  // ── 6. COURSES ──────────────────────────────────────────────────────
  const course1 = await Course.create({
    tailorId: lakshmi._id,
    title: 'Aari Embroidery & Maggam Needlework Masterclass',
    category: 'Aari Blouse',
    description: 'Comprehensive hands-on training on Aari needle handling, chain stitch, zari winding, pearl stringing, and heavy bridal neckline motifs.',
    duration: '15 Days', durationDays: 15, mode: 'OFFLINE',
    location: '45, Gandhi Road, T.Nagar, Chennai',
    startDate: '2026-09-01', endDate: '2026-09-15',
    days: 'Monday to Friday', startTime: '10:00 AM', endTime: '12:00 PM',
    price: 1499, capacity: 20, registeredCount: 1,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80',
    requirements: 'Basic interest in hand stitching, Aari needle set (provided in class)',
    courseContent: 'Needle angles, Zari thread lock, Stone chain fixing, Peacock motifs, Cutwork',
    status: 'ACTIVE'
  })

  const course2 = await Course.create({
    tailorId: anandhi._id,
    title: 'Fundamentals of Tailoring & Pattern Cutting',
    category: 'Custom Dress',
    description: 'Learn foundational body measurements, dart drafting, seam allowances, and cutting layout optimization.',
    duration: '30 Days', durationDays: 30, mode: 'ONLINE',
    location: 'Online Live Video Sessions',
    startDate: '2026-09-05', endDate: '2026-10-05',
    days: 'Tuesday, Thursday, Saturday', startTime: '04:00 PM', endTime: '06:00 PM',
    price: 799, capacity: 25, registeredCount: 2,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
    requirements: 'Measuring tape, drafting paper, tailoring shears',
    courseContent: 'Body measurement charts, pattern grading, sleeve drafting, neck canvas cutting',
    status: 'ACTIVE'
  })

  const course3 = await Course.create({
    tailorId: radha._id,
    title: 'Antique Maggam Work & Zari Designing Workshop',
    category: 'Embroidery',
    description: 'Intensive 10-day workshop on heritage South Indian Maggam frame mounting and traditional temple borders.',
    duration: '10 Days', durationDays: 10, mode: 'OFFLINE',
    location: '88, West Masi Street, Madurai',
    startDate: '2026-09-12', endDate: '2026-09-22',
    days: 'Daily', startTime: '11:00 AM', endTime: '02:00 PM',
    price: 1899, capacity: 15, registeredCount: 15,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
    requirements: 'Prior experience in basic hand embroidery',
    courseContent: 'Maggam cot mounting, Antique zardosi coil work, Gota patti borders, Sequin locking',
    status: 'CLOSED'
  })

  // ── 7. OFFERS ───────────────────────────────────────────────────────
  await Offer.insertMany([
    {
      tailorId: lakshmi._id,
      title: 'Bridal Blouse Stitching Festival Offer',
      category: 'Bridal Blouse',
      description: 'Special seasonal discount for bridal blouse stitching.',
      targetAudience: 'CUSTOMER', mode: 'OFFLINE', duration: '5 Days',
      startDate: '2026-08-20', endDate: '2026-09-10',
      days: 'Monday to Saturday', startTime: '09:00 AM', endTime: '08:00 PM',
      location: '45, Gandhi Road, T.Nagar, Chennai', price: 999,
      maxRegistrations: 30, currentRegistrations: 18, status: 'ACTIVE',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80'
    },
    {
      tailorId: suresh._id,
      title: 'Designer Lehenga & Flared Skirt Tailoring Offer',
      category: 'Lehenga',
      description: 'Custom stitched flared party wear and bridal lehenga.',
      targetAudience: 'CUSTOMER', mode: 'OFFLINE', duration: '7 Days',
      startDate: '2026-08-15', endDate: '2026-09-15',
      days: 'Monday to Saturday', startTime: '10:00 AM', endTime: '07:00 PM',
      location: '14, DB Road, RS Puram, Coimbatore', price: 2499,
      maxRegistrations: 25, currentRegistrations: 14, status: 'ACTIVE',
      image: 'https://images.unsplash.com/photo-1610030469668-932d59f77f52?w=600&auto=format&fit=crop&q=80'
    }
  ])

  // ── 8. COURSE REGISTRATIONS ─────────────────────────────────────────
  const reg1 = await CourseRegistration.create({ studentId: meena._id, courseId: course1._id, tailorId: lakshmi._id, paymentId: 'PAY-CRS-101', status: 'IN_PROGRESS' })
  const reg2 = await CourseRegistration.create({ studentId: meena._id, courseId: course2._id, tailorId: anandhi._id, paymentId: 'PAY-CRS-102', status: 'COMPLETED', completedAt: new Date('2026-07-28') })
  const reg3 = await CourseRegistration.create({ studentId: ravi._id, courseId: course2._id, tailorId: anandhi._id, paymentId: 'PAY-CRS-103', status: 'REGISTERED' })

  // ── 9. CERTIFICATES ─────────────────────────────────────────────────
  await Certificate.create({
    certificateId: 'TC-CERT-2026-881',
    studentId: meena._id,
    studentName: meena.name,
    studentEmail: meena.email,
    courseId: course2._id,
    courseName: 'Fundamentals of Tailoring & Pattern Cutting',
    tailorId: anandhi._id,
    tailorName: anandhi.name,
    shopName: 'Modern Stitch Fashion Lab',
    completionDate: '2026-07-28',
    duration: '30 Days (45 Hours)',
    grade: 'Exemplary with Distinction',
    verificationCode: 'TC-CERT-MAD-881'
  })

  // ── 10. ORDERS ──────────────────────────────────────────────────────
  const order1 = await Order.create({
    orderNumber: 'ORD-1001',
    customerId: priya._id, tailorId: lakshmi._id,
    dressType: 'Bridal Blouse', designName: 'Pure Silk Bridal Blouse with Zardosi',
    designImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    category: 'Bridal Blouse', fabric: 'Kanchipuram Pure Silk', color: 'Crimson Pink & Antique Gold', quantity: 1,
    measBust: '36', measWaist: '30', measHip: '38', measShoulder: '14.5', measSleeveLength: '11.0', measDressLength: '15.0',
    specialInstructions: 'Deep U-neck back with gold potli buttons. Extra 1.5-inch side margin for future alteration.',
    deliveryAddress: priya.address, deliveryLocation: 'Chennai', price: 1800,
    paymentStatus: 'SUCCESS', paymentId: 'PAY-ORD-1001', orderStatus: 'IN_PROGRESS', progress: 65,
    urgent: true, orderDate: '2026-08-20', deadline: '2026-09-02'
  })

  const order2 = await Order.create({
    orderNumber: 'ORD-1002',
    customerId: priya._id, tailorId: radha._id,
    dressType: 'Aari Blouse', designName: 'Peacock Motif Aari Hand Embroidery Blouse',
    designImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80',
    category: 'Aari Blouse', fabric: 'Raw Silk', color: 'Peacock Green & Royal Blue', quantity: 1,
    measBust: '36', measWaist: '30', measHip: '38', measShoulder: '14.5', measSleeveLength: '10.5', measDressLength: '14.5',
    specialInstructions: 'Elbow sleeve peacock feather motif with pearl drop beads.',
    deliveryAddress: priya.address, deliveryLocation: 'Chennai', price: 2200,
    paymentStatus: 'PENDING', orderStatus: 'REQUEST_RECEIVED', progress: 10,
    urgent: false, orderDate: '2026-08-26', deadline: '2026-09-18'
  })

  const order3 = await Order.create({
    orderNumber: 'ORD-1003',
    customerId: anitha._id, tailorId: suresh._id,
    dressType: 'Lehenga', designName: 'Flared Velvet Bridal Lehenga Set',
    designImage: 'https://images.unsplash.com/photo-1610030469668-932d59f77f52?w=600&auto=format&fit=crop&q=80',
    category: 'Lehenga', fabric: 'Silk Velvet & Net', color: 'Wine Red & Gold Zari', quantity: 1,
    measBust: '34', measWaist: '28', measHip: '36', measShoulder: '14.0', measSleeveLength: '9.0', measDressLength: '42.0',
    specialInstructions: 'Flared umbrella cut skirt with double horsehair braid hem.',
    deliveryAddress: anitha.address, deliveryLocation: 'Coimbatore', price: 3200,
    paymentStatus: 'SUCCESS', paymentId: 'PAY-ORD-1003', orderStatus: 'DELIVERED', progress: 100,
    urgent: false, orderDate: '2026-08-01', deadline: '2026-08-16',
    deliveredAt: new Date('2026-08-16'), hasReviewed: true
  })

  const order4 = await Order.create({
    orderNumber: 'ORD-1004',
    customerId: divya._id, tailorId: lakshmi._id,
    dressType: 'Embroidery', designName: 'Metallic Zardosi & Pearl Designer Blouse',
    designImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
    category: 'Embroidery', fabric: 'Pure Georgette', color: 'Mustard Yellow & Pearl White', quantity: 1,
    measBust: '38', measWaist: '32', measHip: '40', measShoulder: '15.0', measSleeveLength: '11.5', measDressLength: '15.5',
    specialInstructions: 'Heavy pearl work along the neck border.',
    deliveryAddress: divya.address, deliveryLocation: 'Trichy', price: 1600,
    paymentStatus: 'SUCCESS', paymentId: 'PAY-ORD-1004', orderStatus: 'DELIVERED', progress: 100,
    urgent: true, orderDate: '2026-07-28', deadline: '2026-08-12',
    deliveredAt: new Date('2026-08-12'), hasReviewed: true
  })

  // ── 11. DELIVERIES ──────────────────────────────────────────────────
  await Delivery.insertMany([
    { orderId: order1._id, status: 'In Production Queue', currentLocation: 'Lakshmi Stitches & Bridal Studio (T.Nagar, Chennai)', deliveryPartner: 'Direct Studio Messenger', expectedDeliveryDate: order1.deadline },
    { orderId: order3._id, status: 'Delivered', currentLocation: '56, Race Course Road, Coimbatore', deliveryPartner: 'BlueDart Express', expectedDeliveryDate: '2026-08-16' },
    { orderId: order4._id, status: 'Delivered', currentLocation: '18, Thillai Nagar, Trichy', deliveryPartner: 'Professional Couriers', expectedDeliveryDate: '2026-08-12' }
  ])

  // ── 12. REVIEWS ─────────────────────────────────────────────────────
  await Review.insertMany([
    { customerId: divya._id, customerName: divya.name, customerEmail: divya.email, tailorId: lakshmi._id, orderId: order4._id, rating: 5, comment: 'Outstanding Aari needlework! The bridal blouse fitting was flawless and delivered right on time.' },
    { customerId: anitha._id, customerName: anitha.name, customerEmail: anitha.email, tailorId: suresh._id, orderId: order3._id, rating: 5, comment: 'Gorgeous heavy embroidery and perfect flare for my cousin wedding lehenga. Highly recommended!' }
  ])

  // ── 13. PAYMENTS ────────────────────────────────────────────────────
  await Payment.insertMany([
    { paymentNumber: 'PAY-ORD-1001', userId: priya._id, userName: priya.name, userType: 'Customer', type: 'Order', orderId: order1._id, orderNumber: 'ORD-1001', tailorId: lakshmi._id, tailorName: 'Lakshmi Devi (Lakshmi Stitches)', title: 'Custom Pure Silk Bridal Blouse Stitching', amount: 1800, platformFee: 50, gst: 90, paymentMethod: 'UPI (Google Pay)', transactionId: 'TXN-TC-20260820-9941', status: 'SUCCESS' },
    { paymentNumber: 'PAY-ORD-1003', userId: anitha._id, userName: anitha.name, userType: 'Customer', type: 'Order', orderId: order3._id, orderNumber: 'ORD-1003', tailorId: suresh._id, tailorName: 'Suresh Kumar (Royal Threads)', title: 'Designer Lehenga & Blouse Set Stitching', amount: 3200, platformFee: 50, gst: 160, paymentMethod: 'Credit Card', transactionId: 'TXN-TC-20260801-4412', status: 'SUCCESS' },
    { paymentNumber: 'PAY-CRS-101', userId: meena._id, userName: meena.name, userType: 'Student', type: 'Course', courseId: course1._id, tailorId: lakshmi._id, tailorName: 'Lakshmi Devi (Lakshmi Stitches)', title: 'Aari Embroidery & Maggam Needlework Masterclass', amount: 1499, platformFee: 50, gst: 75, paymentMethod: 'UPI', transactionId: 'TXN-TC-20260810-8871', status: 'SUCCESS' }
  ])

  // ── 14. WISHLIST ────────────────────────────────────────────────────
  await Wishlist.insertMany([
    { customerId: priya._id, itemType: 'DESIGN', itemId: '3', title: 'Metallic Zardosi & Pearl Designer Blouse', category: 'Embroidery', price: '₹1,500', tailor: 'Suresh Kumar (Royal Threads)', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80' },
    { customerId: priya._id, itemType: 'DESIGN', itemId: '4', title: 'Flared Velvet Bridal Lehenga Set', category: 'Lehenga', price: '₹4,500', tailor: 'Grace Mary (Grace Bridal)', image: 'https://images.unsplash.com/photo-1610030469668-932d59f77f52?w=600&auto=format&fit=crop&q=80' }
  ])

  // ── 15. CONVERSATION & MESSAGES ─────────────────────────────────────
  const conv = await Conversation.create({
    customerId: priya._id,
    tailorId: lakshmi._id,
    orderId: order1._id,
    lastMessage: 'Noted with care. We have cut the neckline and began the gold zardosi embroidery border today.'
  })

  await Message.insertMany([
    { conversationId: conv._id, orderId: 'ORD-1001', senderId: lakshmi._id, senderRole: 'tailor', receiverId: priya._id, message: 'Namaste Priya! We received your order for the Crimson Pink Silk Bridal Blouse. The fabric swatch looks gorgeous.' },
    { conversationId: conv._id, orderId: 'ORD-1001', senderId: priya._id, senderRole: 'customer', receiverId: lakshmi._id, message: 'Thank you Lakshmi mam! Please make sure the back neck depth is 9.5 inches as requested in the notes.' },
    { conversationId: conv._id, orderId: 'ORD-1001', senderId: lakshmi._id, senderRole: 'tailor', receiverId: priya._id, message: 'Noted with care. We have cut the neckline and began the gold zardosi embroidery border today.' }
  ])

  // ── 16. NOTIFICATIONS ───────────────────────────────────────────────
  await Notification.insertMany([
    { userId: priya._id, type: 'ORDER_PROGRESS', title: 'Order Status Update 🪡', message: 'Lakshmi Stitches has started stitching your order ORD-1001.', relatedId: order1._id.toString(), isRead: false },
    { userId: priya._id, type: 'PAYMENT_SUCCESS', title: 'Payment Successful – Order #ORD-1001', message: 'Your payment of ₹1,800 for Pure Silk Bridal Blouse was processed successfully.', relatedId: order1._id.toString(), isRead: true },
    { userId: lakshmi._id, type: 'ORDER_CREATED', title: 'New Customized Order Received', message: 'Customer Priya Sharma placed order ORD-1001 for Pure Silk Bridal Blouse.', relatedId: order1._id.toString(), isRead: false },
    { userId: lakshmi._id, type: 'COURSE_REGISTERED', title: 'New Student Enrollment', message: 'Meena Sundaram registered for Aari Embroidery & Maggam Needlework Masterclass.', relatedId: course1._id.toString(), isRead: true },
    { userId: meena._id, type: 'COURSE_REGISTERED', title: 'Course Registration Successful', message: 'You are enrolled in Aari Embroidery & Maggam Needlework Masterclass. Starts on 01 Sep 2026.', relatedId: course1._id.toString(), isRead: false }
  ])

  console.log('[Seed] ✅ Database seeded successfully with authentic TailorConnect data!')
  console.log('[Seed] ─────────────────────────────────────────────────────────────────')
  console.log('[Seed] 5 Role Accounts Created:')
  console.log('[Seed]   1. ADMIN    → admin@tailorconnect.com       / admin123')
  console.log('[Seed]   2. TAILOR   → tailor@tailorconnect.com      / tailor123')
  console.log('[Seed]   3. CUSTOMER → customer@tailorconnect.com    / customer123')
  console.log('[Seed]   4. STUDENT  → student@tailorconnect.com     / student123')
  console.log('[Seed]   5. EMPLOYEE → employee@tailorconnect.com    / employee123')
  console.log('[Seed] ─────────────────────────────────────────────────────────────────')

  if (disconnectAfter) await disconnectDB()
}

// Allow running directly: node src/seed/seed.js
const args = process.argv.slice(2)
if (args.includes('--run') || process.argv[1]?.includes('seed.js')) {
  seedDatabase(true, false).catch((err) => {
    console.error('[Seed] Error:', err)
    process.exit(1)
  })
}
