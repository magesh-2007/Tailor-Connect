import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'

const statusColor = (status = '') => {
  const s = (status || '').toUpperCase()
  if (s === 'REQUEST_RECEIVED') return { bg: '#FFF7ED', color: '#C2410C' }
  if (s === 'ACCEPTED')         return { bg: '#ECFDF5', color: '#065F46' }
  if (s === 'DELIVERED' || s === 'COMPLETED') return { bg: '#F0FDF4', color: '#16A34A' }
  if (s === 'REJECTED' || s === 'CANCELLED') return { bg: '#FEF2F2', color: '#991B1B' }
  return { bg: '#F3F4F6', color: '#374151' }
}

export default function AdminAppointments() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [total, setTotal]     = useState(0)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/admin/appointments?limit=50')
        const data = res.data?.data || {}
        setItems(data.appointments || [])
        setTotal(data.total || 0)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load appointments.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <DashboardLayout role="admin">
      <div className="page-header">
        <div>
          <h1>📅 Appointments &amp; Bookings</h1>
          <p>Platform-wide tailoring orders and appointment schedule — live from MongoDB ({total} records).</p>
        </div>
      </div>

      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '12px 16px', borderRadius: 8, marginBottom: 18 }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
          ⏳ Loading appointments from MongoDB…
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>No appointments found in the database.</p>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--primary-light)', borderBottom: '1px solid var(--border)' }}>
                  {['Order #', 'Customer', 'Tailor', 'Design', 'Price', 'Deadline', 'Status'].map(h => (
                    <th key={h} style={{ padding: '13px 16px', fontSize: 12.5, fontWeight: 700, color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(appt => {
                  const sc = statusColor(appt.orderStatus)
                  return (
                    <tr key={appt._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '13px 16px', fontWeight: 700, color: 'var(--primary)', fontSize: 13 }}>
                        #{appt.orderNumber || '—'}
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13 }}>
                        <div style={{ fontWeight: 600 }}>{appt.customerId?.name || '—'}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{appt.customerId?.email}</div>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13 }}>
                        <div style={{ fontWeight: 600 }}>{appt.tailorId?.name || '—'}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{appt.tailorId?.email}</div>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {appt.designName || '—'}
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>
                        ₹{(appt.price || 0).toLocaleString()}
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13 }}>{appt.deadline || '—'}</td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{
                          display: 'inline-block', padding: '3px 10px',
                          borderRadius: 999, fontSize: 11.5, fontWeight: 700,
                          background: sc.bg, color: sc.color,
                          textTransform: 'uppercase', letterSpacing: '0.03em',
                        }}>
                          {(appt.orderStatus || 'UNKNOWN').replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
