import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

const NOTIF_ICONS = {
  quotation:    { icon: '💬', color: '#0F5C5E', bg: '#DDEBE7' },
  production:   { icon: '🧵', color: '#065F46', bg: '#ECFDF5' },
  payment:      { icon: '💳', color: '#92400E', bg: '#FFFBEB' },
  delivery:     { icon: '📦', color: '#1E40AF', bg: '#EFF6FF' },
  appointment:  { icon: '📅', color: '#5B21B6', bg: '#F5F3FF' },
  order:        { icon: '✂️', color: '#0F5C5E', bg: '#DDEBE7' },
  system:       { icon: '🔔', color: '#475569', bg: '#F1F5F9' },
  default:      { icon: '🔔', color: '#475569', bg: '#F1F5F9' },
}

function getTypeStyle(type = '') {
  const t = type.toLowerCase()
  return NOTIF_ICONS[t] || NOTIF_ICONS.default
}

function timeAgo(date) {
  if (!date) return ''
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  const hrs = Math.floor(mins / 60)
  const days = Math.floor(hrs / 24)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hrs < 24) return `${hrs}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default function CustomerNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [marking, setMarking] = useState(false)

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const res = await api.get('/notifications?limit=50')
      const data = res.data?.data?.notifications || res.data?.notifications || []
      setNotifications(data)
    } catch {
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchNotifications()
  }, [user])

  const markAllRead = async () => {
    setMarking(true)
    try {
      await api.patch('/notifications/read-all').catch(() => {})
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } finally {
      setMarking(false)
    }
  }

  const markOneRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`).catch(() => {})
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
    } catch {}
  }

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead
    return true
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <DashboardLayout role="customer">
      <div className="page-header">
        <div>
          <h1 style={{ color: '#0F5C5E' }}>Notifications</h1>
          <p>Real-time updates on tailoring requests, quotations, deliveries, and appointments.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            disabled={marking}
            style={{
              background: '#FFFFFF', color: '#0F5C5E', border: '1.5px solid #0F5C5E',
              padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', opacity: marking ? 0.6 : 1,
            }}
          >
            ✓ Mark All Read ({unreadCount})
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: `All (${notifications.length})` },
          { key: 'unread', label: `Unread (${unreadCount})` },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', border: '1.5px solid',
              background: filter === f.key ? '#0F5C5E' : '#FFFFFF',
              color: filter === f.key ? '#FFFFFF' : '#0F5C5E',
              borderColor: filter === f.key ? '#0F5C5E' : '#E3E8E6',
              transition: 'all 0.15s',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '52px', color: '#9CA3AF' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #E3E8E6', borderTopColor: '#0F5C5E', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          Loading notifications…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', background: '#FFFFFF', border: '1.5px solid #E3E8E6', borderRadius: 14 }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>🔔</div>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0F5C5E', marginBottom: 8 }}>
            {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
          </h2>
          <p style={{ color: '#667085', fontSize: 14 }}>
            {filter === 'unread'
              ? 'You\'re all caught up! Switch to "All" to see past notifications.'
              : 'Notifications about your tailoring requests and deliveries will appear here.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(n => {
            const id = n._id || n.id
            const s = getTypeStyle(n.type)
            return (
              <div
                key={id}
                onClick={() => { if (!n.isRead) markOneRead(id) }}
                style={{
                  background: !n.isRead ? '#FCFBF7' : '#FFFFFF',
                  border: `1.5px solid ${!n.isRead ? '#0F5C5E' : '#E3E8E6'}`,
                  borderLeft: `4px solid ${!n.isRead ? '#0F5C5E' : '#E3E8E6'}`,
                  borderRadius: 12, padding: '16px 18px',
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  cursor: !n.isRead ? 'pointer' : 'default',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(15,92,94,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
              >
                {/* Icon */}
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: s.bg, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 18, flexShrink: 0,
                }}>
                  {s.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: !n.isRead ? 700 : 600, color: '#1F2937' }}>
                      {n.title}
                    </span>
                    {!n.isRead && (
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#B45353', display: 'inline-block', flexShrink: 0 }} />
                    )}
                    <span style={{ fontSize: 11.5, color: '#9CA3AF', marginLeft: 'auto' }}>
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#667085', margin: 0, lineHeight: 1.5 }}>
                    {n.message}
                  </p>
                  {n.link && (
                    <Link
                      to={n.link}
                      onClick={e => e.stopPropagation()}
                      style={{ fontSize: 12.5, fontWeight: 600, color: '#0F5C5E', marginTop: 6, display: 'inline-block' }}
                    >
                      View Details →
                    </Link>
                  )}
                </div>

                {/* Read indicator */}
                {!n.isRead && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0F5C5E', flexShrink: 0, marginTop: 4 }} />
                )}
              </div>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}
