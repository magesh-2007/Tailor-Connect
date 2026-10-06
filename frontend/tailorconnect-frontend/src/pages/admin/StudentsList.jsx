import React, { useEffect, useState, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'

export default function AdminStudentsList() {
  const [students, setStudents]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const [search, setSearch]           = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [total, setTotal]             = useState(0)

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (search) params.set('q', search)
      const res = await api.get(`/admin/students?${params.toString()}`)
      const data = res.data?.data || {}
      setStudents(data.students || [])
      setTotal((data.students || []).length)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load students.')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { fetchStudents() }, [fetchStudents])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput.trim())
  }

  return (
    <DashboardLayout role="admin">
      <div className="page-header">
        <div>
          <h1>🎓 Student & Learner Directory</h1>
          <p>
            All registered students on the TailorConnect learning platform.
            {total > 0 && ` ${total} student${total !== 1 ? 's' : ''} found.`}
          </p>
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
            placeholder="Search by student name, email, or location…"
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
          <p>Loading students from MongoDB…</p>
        </div>
      ) : students.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>🎓</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, fontWeight: 600 }}>
            {search ? 'No students matched your search.' : 'No students registered yet.'}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            {search ? 'Try different search terms.' : 'Students will appear here once they register.'}
          </p>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--primary-light)', borderBottom: '1px solid var(--border)' }}>
                  {['Student', 'Email', 'Phone', 'Location', 'Joined', 'Status'].map(h => (
                    <th key={h} style={{ padding: '13px 16px', fontSize: 12, fontWeight: 700, color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img
                          src={s.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={s.name}
                          style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)', flexShrink: 0 }}
                          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' }}
                        />
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                      </div>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 12.5, color: 'var(--text-secondary)' }}>{s.email}</td>
                    <td style={{ padding: '13px 16px', fontSize: 12.5, color: 'var(--text-secondary)' }}>{s.phone || '—'}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13 }}>{s.location || '—'}</td>
                    <td style={{ padding: '13px 16px', fontSize: 12.5, color: 'var(--text-muted)' }}>
                      {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 700,
                        background: s.isActive ? '#DCFCE7' : '#FEE2E2',
                        color: s.isActive ? '#166534' : '#991B1B'
                      }}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}


