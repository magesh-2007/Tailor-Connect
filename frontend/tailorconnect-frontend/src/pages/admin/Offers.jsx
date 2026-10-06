import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'

const statusColor = (status = '') => {
  const s = (status || '').toUpperCase()
  if (s === 'ACTIVE')     return { bg: '#ECFDF5', color: '#065F46' }
  if (s === 'FULL')       return { bg: '#EEF2FF', color: '#3730A3' }
  if (s === 'COMPLETED')  return { bg: '#F0FDF4', color: '#16A34A' }
  if (s === 'CLOSED')     return { bg: '#FEF2F2', color: '#991B1B' }
  return { bg: '#F3F4F6', color: '#374151' }
}

const STATUSES = ['ALL', 'ACTIVE', 'FULL', 'COMPLETED', 'CLOSED']

export default function AdminOffers() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [total, setTotal]     = useState(0)
  const [filter, setFilter]   = useState('ALL')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const params = filter !== 'ALL' ? `?status=${filter}` : ''
        const res = await api.get(`/admin/offers${params}`)
        const data = res.data?.data || {}
        setItems(data.offers || [])
        setTotal(data.total || 0)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load offers.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [filter])

  return (
    <DashboardLayout role="admin">
      <div className="page-header">
        <div>
          <h1>🎁 Offers &amp; Promotions</h1>
          <p>Monitor all tailor offers and promotional workshops — {total} total.</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {STATUSES.map(s => (
          <button
            key={s}
            className={filter === s ? 'btn btn-primary' : 'btn btn-outline'}
            style={{ fontSize: 12.5, padding: '6px 14px' }}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '12px 16px', borderRadius: 8, marginBottom: 16 }}>⚠️ {error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>⏳ Loading offers…</div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎁</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>No offers found for selected filter.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
          {items.map(offer => {
            const sc = statusColor(offer.status)
            const spotsLeft = (offer.maxRegistrations || 0) - (offer.currentRegistrations || 0)
            const fillPct = offer.maxRegistrations > 0
              ? Math.min(100, Math.round((offer.currentRegistrations / offer.maxRegistrations) * 100))
              : 0
            return (
              <div key={offer._id} className="card" style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
                {/* Status badge */}
                <span style={{
                  position: 'absolute', top: 14, right: 14,
                  padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                  background: sc.bg, color: sc.color, textTransform: 'uppercase',
                }}>
                  {offer.status}
                </span>

                {/* Tailor info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  {offer.tailorId?.profileImage && (
                    <img src={offer.tailorId.profileImage} alt={offer.tailorId.name}
                      style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }} />
                  )}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 12.5 }}>{offer.tailorId?.name || '—'}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{offer.tailorId?.email}</div>
                  </div>
                </div>

                <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, paddingRight: 70 }}>{offer.title}</h3>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: 1.5 }}>
                  {offer.category} · {offer.mode} · {offer.duration}
                </p>

                {/* Price */}
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)', marginBottom: 10 }}>
                  ₹{(offer.price || 0).toLocaleString()}
                </div>

                {/* Dates */}
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
                  📅 {offer.startDate} → {offer.endDate}
                </div>

                {/* Registration fill */}
                <div style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--text-secondary)', marginBottom: 4 }}>
                    <span>Registrations: {offer.currentRegistrations}/{offer.maxRegistrations}</span>
                    <span>{spotsLeft} spots left</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-subtle)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${fillPct}%`, background: fillPct >= 90 ? '#DC2626' : 'var(--primary)', borderRadius: 999, transition: 'width 0.4s ease' }} />
                  </div>
                </div>

                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                  Target: {offer.targetAudience} · {offer.location}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}
