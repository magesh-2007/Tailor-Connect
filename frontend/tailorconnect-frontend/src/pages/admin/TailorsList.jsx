import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'

const verificationBadge = (status = '') => {
  const s = (status || '').toUpperCase()
  if (s === 'VERIFIED')  return { bg: '#DCFCE7', color: '#166534', label: '✓ Verified' }
  if (s === 'REJECTED')  return { bg: '#FEE2E2', color: '#991B1B', label: '✗ Rejected' }
  return { bg: '#FEF3C7', color: '#92400E', label: '⏳ Pending' }
}

export default function AdminTailorsList() {
  const [tailors, setTailors]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const [search, setSearch]           = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [total, setTotal]             = useState(0)

  const fetchTailors = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (search) params.set('q', search)
      const res = await api.get(`/admin/tailors?${params.toString()}`)
      const data = res.data?.data || {}
      setTailors(data.tailors || [])
      setTotal((data.tailors || []).length)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tailors.')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { fetchTailors() }, [fetchTailors])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput.trim())
  }

  return (
    <DashboardLayout role="admin">
      <div className="page-header">
        <div>
          <h1>🧵 Registered Tailors</h1>
          <p>
            Directory of all tailor accounts, boutiques, verification status, and specializations.
            {total > 0 && ` ${total} tailor${total !== 1 ? 's' : ''} found.`}
          </p>
        </div>
        <div className="page-actions">
          <Link to="/admin/tailor-verification">
            <button className="btn btn-primary" style={{ fontSize: 13 }}>✅ Verification Queue</button>
          </Link>
        </div>
      </div>

      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '12px 16px', borderRadius: 8, marginBottom: 18 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Search */}
      <form onSubmit={handleSearch} style={{ marginBottom: 20 }}>
        <div className="card" style={{ padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            className="form-control"
            placeholder="Search by tailor name, shop name, email, or location…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" style={{ flexShrink: 0, fontSize: 13 }}>Search</button>
          {search && (
            <button type="button" className="btn btn-outline" onClick={() => { setSearch(''); setSearchInput('') }} style={{ flexShrink: 0, fontSize: 13 }}>
              Clear
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
          <p>Loading tailors from MongoDB…</p>
        </div>
      ) : tailors.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>🧵</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, fontWeight: 600 }}>
            {search ? 'No tailors matched your search.' : 'No tailors registered yet.'}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            {search ? 'Try different search terms.' : 'Tailors will appear here once they register.'}
          </p>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--primary-light)', borderBottom: '1px solid var(--border)' }}>
                  {['Tailor / Boutique', 'Contact', 'Location', 'Specialization', 'Experience', 'Rating', 'Verification', 'Status'].map(h => (
                    <th key={h} style={{ padding: '13px 16px', fontSize: 12, fontWeight: 700, color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tailors.map(t => {
                  const vb = verificationBadge(t.verificationStatus)
                  return (
                    <tr key={t._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img
                            src={t.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                            alt={t.name}
                            style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)', flexShrink: 0 }}
                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13 }}>{t.shopName || t.name}</div>
                            <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{t.name}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ fontSize: 12.5 }}>{t.email}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{t.phone || '—'}</div>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13 }}>{t.location || '—'}</td>
                      <td style={{ padding: '13px 16px', fontSize: 12.5 }}>
                        <span style={{ background: 'var(--bg-subtle)', padding: '3px 8px', borderRadius: 6, border: '1px solid var(--border-light)' }}>
                          {t.specialist || '—'}
                        </span>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13 }}>{t.experience || '—'}</td>
                      <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 700, color: '#F59E0B' }}>
                        ★ {t.rating || '—'}
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 700, background: vb.bg, color: vb.color }}>
                          {vb.label}
                        </span>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{
                          display: 'inline-block', padding: '3px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 700,
                          background: t.isActive ? '#DCFCE7' : '#FEE2E2',
                          color: t.isActive ? '#166534' : '#991B1B'
                        }}>
                          {t.isActive ? 'Active' : 'Inactive'}
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

