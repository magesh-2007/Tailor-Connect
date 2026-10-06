import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import Button from '../../components/Button'

const DEFAULT_COURSES = [
  {
    id: 'CRS-101',
    name: 'Basic Tailoring & Sewing Machine Mastery',
    category: 'Basic Tailoring',
    price: 1499,
    durationDays: 15,
    trainerName: 'Lakshmi Devi',
    shopName: 'Lakshmi Stitches & Bridal Studio',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&auto=format&fit=crop&q=80',
    description: 'Learn foundational sewing machine operation, straight seams, neck pipings, and basic bodice patterns.'
  },
  {
    id: 'CRS-102',
    name: 'Blouse Stitching & Perfect Fitting Masterclass',
    category: 'Blouse Stitching',
    price: 1999,
    durationDays: 10,
    trainerName: 'Mrs. Radha Raman',
    shopName: 'Vintage Needle Heritage Tailors',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    description: 'Master 4-dart, princess cut, and padded bridal blouses with zero shoulder droop guarantee.'
  },
  {
    id: 'CRS-103',
    name: 'Aari Embroidery & Maggam Needlework',
    category: 'Aari Embroidery',
    price: 2999,
    durationDays: 20,
    trainerName: 'Lakshmi Devi',
    shopName: 'Lakshmi Stitches & Bridal Studio',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80',
    description: 'Complete hands-on Aari chain stitch, zari cord, zardosi, cutwork, and peacock motif embroidery.'
  },
  {
    id: 'CRS-104',
    name: 'Traditional Saree Draping & Regional Styling',
    category: 'Saree Draping',
    price: 799,
    durationDays: 5,
    trainerName: 'Grace Mary',
    shopName: 'Grace Bridal Couture Hub',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80',
    description: 'Master 10+ regional Indian drape styles including South Indian bridal, Nauvari, and contemporary pleats.'
  },
  {
    id: 'CRS-105',
    name: 'Advanced Dress Designing & Flared Couture',
    category: 'Advanced Designing',
    price: 4999,
    durationDays: 30,
    trainerName: 'Suresh Kumar',
    shopName: 'Royal Threads & Embroidery Studio',
    image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=600&auto=format&fit=crop&q=80',
    description: 'Can-can flared lehengas, party wear reception gowns, drape neck patterns, and fabric grading.'
  }
]

export default function CustomerLearning() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = () => {
    const rawTailorCourses = localStorage.getItem('tc_tailor_courses_data')
    if (rawTailorCourses) {
      const parsed = JSON.parse(rawTailorCourses)
      const mapped = parsed.map(c => ({
        id: c.id,
        name: c.title,
        category: c.level,
        price: c.fee,
        durationDays: parseInt(c.duration) || 15,
        trainerName: 'Lakshmi Devi',
        shopName: 'Lakshmi Stitches Studio',
        image: c.image,
        description: c.description
      }))
      setCourses(mapped.length > 0 ? mapped : DEFAULT_COURSES)
    } else {
      setCourses(DEFAULT_COURSES)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <DashboardLayout role="customer">
      <div className="page-header">
        <div>
          <h1>Tailoring Workshops & Learning Hub</h1>
          <p>Learn South Indian bridal embroidery, blouse drafting, and precision pattern techniques from master tailors.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {courses.map(c => (
          <div className="card" key={c.id} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <img 
              src={c.image || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&auto=format&fit=crop&q=80'} 
              alt={c.name}
              style={{ width: '100%', height: 160, objectFit: 'cover' }}
            />
            <div className="card-body" style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div className="flex-between" style={{ marginBottom: 6 }}>
                <span className="sidebar-role-badge" style={{ fontSize: 11 }}>{c.category || 'Embroidery'}</span>
                <strong style={{ color: 'var(--primary)', fontSize: 16 }}>₹{c.price}</strong>
              </div>

              <h3 style={{ fontSize: 16, color: 'var(--text-main)', margin: '0 0 6px 0' }}>{c.name}</h3>
              <p className="muted" style={{ fontSize: 12.5, margin: '0 0 10px 0' }}>
                Instructor: <strong>{c.trainerName || c.shopName}</strong> • {c.durationDays} Days
              </p>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.45 }}>
                {c.description ? c.description.slice(0, 110) + '...' : 'Hands-on practical tailoring and blouse styling workshop.'}
              </p>

              <div style={{ marginTop: 'auto', display: 'flex', gap: 10 }}>
                <Link to={`/student/courses/${c.id}`} style={{ flex: 1 }}>
                  <Button variant="outline" size="sm" block>Course Details</Button>
                </Link>
                <Link to={`/payment?courseId=${c.id}&amount=${c.price}&item=${encodeURIComponent(c.name)}`} style={{ flex: 1 }}>
                  <Button variant="primary" size="sm" block>Enroll Now</Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
