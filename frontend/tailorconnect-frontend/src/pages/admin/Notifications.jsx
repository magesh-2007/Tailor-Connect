import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'

const TYPE_ICONS = {
  NEW_USER:  '👤',
  NEW_ORDER: '📦',
  PAYMENT:   '💳',
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/admin/notifications?limit=30')
        const data = res.data?.data || {}
        setNotifications(data.notifications || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load notifications.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const fmt = (ts) => {
    if (!ts) return '—'
    const d = new Date(ts)
    return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
  }

  return (
    <DashboardLayout role="admin">
      <div className="page-header">
        <div>
          <h1>🔔 Platform Notifications</h1>
          <p>Recent activity feed — new users, orders, and payments from MongoDB.</p>
        </div>
      </div>

      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '12px 16px', borderRadius: 8, marginBottom: 18 }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
          ⏳ Loading notifications…
        </div>
      ) : notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔔</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>No platform activity found yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {notifications.map((n, idx) => (
            <div
              key={`${n.id}-${idx}`}
              className="card"
              style={{
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                borderLeft: '4px solid var(--primary)',
              }}
            >
              {/* Icon */}
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'var(--primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}>
                {n.icon || TYPE_ICONS[n.type] || '📋'}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-main)' }}>
                  {n.message}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
                  🕒 {fmt(n.time)}
                </div>
              </div>

              {/* Type badge */}
              <span style={{
                padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                background: n.type === 'PAYMENT' ? '#ECFDF5'
                  : n.type === 'NEW_USER' ? '#EEF2FF' : '#FFF7ED',
                color: n.type === 'PAYMENT' ? '#065F46'
                  : n.type === 'NEW_USER' ? '#3730A3' : '#C2410C',
                textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0,
              }}>
                {(n.type || 'EVENT').replace(/_/g, ' ')}
              </span>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
