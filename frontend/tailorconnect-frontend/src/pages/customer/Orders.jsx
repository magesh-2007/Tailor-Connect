import React, { useEffect, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

const STATUS_LABELS = {
  REQUEST_RECEIVED:  { label: 'Pending',      bg: '#FFFBEB', color: '#92400E' },
  ACCEPTED:          { label: 'Accepted',      bg: '#ECFDF5', color: '#065F46' },
  STITCHING_STARTED: { label: 'Stitching',     bg: '#EFF6FF', color: '#1E40AF' },
  IN_PROGRESS:       { label: 'In Progress',   bg: '#EFF6FF', color: '#1E40AF' },
  READY:             { label: 'Ready',          bg: '#ECFDF5', color: '#065F46' },
  OUT_FOR_DELIVERY:  { label: 'Out for Delivery', bg: '#DDEBE7', color: '#0F5C5E' },
  DELIVERED:         { label: 'Delivered',     bg: '#ECFDF5', color: '#065F46' },
  COMPLETED:         { label: 'Completed',     bg: '#ECFDF5', color: '#065F46' },
  REJECTED:          { label: 'Rejected',      bg: '#FEF2F2', color: '#991B1B' },
  CANCELLED:         { label: 'Cancelled',     bg: '#F1F5F9', color: '#475569' },
}

export default function CustomerOrders() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const highlightId = searchParams.get('highlight')
  const initialStatus = searchParams.get('status') || 'all'

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState(initialStatus)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!user) return
    setLoading(true)
    api.get('/orders/my').then(res => {
      const data = res.data?.data?.orders || res.data?.orders || []
      setOrders(data)
    }).catch(() => {
      // fallback: try without /my
      api.get('/orders').then(res => {
        const data = res.data?.data?.orders || res.data?.orders || []
        setOrders(data)
      }).catch(() => setOrders([]))
    }).finally(() => setLoading(false))
  }, [user])

  const activeOrders = orders.filter(o =>
    !['COMPLETED', 'DELIVERED', 'CANCELLED', 'REJECTED'].includes(o.orderStatus)
  )
  const completedOrders = orders.filter(o =>
    ['COMPLETED', 'DELIVERED'].includes(o.orderStatus)
  )
  const urgentOrders = orders.filter(o => o.urgent)

  const filtered = orders.filter(o => {
    const term = searchTerm.toLowerCase()
    const matchesSearch = !searchTerm ||
      (o.orderNumber || '').toLowerCase().includes(term) ||
      (o.designName || '').toLowerCase().includes(term) ||
      (o.category || '').toLowerCase().includes(term)

    let matchesStatus = true
    if (filterStatus === 'active') {
      matchesStatus = !['COMPLETED', 'DELIVERED', 'CANCELLED', 'REJECTED'].includes(o.orderStatus)
    } else if (filterStatus === 'completed') {
      matchesStatus = ['COMPLETED', 'DELIVERED'].includes(o.orderStatus)
    } else if (filterStatus === 'urgent') {
      matchesStatus = Boolean(o.urgent)
    }
    return matchesSearch && matchesStatus
  })

  const formatDate = (d) => {
    if (!d) return '—'
    try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }
    catch { return d }
  }

  return (
    <DashboardLayout role="customer">
      <div className="page-header">
        <div>
          <h1 style={{ color: '#0F5C5E' }}>My Tailoring Requests</h1>
          <p>View all tailoring requests — track progress, delivery dates, and status updates.</p>
        </div>
        <Link to="/customer/create-order">
          <button style={btnPrimary}>+ New Tailoring Request</button>
        </Link>
      </div>

      {/* Filters */}
      <div style={{
        background: '#FFFFFF', border: '1.5px solid #E3E8E6',
        borderRadius: 12, padding: '14px 18px', marginBottom: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 16, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: `All (${orders.length})` },
            { key: 'active', label: `Active (${activeOrders.length})` },
            { key: 'urgent', label: `🔥 Urgent (${urgentOrders.length})` },
            { key: 'completed', label: `Completed (${completedOrders.length})` },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilterStatus(f.key)}
              style={{
                padding: '7px 16px', borderRadius: 7, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', border: '1.5px solid',
                background: filterStatus === f.key ? '#0F5C5E' : '#FFFFFF',
                color: filterStatus === f.key ? '#FFFFFF' : '#0F5C5E',
                borderColor: filterStatus === f.key ? '#0F5C5E' : '#E3E8E6',
                transition: 'all 0.15s',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by design, order ID…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            padding: '8px 14px', border: '1.5px solid #E3E8E6',
            borderRadius: 8, fontSize: 13, outline: 'none', width: 220,
          }}
        />
      </div>

      {/* Table */}
      <div style={{ background: '#FFFFFF', border: '1.5px solid #E3E8E6', borderRadius: 14, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#9CA3AF' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #E3E8E6', borderTopColor: '#0F5C5E', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            Loading tailoring requests…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '52px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>✂️</div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0F5C5E', marginBottom: 8 }}>No tailoring requests yet</h2>
            <p style={{ color: '#667085', fontSize: 14, marginBottom: 20 }}>
              {filterStatus !== 'all'
                ? 'No requests match this filter. Try changing the filter above.'
                : 'Submit your first tailoring request to get started.'}
            </p>
            <Link to="/customer/create-order">
              <button style={btnPrimary}>+ New Tailoring Request</button>
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Design / Service</th>
                  <th>Amount</th>
                  <th>Required By</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => {
                  const id = order._id || order.id
                  const s = STATUS_LABELS[order.orderStatus] || { label: order.orderStatus || 'Unknown', bg: '#F1F5F9', color: '#475569' }
                  const isHighlighted = highlightId === id || highlightId === order.orderNumber
                  return (
                    <tr key={id} style={{ background: isHighlighted ? '#DDEBE7' : undefined, transition: 'background 0.3s' }}>
                      <td>
                        <code style={{ fontSize: 12, color: '#0F5C5E', fontWeight: 700 }}>
                          {order.orderNumber || id?.slice(-8)}
                        </code>
                        {order.urgent && (
                          <span style={{ marginLeft: 6, fontSize: 10, background: '#FEF2F2', color: '#991B1B', padding: '2px 7px', borderRadius: 999, fontWeight: 700 }}>
                            URGENT
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#1F2937' }}>{order.designName}</div>
                        <div style={{ fontSize: 11.5, color: '#9CA3AF' }}>
                          {order.category}{order.category && order.dressType ? ' • ' : ''}{order.dressType}
                        </div>
                      </td>
                      <td>
                        <strong style={{ fontSize: 14, color: '#0F5C5E' }}>₹{order.price || '—'}</strong>
                      </td>
                      <td style={{ color: '#667085', fontSize: 13 }}>
                        {formatDate(order.deadline)}
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-block', padding: '3px 10px', borderRadius: 999,
                          fontSize: 11.5, fontWeight: 700, background: s.bg, color: s.color,
                        }}>
                          {s.label}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => navigate(`/tracking/${id}`)}
                            style={{ ...btnSm, background: '#0F5C5E', color: '#FFFFFF', border: 'none' }}
                          >
                            Track
                          </button>
                          <button
                            onClick={() => navigate(`/customer/chat?orderId=${id}`)}
                            style={{ ...btnSm, background: '#FFFFFF', color: '#0F5C5E', border: '1.5px solid #E3E8E6' }}
                          >
                            Message
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

const btnPrimary = {
  background: '#0F5C5E', color: '#FFFFFF', border: 'none',
  padding: '9px 20px', borderRadius: 8, fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
}
const btnSm = {
  padding: '6px 13px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer',
}
