// Centralized mock data. Used as fallback when the backend API is unavailable.
// Images use authentic, topic-matched fashion & tailoring photography.

export const tailors = [
  {
    id: 1,
    name: 'Lakshmi Stitches',
    shopName: 'Lakshmi Stitches Boutique',
    location: 'Chennai (T. Nagar)',
    specialties: ['Bridal Blouse', 'Aari Work', 'Silk Sarees'],
    rating: 4.9,
    reviewsCount: 38,
    experience: '8 yrs',
    verified: true,
    price: '₹800+',
    about: 'Master tailor with 8+ years specializing in traditional South Indian bridal wear and heavy Aari needlework.',
    phone: '9876543211',
    email: 'tailor@tailorconnect.com',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    name: 'Royal Threads Boutique',
    shopName: 'Royal Threads & Embroidery Studio',
    location: 'Coimbatore (RS Puram)',
    specialties: ['Zardosi', 'Designer Blouse', 'Lehenga'],
    rating: 4.7,
    reviewsCount: 24,
    experience: '6 yrs',
    verified: true,
    price: '₹650+',
    about: 'Premier boutique for royal bridal wear, custom-tailored lehengas, and intricate thread work.',
    phone: '9876543222',
    email: 'royal.threads@tailorconnect.com',
    image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    name: 'Vintage Needle Works',
    shopName: 'Vintage Needle Heritage Tailors',
    location: 'Madurai (West Masi)',
    specialties: ['Aari', 'Bridal Blouse', 'Maggam Work'],
    rating: 4.9,
    reviewsCount: 52,
    experience: '12 yrs',
    verified: true,
    price: '₹1200+',
    about: 'Specialists in heirloom wedding blouses, handcrafted Maggam embroidery, and antique zari designs.',
    phone: '9876543233',
    email: 'vintage.needle@tailorconnect.com',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 4,
    name: 'Modern Stitch Studio',
    shopName: 'Modern Stitch Fashion Lab',
    location: 'Chennai (Anna Nagar)',
    specialties: ['Designer Kurtis', 'Casual Wear', 'Western Gowns'],
    rating: 4.4,
    reviewsCount: 19,
    experience: '4 yrs',
    verified: true,
    price: '₹450+',
    about: 'Contemporary stitching boutique tailored for modern trends, formal suits, and festive ethnic kurtis.',
    phone: '9876543244',
    email: 'modern.stitch@tailorconnect.com',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 5,
    name: 'Grace Bridal Couture',
    shopName: 'Grace Bridal & Couture Hub',
    location: 'Trichy (Cantonment)',
    specialties: ['Bridal Blouse', 'Aari Work', 'Reception Gowns'],
    rating: 4.8,
    reviewsCount: 41,
    experience: '10 yrs',
    verified: true,
    price: '₹1500+',
    about: 'Bespoke bridal styling and high-end handcrafted bridal wear with door delivery.',
    phone: '9876543255',
    email: 'grace.bridal@tailorconnect.com',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 6,
    name: 'Silver Needle Tailors',
    shopName: 'Silver Needle Alteration & Stitching',
    location: 'Salem (Fairlands)',
    specialties: ['Custom Blouse', 'Alteration', 'Salwar Suits'],
    rating: 4.3,
    reviewsCount: 15,
    experience: '5 yrs',
    verified: true,
    price: '₹500+',
    about: 'Fast turnaround and precise fitting for daily wear, festive kurtas, and custom blouse stitching.',
    phone: '9876543266',
    email: 'silver.needle@tailorconnect.com',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&auto=format&fit=crop&q=80'
  }
]

