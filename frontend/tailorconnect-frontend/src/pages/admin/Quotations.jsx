import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'

const statusColor = (status = '') => {
  const s = (status || '').toUpperCase()
  if (s === 'REQUEST_RECEIVED') return { bg: '#FFF7ED', color: '#C2410C' }
  if (s === 'ACCEPTED')         return { bg: '#ECFDF5', color: '#065F46' }
  if (s === 'REJECTED')         return { bg: '#FEF2F2', color: '#991B1B' }
  return { bg: '#F3F4F6', color: '#374151' }
}

const STATUSES = ['ALL', 'REQUEST_RECEIVED', 'ACCEPTED', 'REJECTED']

export default function AdminQuotations() {
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
        const res = await api.get(`/admin/quotations${params}&limit=50`)
        const data = res.data?.data || {}
        setItems(data.quotations || [])
        setTotal(data.total || 0)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load quotations.')
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
          <h1>🏷️ Quotations &amp; Requests</h1>
          <p>Review tailoring service requests and their acceptance status — {total} total.</p>
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
            {s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '12px 16px', borderRadius: 8, marginBottom: 16 }}>⚠️ {error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>⏳ Loading quotations…</div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏷️</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>No quotations found for selected filter.</p>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--primary-light)', borderBottom: '1px solid var(--border)' }}>
                {['Order #', 'Customer', 'Tailor', 'Design', 'Fabric', 'Price', 'Deadline', 'Status'].map(h => (
                  <th key={h} style={{ padding: '13px 16px', fontSize: 12, fontWeight: 700, color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(q => {
                const sc = statusColor(q.orderStatus)
                return (
                  <tr key={q._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '13px 16px', fontWeight: 700, color: 'var(--primary)', fontSize: 13 }}>#{q.orderNumber || '—'}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{q.customerId?.name || '—'}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{q.customerId?.email}</div>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{q.tailorId?.name || '—'}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{q.tailorId?.email}</div>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 13, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.designName || '—'}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13 }}>{q.fabric || '—'}</td>
                    <td style={{ padding: '13px 16px', fontWeight: 700, color: 'var(--primary)', fontSize: 13 }}>₹{(q.price || 0).toLocaleString()}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13 }}>{q.deadline || '—'}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 700,
                        background: sc.bg, color: sc.color, textTransform: 'uppercase',
                      }}>
                        {(q.orderStatus || '').replace(/_/g, ' ')}
                      </span>
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
