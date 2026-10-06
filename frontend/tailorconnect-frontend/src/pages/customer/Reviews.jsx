import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import * as storage from '../../services/storageService'
import Button from '../../components/Button'

export default function CustomerReviews() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [tailors, setTailors] = useState([])
  const [form, setForm] = useState({
    tailor: 'Lakshmi Devi (Lakshmi Stitches & Bridal Studio)',
    orderId: 'ORD-101',
    dressItem: 'Silk Bridal Blouse with Aari Work',
    rating: 5,
    comment: ''
  })
  const [successMsg, setSuccessMsg] = useState('')

  const loadData = () => {
    const tList = storage.getTailors ? storage.getTailors() : []
    setTailors(tList)

    const raw = localStorage.getItem('tc_customer_reviews')
    if (raw) {
      setReviews(JSON.parse(raw))
    } else {
      const defaultReviews = [
        {
          id: 'REV-1',
          customer: user?.name || 'Priya Sharma',
          tailor: 'Lakshmi Devi (Lakshmi Stitches)',
          dressItem: 'Silk Bridal Blouse with Aari Work',
          rating: 5,
          date: '2026-08-25',
          verified: true,
          comment: 'Exceptional craftsmanship! The Aari peacock embroidery on the back and the potli button finish were flawless. Perfect fitting on the first trial with zero armhole tightness.',
          tailorReply: 'Thank you Priya! It was an absolute delight crafting your wedding bridal blouse.'
        },
        {
          id: 'REV-2',
          customer: user?.name || 'Priya Sharma',
          tailor: 'Mrs. Radha Raman (Vintage Needle)',
          dressItem: 'Flared Silk Party Lehenga Set',
          rating: 5,
          date: '2026-07-20',
          verified: true,
          comment: 'Heirloom quality stitching. The double can-can lining gave the lehenga the exact dramatic flare I needed for the reception.',
          tailorReply: 'Glad you loved the flare and antique gold border detailing!'
        }
      ]
      localStorage.setItem('tc_customer_reviews', JSON.stringify(defaultReviews))
      setReviews(defaultReviews)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [user])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.comment.trim()) return

    const newRev = {
      id: `REV-${Date.now().toString().slice(-4)}`,
      customer: user?.name || 'Priya Sharma',
      tailor: form.tailor,
      dressItem: form.dressItem,
      rating: form.rating,
      date: new Date().toISOString().split('T')[0],
      verified: true,
      comment: form.comment
    }

    const updated = [newRev, ...reviews]
    setReviews(updated)
    localStorage.setItem('tc_customer_reviews', JSON.stringify(updated))
    setForm({
      tailor: 'Lakshmi Devi (Lakshmi Stitches)',
      orderId: 'ORD-101',
      dressItem: 'Silk Bridal Blouse with Aari Work',
      rating: 5,
      comment: ''
    })
    setSuccessMsg('Review submitted successfully! Thank you for sharing feedback.')
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  return (
    <DashboardLayout role="customer">
      <div className="page-header">
        <div>
          <h1>Tailor Reviews & Stitching Ratings</h1>
          <p>Rate completed custom garments, share feedback on fitting accuracy, and help fellow clients find top artisans.</p>
        </div>
      </div>

      {successMsg && (
        <div style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success-border)', padding: '10px 16px', borderRadius: 6, marginBottom: 20 }}>
          ✅ {successMsg}
        </div>
      )}

      {/* WRITE A REVIEW CARD */}
      <div className="card" style={{ marginBottom: 24, padding: 24 }}>
        <h3 style={{ fontSize: 16, margin: '0 0 16px 0', color: 'var(--text-main)' }}>
          ✍️ Write a Review for Completed Order
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Select Tailor Studio</label>
              <select
                className="form-control"
                value={form.tailor}
                onChange={(e) => setForm({ ...form, tailor: e.target.value })}
              >
                {tailors.length > 0 ? (
                  tailors.map(t => (
                    <option key={t.id || t.name} value={`${t.name} (${t.shopName})`}>
                      {t.name} ({t.shopName})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Lakshmi Devi (Lakshmi Stitches & Bridal Studio)">Lakshmi Devi (Lakshmi Stitches & Bridal Studio)</option>
                    <option value="Mrs. Radha Raman (Vintage Needle Heritage Tailors)">Mrs. Radha Raman (Vintage Needle Heritage Tailors)</option>
                    <option value="Suresh Kumar (Royal Threads & Embroidery Studio)">Suresh Kumar (Royal Threads & Embroidery Studio)</option>
                    <option value="Grace Mary (Grace Bridal Couture Hub)">Grace Mary (Grace Bridal Couture Hub)</option>
                  </>
                )}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Dress Specification / Order</label>
              <input
                type="text"
                className="form-control"
                value={form.dressItem}
                onChange={(e) => setForm({ ...form, dressItem: e.target.value })}
                placeholder="e.g. Silk Bridal Blouse with Aari Work"
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label">Your Rating</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setForm({ ...form, rating: star })}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 24,
                    color: star <= form.rating ? '#FFB800' : 'var(--border)',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  ★
                </button>
              ))}
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginLeft: 8, alignSelf: 'center' }}>
                {form.rating} out of 5 Stars
              </span>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label">Your Detailed Review & Fitting Experience</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Describe the fabric quality, stitching precision, margin allowance, and whether delivery was on time..."
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              required
            />
          </div>

          <Button type="submit" variant="primary">
            Submit Verified Review
          </Button>
        </form>
      </div>

      {/* RECENT REVIEWS LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {reviews.map((r) => (
          <div key={r.id} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h4 style={{ margin: 0, fontSize: 16, color: 'var(--text-main)' }}>{r.tailor}</h4>
                  {r.verified && (
                    <span className="status-badge" style={{ background: 'var(--success-bg)', color: 'var(--success)', fontSize: 10 }}>
                      ✓ Verified Customer Order
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                  Dress: <strong>{r.dressItem}</strong> • Reviewed on {r.date}
                </div>
              </div>

              <div style={{ color: '#FFB800', fontSize: 16, letterSpacing: 2 }}>
                {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
              </div>
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-main)', lineHeight: 1.5, margin: '8px 0 0 0' }}>
              "{r.comment}"
            </p>

            {r.tailorReply && (
              <div style={{ background: 'var(--bg-subtle)', padding: 12, borderRadius: 6, borderLeft: '3px solid var(--primary)', marginTop: 12, fontSize: 12.5 }}>
                <strong>Studio Response:</strong> "{r.tailorReply}"
              </div>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
