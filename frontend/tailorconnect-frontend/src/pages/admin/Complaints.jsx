import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'

const statusColor = (status = '') => {
  const s = (status || '').toUpperCase()
  if (s === 'CANCELLED') return { bg: '#FEF2F2', color: '#991B1B' }
  if (s === 'REJECTED')  return { bg: '#FFF7ED', color: '#C2410C' }
  return { bg: '#F3F4F6', color: '#374151' }
}

export default function AdminComplaints() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [total, setTotal]     = useState(0)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/admin/complaints?limit=50')
        const data = res.data?.data || {}
        setItems(data.complaints || [])
        setTotal(data.total || 0)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load complaints.')
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
          <h1>⚠️ Complaints &amp; Disputes</h1>
          <p>
            Cancelled and rejected tailoring orders requiring admin review — {total} dispute{total !== 1 ? 's' : ''} total.
          </p>
        </div>
      </div>

      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '12px 16px', borderRadius: 8, marginBottom: 18 }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
          ⏳ Loading complaints from MongoDB…
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, fontWeight: 600 }}>No complaints or disputes found.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>All tailoring orders are running smoothly.</p>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--primary-light)', borderBottom: '1px solid var(--border)' }}>
                  {['Order #', 'Customer', 'Tailor', 'Design', 'Price', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '13px 16px', fontSize: 12, fontWeight: 700, color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(item => {
                  const sc = statusColor(item.orderStatus)
                  return (
                    <tr key={item._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '13px 16px', fontWeight: 700, color: 'var(--danger, #DC2626)', fontSize: 13 }}>
                        #{item.orderNumber || '—'}
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{item.customerId?.name || '—'}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{item.customerId?.email}</div>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{item.tailorId?.name || '—'}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{item.tailorId?.email}</div>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.designName || '—'}
                      </td>
                      <td style={{ padding: '13px 16px', fontWeight: 700, fontSize: 13, color: 'var(--primary)' }}>
                        ₹{(item.price || 0).toLocaleString()}
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{
                          display: 'inline-block', padding: '3px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 700,
                          background: sc.bg, color: sc.color, textTransform: 'uppercase',
                        }}>
                          {(item.orderStatus || '').replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--text-muted)' }}>
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}
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
