import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import * as storage from '../../services/storageService'
import { LoadingState, ErrorState } from '../../components/States'
import Button from '../../components/Button'
import { useAuth } from '../../context/AuthContext'

export default function TailorProfile() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [tailor, setTailor] = useState(null)
  const [services, setServices] = useState([])
  const [courses, setCourses] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [wishlisted, setWishlisted] = useState(false)

  // Book Appointment Modal state
  const [showApptModal, setShowApptModal] = useState(false)
  const [apptService, setApptService] = useState('Bridal Blouse Measurement')
  const [apptDate, setApptDate] = useState(new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0])
  const [apptTime, setApptTime] = useState('11:00 AM')
  const [apptPurpose, setApptPurpose] = useState('Measurement & Silk Fabric Swatch Finalization')
  const [apptSuccess, setApptSuccess] = useState(false)

  const loadData = () => {
    const t = storage.getTailorById(id)
    if (t) {
      setTailor(t)
      setServices(t.services || ['Aari Blouse Stitching', 'Bridal Blouse Designing', 'Silk Saree Kuchu', 'Custom Alteration', 'Maggam Needlework'])
      const allOffers = storage.getOffers ? storage.getOffers() : []
      setCourses(allOffers.filter(o => o.tailorId === t.id || o.trainerName === t.name))
      setReviews(storage.getReviewsForTailor(t.id))
      // Check wishlist
      if (user) {
        const wl = storage.getWishlistForUser(user.id)
        setWishlisted(wl.some(w => w.itemId === t.id))
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
    const handleDataChange = () => loadData()
    window.addEventListener('tc_data_changed', handleDataChange)
    return () => window.removeEventListener('tc_data_changed', handleDataChange)
  }, [id])

  const handleBookAppointment = (e) => {
    e.preventDefault()
    const newAppt = {
      id: `APT-${Date.now().toString().slice(-4)}`,
      customerId: user?.id || 'user-cust-1',
      customerName: user?.name || 'Priya Sharma',
      customerPhone: user?.phone || '9876543210',
      customerEmail: user?.email || 'customer@tailorconnect.com',
      tailorId: tailor.id,
      tailorName: tailor.name,
      shopName: tailor.shopName,
      service: apptService,
      date: apptDate,
      time: apptTime,
      purpose: apptPurpose,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    const existingAppts = JSON.parse(localStorage.getItem('tc_appointments_data') || '[]')
    existingAppts.unshift(newAppt)
    localStorage.setItem('tc_appointments_data', JSON.stringify(existingAppts))

    setApptSuccess(true)
    setTimeout(() => {
      setShowApptModal(false)
      setApptSuccess(false)
      navigate('/customer/appointments')
    }, 1200)
  }

  if (loading) return <DashboardLayout role="customer"><LoadingState message="Loading tailor profile..." /></DashboardLayout>
  if (!tailor) return <DashboardLayout role="customer"><ErrorState message="Tailor not found." /></DashboardLayout>

  const avgRating = tailor.rating || storage.getTailorAverageRating(tailor.id) || 4.9

  return (
    <DashboardLayout role="customer">
      {/* PROFILE HEADER & COVER */}
      <div className="card" style={{ marginBottom: 24, overflow: 'hidden' }}>
        <div style={{ position: 'relative', height: 200, background: 'var(--primary-light)' }}>
          <img 
            src={tailor.coverImage || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&auto=format&fit=crop&q=80'} 
            alt={tailor.shopName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8 }}>
            {tailor.verified && (
              <span className="badge badge-verified" style={{ fontSize: 13, padding: '6px 12px' }}>
                ✓ Verified Master Tailor
              </span>
            )}
            <span className="badge badge-active" style={{ fontSize: 13, padding: '6px 12px' }}>
              ● Available for Orders
            </span>
          </div>
        </div>

        <div className="card-body" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', gap: 18 }}>
              <img 
                src={tailor.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80'} 
                alt={tailor.name}
                style={{ width: 84, height: 84, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--white)', marginTop: -42, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
              />
              <div>
                <h1 style={{ fontSize: 22, margin: 0, color: 'var(--primary-dark)' }}>{tailor.shopName || tailor.name}</h1>
                <p className="muted" style={{ margin: '3px 0 0 0', fontSize: 14 }}>
                  Master Artisan: <strong>{tailor.name}</strong> • <strong>{tailor.experience || '8 yrs'}</strong> Experience
                </p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 6, fontSize: 13 }}>
                  <span>📍 {tailor.address || `${tailor.location}, Tamil Nadu`}</span>
                  <span>•</span>
                  <span className="rating-pill">★ {avgRating} ({reviews.length || 38} Reviews)</span>
                  <span>•</span>
                  <strong style={{ color: 'var(--primary)' }}>Starting at {tailor.price || '₹800+'}</strong>
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link to={`/customer/create-order?tailorId=${tailor.id}`}>
                <Button variant="primary">✨ Request Customized Dress</Button>
              </Link>
              <Button variant="secondary" onClick={() => setShowApptModal(true)}>
                📅 Book Appointment
              </Button>
              <Link to="/customer/chat">
                <Button variant="outline">💬 Chat</Button>
              </Link>
              <button
                onClick={() => {
                  const item = { id: tailor.id, itemId: tailor.id, title: tailor.shopName || tailor.name, tailor: tailor.name, price: tailor.price || '₹800+', category: 'Tailor', image: tailor.avatar || '' }
                  storage.toggleWishlistItem(user?.id || 'guest', item)
                  setWishlisted(prev => !prev)
                }}
                style={{ padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 700, border: `1.5px solid ${wishlisted ? '#E11D48' : '#E5E7EB'}`, background: wishlisted ? '#FFF1F3' : '#fff', color: wishlisted ? '#E11D48' : '#9CA3AF', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}
                title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                {wishlisted ? '❤️' : '🤍'} {wishlisted ? 'Wishlisted' : 'Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2-COLUMN PROFILE CONTENT */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* LEFT COLUMN: ABOUT, SERVICES, PORTFOLIO, COURSES, REVIEWS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* ABOUT */}
          <div className="card" style={{ padding: 20 }}>
            <h2 style={{ fontSize: 16, color: 'var(--primary-dark)', marginBottom: 8 }}>About the Craftsman & Studio</h2>
            <p style={{ fontSize: 13.5, color: 'var(--text-main)', lineHeight: 1.6, margin: 0 }}>
              {tailor.about || 'Specialized in traditional South Indian bridal wear, heavy Aari needlework, customized silk blouses, and modern ethnic party gowns. Each outfit is measured, cut, and stitched with double seam reinforcement and customizable allowances.'}
            </p>
          </div>

          {/* SERVICES OFFERED */}
          <div className="card" style={{ padding: 20 }}>
            <h2 style={{ fontSize: 16, color: 'var(--primary-dark)', marginBottom: 12 }}>Tailoring & Stitching Services</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {services.map((srv, idx) => (
                <div key={idx} style={{ padding: '10px 14px', background: 'var(--bg-page)', borderRadius: 8, border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{srv}</span>
                  <Link to={`/customer/create-order?tailorId=${tailor.id}&service=${encodeURIComponent(srv)}`}>
                    <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 700 }}>Order →</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* PORTFOLIO SHOWCASE */}
          <div className="card" style={{ padding: 20 }}>
            <div className="flex-between" style={{ marginBottom: 14 }}>
              <h2 style={{ fontSize: 16, color: 'var(--primary-dark)', margin: 0 }}>Portfolio Showcase</h2>
              <span className="muted" style={{ fontSize: 12 }}>Recent Completed Outfits</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
              {[
                { title: 'Heavy Peacock Aari Blouse', category: 'Bridal Blouse', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80' },
                { title: 'Antique Zari Maggam Blouse', category: 'Aari Work', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&auto=format&fit=crop&q=80' },
                { title: 'Flared Velvet Bridal Lehenga', category: 'Lehenga', img: 'https://images.unsplash.com/photo-1610030469668-932d59f77f52?w=500&auto=format&fit=crop&q=80' },
                { title: 'Silk Saree Cut-work Blouse', category: 'Saree Blouse', img: 'https://images.unsplash.com/photo-1583391733975-0210f9689408?w=500&auto=format&fit=crop&q=80' },
              ].map((item, idx) => (
                <div key={idx} style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border-light)', background: 'var(--bg-page)' }}>
                  <img src={item.img} alt={item.title} style={{ width: '100%', height: 130, objectFit: 'cover' }} />
                  <div style={{ padding: 10 }}>
                    <strong style={{ fontSize: 12, display: 'block' }}>{item.title}</strong>
                    <span className="muted" style={{ fontSize: 11 }}>{item.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COURSES OFFERED */}
          {courses.length > 0 && (
            <div className="card" style={{ padding: 20 }}>
              <h2 style={{ fontSize: 16, color: 'var(--primary-dark)', marginBottom: 12 }}>Courses Offered by this Tailor</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                {courses.map(c => (
                  <div key={c.id} style={{ border: '1px solid var(--border-light)', borderRadius: 8, padding: 12, background: 'var(--bg-page)' }}>
                    <strong style={{ fontSize: 13, color: 'var(--primary-dark)', display: 'block', marginBottom: 4 }}>{c.name}</strong>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Duration: {c.durationDays} Days • Fee: ₹{c.price}</div>
                    <Link to={`/student/courses/${c.id}`}>
                      <Button size="sm" variant="outline" style={{ marginTop: 8 }}>View Course</Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CLIENT REVIEWS */}
          <div className="card" style={{ padding: 20 }}>
            <div className="flex-between" style={{ marginBottom: 14 }}>
              <h2 style={{ fontSize: 16, color: 'var(--primary-dark)', margin: 0 }}>Client Ratings & Testimonials</h2>
              <span className="rating-pill">★ {avgRating} Overall</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(reviews.length === 0 ? [
                { id: 1, customer: 'Priya Sharma', rating: 5, date: '2026-08-15', comment: 'Outstanding Aari needlework! The bridal blouse fitting was flawless and delivered right on time.' },
                { id: 2, customer: 'Divya Kumar', rating: 5, date: '2026-07-22', comment: 'Gorgeous heavy embroidery. The craftsmanship made my wedding reception look extraordinary.' }
              ] : reviews).map((rev, idx) => (
                <div key={idx} style={{ padding: '12px 14px', borderRadius: 8, background: 'var(--bg-page)', border: '1px solid var(--border-light)' }}>
                  <div className="flex-between">
                    <strong style={{ fontSize: 13 }}>{rev.customer || 'Verified Customer'}</strong>
                    <span style={{ color: '#FFB300', fontSize: 13 }}>{'★'.repeat(rev.rating || 5)}</span>
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--text-main)', margin: '4px 0 2px 0' }}>"{rev.comment}"</p>
                  <span className="muted" style={{ fontSize: 11 }}>Reviewed on {rev.date || '2026-08-10'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BOUTIQUE STATS, AVAILABILITY, CONTACT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 15, color: 'var(--primary-dark)', marginBottom: 14 }}>Studio Details</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
              <div><strong>Working Hours:</strong> Mon - Sat (9:30 AM - 8:30 PM)</div>
              <div><strong>Turnaround Time:</strong> 5 - 8 Days Standard</div>
              <div><strong>Express Stitching:</strong> Available (3 - 5 Days)</div>
              <div><strong>Doorstep Delivery:</strong> Supported across Tamil Nadu</div>
              <div><strong>Fabric Sourcing:</strong> Silk & Cotton Available</div>
            </div>

            <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border-light)' }}>
              <Button variant="primary" block onClick={() => setShowApptModal(true)}>
                📅 Book Measurement Visit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* BOOK APPOINTMENT MODAL */}
      {showApptModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: 20
        }}>
          <div className="card" style={{ maxWidth: 480, width: '100%', padding: 24 }}>
            <div className="flex-between" style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, color: 'var(--primary-dark)', margin: 0 }}>Book Appointment with {tailor.name}</h2>
              <button 
                type="button" 
                onClick={() => setShowApptModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {apptSuccess && (
              <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: 10, borderRadius: 6, marginBottom: 14, fontSize: 13 }}>
                ✅ Appointment booked successfully! Redirecting to appointments...
              </div>
            )}

            <form onSubmit={handleBookAppointment}>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Select Service *</label>
                <select 
                  className="form-control"
                  value={apptService}
                  onChange={(e) => setApptService(e.target.value)}
                >
                  {services.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                  <option value="General Measurement & Fitting">General Measurement & Fitting</option>
                  <option value="Silk Fabric Swatch Selection">Silk Fabric Swatch Selection</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Date *</label>
                  <input 
                    className="form-control"
                    type="date"
                    value={apptDate}
                    onChange={(e) => setApptDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Time Slot *</label>
                  <select 
                    className="form-control"
                    value={apptTime}
                    onChange={(e) => setApptTime(e.target.value)}
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Purpose & Custom Notes</label>
                <textarea 
                  className="form-control"
                  rows={2}
                  value={apptPurpose}
                  onChange={(e) => setApptPurpose(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <Button variant="secondary" onClick={() => setShowApptModal(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Confirm Appointment</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