export const dressDesigns = [
  {
    id: 1,
    title: 'Silk Bridal Blouse',
    category: 'Bridal Blouse',
    fabric: 'Kanchipuram Pure Silk',
    tailor: 'Lakshmi Stitches',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80',
    description: 'Rich royal pink bridal blouse with heavy gold zardosi and bead borders.'
  },
  {
    id: 2,
    title: 'Aari Work Blouse',
    category: 'Aari Blouse',
    fabric: 'Raw Silk',
    tailor: 'Vintage Needle Works',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&auto=format&fit=crop&q=80',
    description: 'Intricate floral peacock motif Aari hand embroidery with dual-tone thread work.'
  },
  {
    id: 3,
    title: 'Zardosi Embroidery Blouse',
    category: 'Embroidery',
    fabric: 'Georgette Silk',
    tailor: 'Royal Threads Boutique',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&auto=format&fit=crop&q=80',
    description: 'Dazzling handcrafted metallic zardosi embroidery with pearl embellishments.'
  },
  {
    id: 4,
    title: 'Designer Bridal Lehenga',
    category: 'Lehenga',
    fabric: 'Silk Velvet',
    tailor: 'Grace Bridal Couture',
    image: 'https://images.unsplash.com/photo-1610030469668-932d59f77f52?w=500&auto=format&fit=crop&q=80',
    description: 'Flared bridal lehenga with heavy hem embroidery, matching blouse, and net dupatta.'
  },
  {
    id: 5,
    title: 'Contemporary Saree Blouse',
    category: 'Saree Blouse',
    fabric: 'Brocade Silk',
    tailor: 'Modern Stitch Studio',
    image: 'https://images.unsplash.com/photo-1583391733975-0210f9689408?w=500&auto=format&fit=crop&q=80',
    description: 'Stylish high-neck cut-work saree blouse designed for festive celebrations.'
  },
  {
    id: 6,
    title: 'Traditional Aari Bridal Set',
    category: 'Bridal Wear',
    fabric: 'Tussar Silk',
    tailor: 'Lakshmi Stitches',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&auto=format&fit=crop&q=80',
    description: 'Complete bridal trousseau stitching including matching blouse, hip belt, and veil.'
  }
]

