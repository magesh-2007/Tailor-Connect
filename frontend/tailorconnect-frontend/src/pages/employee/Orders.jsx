import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

export default function EmployeeOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const STATUS_OPTIONS = ['ALL', 'REQUEST_RECEIVED', 'ACCEPTED', 'IN_PROGRESS', 'STITCHING_STARTED', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']

  const statusColor = (s = '') => {
    const map = {
      DELIVERED: { bg: '#dcfce7', color: '#15803d' },
      CANCELLED: { bg: '#fee2e2', color: '#dc2626' },
      READY:     { bg: '#dbeafe', color: '#1d4ed8' },
      OUT_FOR_DELIVERY: { bg: '#ede9fe', color: '#7c3aed' },
      ACCEPTED:  { bg: '#fef9c3', color: '#a16207' },
    }
    return map[s.toUpperCase()] || { bg: '#f1f5f9', color: '#667085' }
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const params = statusFilter !== 'ALL' ? `?status=${statusFilter}` : ''
        const res = await api.get(`/employees/orders${params}`)
        setOrders(res.data?.data?.orders || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [statusFilter])

  return (
    <DashboardLayout role="employee">
      <div className="page-header">
        <div>
          <h1>Platform Orders (Read-Only)</h1>
          <p>View all tailoring orders across the platform. You have read-only access as an employee.</p>
        </div>
      </div>

      {error && (
        <div style={{ background: '#FEF2F2', color: '#dc2626', border: '1px solid #FECACA', padding: '10px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Filter */}
      <div className="card" style={{ marginBottom: 20, padding: 16 }}>
        <div className="form-group" style={{ marginBottom: 0, maxWidth: 280 }}>
          <label className="form-label">Filter by Status</label>
          <select className="form-control" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s === 'ALL' ? 'All Orders' : s.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>⏳ Loading orders…</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>No orders found.</div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Tailor</th>
                <th>Item</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const sc = statusColor(o.orderStatus || '')
                return (
                  <tr key={o._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--primary)' }}>
                      #{(o._id || '').slice(-8).toUpperCase()}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{o.customerId?.name || o.customerName || '—'}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{o.customerId?.email || ''}</div>
                    </td>
                    <td>{o.tailorId?.name || '—'}</td>
                    <td>{o.designName || o.item || '—'}</td>
                    <td>
                      <span style={{ ...sc, padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                        {(o.orderStatus || '').replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}
