import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'

function StarRating({ rating }) {
  return (
    <span style={{ color: '#F59E0B', fontSize: 14, letterSpacing: 1 }}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
      <span style={{ color: '#6B7280', fontSize: 12, marginLeft: 5, fontWeight: 600 }}>{rating}/5</span>
    </span>
  )
}

export default function AdminReviews() {
  const [reviews, setReviews]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [total, setTotal]       = useState(0)
  const [ratingFilter, setFilter] = useState('')

  const load = async (rating = '') => {
    setLoading(true)
    try {
      const params = rating ? `?rating=${rating}&limit=50` : '?limit=50'
      const res = await api.get(`/admin/reviews${params}`)
      const data = res.data?.data || {}
      setReviews(data.reviews || [])
      setTotal(data.total || 0)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reviews.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(ratingFilter) }, [ratingFilter])

  return (
    <DashboardLayout role="admin">
      <div className="page-header">
        <div>
          <h1>⭐ Customer Reviews</h1>
          <p>Genuine testimonials from MongoDB — {total} review{total !== 1 ? 's' : ''} collected.</p>
        </div>
      </div>

      {/* Rating filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Filter by rating:</span>
        <button
          className={!ratingFilter ? 'btn btn-primary' : 'btn btn-outline'}
          style={{ fontSize: 12.5, padding: '5px 14px' }}
          onClick={() => setFilter('')}
        >All</button>
        {[5, 4, 3, 2, 1].map(r => (
          <button
            key={r}
            className={ratingFilter === String(r) ? 'btn btn-primary' : 'btn btn-outline'}
            style={{ fontSize: 12.5, padding: '5px 14px' }}
            onClick={() => setFilter(String(r))}
          >
            {'★'.repeat(r)} ({r})
          </button>
        ))}
      </div>

      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '12px 16px', borderRadius: 8, marginBottom: 18 }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
          ⏳ Loading reviews from MongoDB…
        </div>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⭐</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            {ratingFilter ? `No ${ratingFilter}-star reviews found.` : 'No reviews found yet.'}
          </p>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--primary-light)', borderBottom: '1px solid var(--border)' }}>
                {['Customer', 'Tailor', 'Rating', 'Comment', 'Date'].map(h => (
                  <th key={h} style={{ padding: '13px 16px', fontSize: 12, fontWeight: 700, color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {r.customerId?.profileImage && (
                        <img src={r.customerId.profileImage} alt={r.customerId?.name}
                          style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }} />
                      )}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{r.customerId?.name || r.customerName || '—'}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.customerId?.email || r.customerEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {r.tailorId?.profileImage && (
                        <img src={r.tailorId.profileImage} alt={r.tailorId?.name}
                          style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }} />
                      )}
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{r.tailorId?.name || '—'}</div>
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <StarRating rating={r.rating || 0} />
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 12.5, color: 'var(--text-main)', maxWidth: 280, lineHeight: 1.5 }}>
                    "{r.comment}"
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}