export const fabrics = [
  { id: 1, name: 'Pure Silk', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Handloom Cotton', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Pure Georgette', image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&auto=format&fit=crop&q=80' },
  { id: 4, name: 'Bridal Net', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&auto=format&fit=crop&q=80' },
  { id: 5, name: 'Micro Velvet', image: 'https://images.unsplash.com/photo-1528458983935-7170e7e1f435?w=400&auto=format&fit=crop&q=80' }
]

export const courses = [
  {
    id: 1,
    title: 'Fundamentals of Tailoring & Pattern Making',
    category: 'Beginner',
    instructor: 'Lakshmi Devi',
    tailorId: 1,
    lessons: 14,
    duration: '6 weeks',
    price: 'Free',
    rating: 4.9,
    capacity: 25,
    registrations: 18,
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&auto=format&fit=crop&q=80',
    description: 'Comprehensive introduction to garment measurements, body shapes, cutting shears, and basic seam finishing.',
    progress: 60
  },
  {
    id: 2,
    title: 'Aari Embroidery & Maggam Work Masterclass',
    category: 'Aari Embroidery',
    instructor: 'Lakshmi Devi',
    tailorId: 1,
    lessons: 22,
    duration: '8 weeks',
    price: '₹999',
    rating: 5.0,
    capacity: 20,
    registrations: 14,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&auto=format&fit=crop&q=80',
    description: 'Learn needle handling, chain stitch, zari thread winding, stone fixing, and intricate bridal neck designs.',
    progress: 75
  },
  {
    id: 3,
    title: 'Bridal Blouse Design & Fitting Architecture',
    category: 'Bridal Wear',
    instructor: 'Mrs. Radha (Vintage Needle)',
    tailorId: 3,
    lessons: 18,
    duration: '10 weeks',
    price: '₹1499',
    rating: 4.8,
    capacity: 15,
    registrations: 12,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80',
    description: 'Advanced Princess Cut, Katori Cut, deep-neck back patterns, and lining fabric reinforcement.',
    progress: 20
  },
  {
    id: 4,
    title: 'Machine Embroidery & Zari Technique',
    category: 'Machine Work',
    instructor: 'Mr. Suresh (Royal Threads)',
    tailorId: 2,
    lessons: 12,
    duration: '4 weeks',
    price: '₹699',
    rating: 4.6,
    capacity: 30,
    registrations: 28,
    image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=500&auto=format&fit=crop&q=80',
    description: 'Techniques for freehand machine embroidery, corded embroidery, and metallic border stitching.',
    progress: 0
  },
  {
    id: 5,
    title: 'Fabric Drafting & Precision Pattern Cutting',
    category: 'Pattern Drafting',
    instructor: 'Mrs. Anand (Modern Stitch)',
    tailorId: 4,
    lessons: 16,
    duration: '6 weeks',
    price: '₹799',
    rating: 4.9,
    capacity: 25,
    registrations: 25,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=80',
    description: 'Master grading, darts, seam allowances, and cutting layout optimization to reduce fabric waste.',
    progress: 100
  }
]

export const orders = [
  {
    id: 'ORD-1001',
    customer: 'Priya Sharma',
    customerEmail: 'customer@tailorconnect.com',
    customerPhone: '9876543210',
    tailor: 'Lakshmi Stitches',
    tailorEmail: 'tailor@tailorconnect.com',
    item: 'Silk Bridal Blouse',
    fabric: 'Kanchipuram Silk',
    color: 'Crimson Pink & Gold',
    quantity: 1,
    status: 'in-progress',
    urgent: true,
    orderDate: '2026-08-20',
    deliveryDate: '2026-09-05',
    amount: 1800,
    progress: 60,
    paymentStatus: 'paid',
    measurements: 'Bust: 36, Waist: 30, Shoulder: 14.5, Sleeve: 11, Length: 15'
  },
  {
    id: 'ORD-1002',
    customer: 'Priya Sharma',
    customerEmail: 'customer@tailorconnect.com',
    customerPhone: '9876543210',
    tailor: 'Royal Threads Boutique',
    tailorEmail: 'royal.threads@tailorconnect.com',
    item: 'Aari Work Blouse',
    fabric: 'Raw Silk',
    color: 'Peacock Green',
    quantity: 1,
    status: 'pending',
    urgent: false,
    orderDate: '2026-08-22',
    deliveryDate: '2026-09-20',
    amount: 1200,
    progress: 10,
    paymentStatus: 'pending',
    measurements: 'Bust: 36, Waist: 30, Shoulder: 14.5, Sleeve: 10.5, Length: 14.5'
  },
  {
    id: 'ORD-1003',
    customer: 'Anitha Raj',
    customerEmail: 'anitha@example.com',
    customerPhone: '9876543214',
    tailor: 'Modern Stitch Studio',
    tailorEmail: 'modern.stitch@tailorconnect.com',
    item: 'Designer Kurti & Palazzo',
    fabric: 'Pure Cotton',
    color: 'Pastel Peach',
    quantity: 2,
    status: 'completed',
    urgent: false,
    orderDate: '2026-07-15',
    deliveryDate: '2026-08-01',
    amount: 1450,
    progress: 100,
    paymentStatus: 'paid',
    measurements: 'Bust: 34, Waist: 28, Hip: 38, Length: 42'
  },
  {
    id: 'ORD-1004',
    customer: 'Divya Kumar',
    customerEmail: 'divya@example.com',
    customerPhone: '9876543215',
    tailor: 'Grace Bridal Couture',
    tailorEmail: 'grace.bridal@tailorconnect.com',
    item: 'Bridal Blouse & Veil Set',
    fabric: 'Velvet Silk',
    color: 'Maroon & Zari Gold',
    quantity: 1,
    status: 'delivered',
    urgent: true,
    orderDate: '2026-07-05',
    deliveryDate: '2026-07-20',
    amount: 2200,
    progress: 100,
    paymentStatus: 'paid',
    measurements: 'Bust: 38, Waist: 32, Shoulder: 15, Sleeve: 12, Length: 16'
  }
]

export const quotations = [
  {
    id: 'QT-501',
    orderId: 'ORD-1002',
    tailor: 'Royal Threads Boutique',
    amount: 1200,
    estDays: 7,
    message: 'Can start immediately with premium gold zari thread work and silk lining.',
    status: 'pending'
  },
  {
    id: 'QT-502',
    orderId: 'ORD-1002',
    tailor: 'Silver Needle Tailors',
    amount: 1000,
    estDays: 10,
    message: 'Affordable pricing with clean piping and double stitching guarantee.',
    status: 'pending'
  }
]

export const appointments = [
  {
    id: 1,
    with: 'Lakshmi Stitches',
    date: '2026-08-28',
    time: '11:00 AM',
    purpose: 'Bridal Blouse Measurement & Neckline Customization',
    status: 'pending'
  },
  {
    id: 2,
    with: 'Grace Bridal Couture',
    date: '2026-08-30',
    time: '03:00 PM',
    purpose: 'Silk Fabric Swatch & Zardosi Pattern Finalization',
    status: 'approved'
  }
]

export const reviews = [
  {
    id: 1,
    tailor: 'Lakshmi Stitches',
    customer: 'Priya Sharma',
    rating: 5,
    date: '2026-08-15',
    comment: 'Outstanding Aari needlework! The bridal blouse fitting was flawless and delivered right on time.'
  },
  {
    id: 2,
    tailor: 'Grace Bridal Couture',
    customer: 'Divya Kumar',
    rating: 5,
    date: '2026-07-22',
    comment: 'Gorgeous heavy embroidery. The craftsmanship made my wedding reception look extraordinary.'
  },
  {
    id: 3,
    tailor: 'Modern Stitch Studio',
    customer: 'Anitha Raj',
    rating: 4,
    date: '2026-08-03',
    comment: 'Neat finishing and perfect collar stitch for daily office kurtis. Highly recommended.'
  }
]

export const notifications = [
  {
    id: 1,
    title: 'Order Status Update',
    body: 'Lakshmi Stitches has started stitching for order ORD-1001.',
    time: '2 hours ago',
    read: false
  },
  {
    id: 2,
    title: 'Payment Successful',
    body: 'Your payment of ₹1800 for ORD-1001 was processed successfully.',
    time: '1 day ago',
    read: true
  },
  {
    id: 3,
    title: 'New Course Assignment',
    body: 'Aari Embroidery Masterclass: Lesson 4 practice patterns are now available.',
    time: '2 days ago',
    read: false
  }
]

export const wishlist = [
  {
    id: 1,
    title: 'Zardosi Embroidery Blouse',
    tailor: 'Royal Threads Boutique',
    category: 'Embroidery',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    title: 'Traditional Aari Bridal Set',
    tailor: 'Lakshmi Stitches',
    category: 'Bridal Wear',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&auto=format&fit=crop&q=80'
  }
]

export const customers = [
  {
    id: 1,
    name: 'Priya Sharma',
    email: 'customer@tailorconnect.com',
    phone: '9876543210',
    orders: 2,
    joined: '2026-01-10',
    status: 'active',
    location: 'Chennai'
  },
  {
    id: 2,
    name: 'Anitha Raj',
    email: 'anitha@example.com',
    phone: '9876543214',
    orders: 1,
    joined: '2026-02-20',
    status: 'active',
    location: 'Coimbatore'
  },
  {
    id: 3,
    name: 'Divya Kumar',
    email: 'divya@example.com',
    phone: '9876543215',
    orders: 1,
    joined: '2026-03-05',
    status: 'active',
    location: 'Trichy'
  }
]

export const students = [
  {
    id: 1,
    name: 'Meena Sundaram',
    email: 'student@tailorconnect.com',
    phone: '9876543212',
    coursesEnrolled: 2,
    joined: '2026-01-15',
    location: 'Madurai'
  },
  {
    id: 2,
    name: 'Ravi Kumar',
    email: 'ravi.k@example.com',
    phone: '9876543288',
    coursesEnrolled: 1,
    joined: '2026-02-15',
    location: 'Chennai'
  }
]

export const complaints = [
  {
    id: 1,
    from: 'Anitha Raj',
    against: 'Silver Needle Tailors',
    subject: 'Minor sleeve alteration requested',
    status: 'resolved',
    date: '2026-08-10'
  }
]

export const assignments = [
  {
    id: 1,
    course: 'Aari Embroidery & Maggam Work Masterclass',
    title: 'Draft a floral peacock neck pattern using zari thread',
    dueDate: '2026-08-30',
    status: 'pending'
  },
  {
    id: 2,
    title: 'Draft standard front and back bodice patterns',
    course: 'Fundamentals of Tailoring & Pattern Making',
    dueDate: '2026-08-18',
    status: 'submitted'
  }
]

export const quizzes = [
  {
    id: 1,
    course: 'Fundamentals of Tailoring & Pattern Making',
    title: 'Sewing Machine Maintenance & Needle Types Quiz',
    questions: 10,
    status: 'completed',
    score: '9/10'
  },
  {
    id: 2,
    course: 'Aari Embroidery & Maggam Work Masterclass',
    title: 'Aari Needle Numbers & Thread Tension Fundamentals',
    questions: 12,
    status: 'not-started'
  }
]

export const certificates = [
  {
    id: 'CERT-2026-881',
    course: 'Fabric Drafting & Precision Pattern Cutting',
    student: 'Meena Sundaram',
    tailor: 'Mrs. Anand (Modern Stitch)',
    issuedOn: '2026-07-28',
    duration: '6 weeks'
  }
]

