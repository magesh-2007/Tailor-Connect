import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Button from '../../components/Button'

export default function TailorReviews() {
  const [reviews, setReviews] = useState([])
  const [replyingId, setReplyingId] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [notification, setNotification] = useState('')

  const loadData = () => {
    const raw = localStorage.getItem('tc_tailor_reviews_list')
    if (raw) {
      setReviews(JSON.parse(raw))
    } else {
      const defaultReviews = [
        {
          id: 'REV-101',
          customer: 'Priya Sharma',
          dressItem: 'Silk Bridal Blouse (Aari Needlework)',
          orderId: 'ORD-101',
          rating: 5,
          date: '2026-08-25',
          verified: true,
          comment: 'Exceptional craftsmanship! The Aari peacock embroidery on the back and the potli button finish were flawless. Perfect fitting on the first trial with zero armhole tightness.',
          reply: 'Thank you Priya! It was an absolute delight crafting your wedding bridal blouse.'
        },
        {
          id: 'REV-102',
          customer: 'Divya Kumar',
          dressItem: 'Heavy Zardosi Neck Blouse',
          orderId: 'ORD-108',
          rating: 5,
          date: '2026-08-18',
          verified: true,
          comment: 'Lakshmi Devi delivered 2 days ahead of the promised date for my sister’s engagement. The double piping margin was exactly as requested.',
          reply: 'Always happy to support urgent wedding dates with dedicated artisan priority!'
        },
        {
          id: 'REV-103',
          customer: 'Ananya Ramesh',
          dressItem: 'Princess Cut Designer Blouse',
          orderId: 'ORD-096',
          rating: 4,
          date: '2026-08-05',
          verified: true,
          comment: 'Very neat stitching and clean steam press. Side seam margin was generous for future adjustments.',
          reply: ''
        }
      ]
      localStorage.setItem('tc_tailor_reviews_list', JSON.stringify(defaultReviews))
      setReviews(defaultReviews)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSendReply = (reviewId) => {
    if (!replyText.trim()) return

    const updated = reviews.map(r => r.id === reviewId ? { ...r, reply: replyText } : r)
    setReviews(updated)
    localStorage.setItem('tc_tailor_reviews_list', JSON.stringify(updated))
    setReplyingId(null)
    setReplyText('')
    setNotification('Your reply has been posted to the client review.')
    setTimeout(() => setNotification(''), 3000)
  }

  return (
    <DashboardLayout role="tailor">
      <div className="page-header">
        <div>
          <h1>Client Reviews & Reputation Score</h1>
          <p>Verified customer ratings on fitting accuracy, delivery punctuality, and embellishment quality.</p>
        </div>
      </div>

      {notification && (
        <div style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success-border)', padding: '10px 16px', borderRadius: 6, marginBottom: 20 }}>
          ✅ {notification}
        </div>
      )}

      {/* REPUTATION SUMMARY CARDS */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <h3>Overall Studio Rating</h3>
          <div className="stat-value" style={{ color: 'var(--primary)' }}>
            ★ 4.9 <span style={{ fontSize: 16, color: 'var(--text-secondary)' }}>/ 5.0</span>
          </div>
          <span className="stat-subtitle">Based on 148 verified client ratings</span>
        </div>

        <div className="stat-card">
          <h3>Fitting Accuracy</h3>
          <div className="stat-value" style={{ color: 'var(--success)' }}>
            98.5%
          </div>
          <span className="stat-subtitle">Zero alteration requests on delivery</span>
        </div>

        <div className="stat-card">
          <h3>On-Time Delivery Rate</h3>
          <div className="stat-value" style={{ color: 'var(--primary-dark)' }}>
            99.1%
          </div>
          <span className="stat-subtitle">Meeting target wedding dates</span>
        </div>

        <div className="stat-card">
          <h3>Verified Client Reviews</h3>
          <div className="stat-value" style={{ color: 'var(--text-main)' }}>
            {reviews.length}
          </div>
          <span className="stat-subtitle">Direct customer testimonials</span>
        </div>
      </div>

      {/* REVIEWS FEED */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {reviews.map((r) => (
          <div key={r.id} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h4 style={{ margin: 0, fontSize: 16, color: 'var(--text-main)' }}>{r.customer}</h4>
                  <span className="status-badge" style={{ background: 'var(--success-bg)', color: 'var(--success)', fontSize: 10 }}>
                    ✓ Order #{r.orderId}
                  </span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                  Garment: <strong>{r.dressItem}</strong> • {r.date}
                </div>
              </div>

              <div style={{ color: '#FFB800', fontSize: 16, letterSpacing: 2 }}>
                {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
              </div>
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-main)', lineHeight: 1.5, margin: '8px 0 12px 0' }}>
              "{r.comment}"
            </p>

            {/* STUDIO RESPONSE OR REPLY FORM */}
            {r.reply ? (
              <div style={{ background: 'var(--bg-subtle)', padding: 12, borderRadius: 6, borderLeft: '3px solid var(--primary)', fontSize: 12.5 }}>
                <strong style={{ color: 'var(--primary-dark)' }}>Your Studio Reply:</strong> "{r.reply}"
              </div>
            ) : replyingId === r.id ? (
              <div style={{ background: 'var(--bg-subtle)', padding: 12, borderRadius: 6, marginTop: 8 }}>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Write a professional thank you or fitting follow-up note..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  style={{ marginBottom: 8, fontSize: 13 }}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button size="sm" variant="primary" onClick={() => handleSendReply(r.id)}>
                    Post Reply
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setReplyingId(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: 11, padding: '4px 10px' }}
                  onClick={() => {
                    setReplyingId(r.id)
                    setReplyText('')
                  }}
                >
                  💬 Reply to Review
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
