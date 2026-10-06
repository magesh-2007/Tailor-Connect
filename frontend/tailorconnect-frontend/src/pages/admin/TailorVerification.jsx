import React, { useEffect, useState, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'

const statusStyle = (status = '') => {
  const s = (status || '').toUpperCase()
  if (s === 'VERIFIED')   return { bg: '#dcfce7', color: '#15803d' }
  if (s === 'REJECTED')   return { bg: '#fee2e2', color: '#dc2626' }
  if (s === 'PENDING')    return { bg: '#fef9c3', color: '#a16207' }
  return { bg: '#f1f5f9', color: '#667085' }
}

export default function TailorVerification() {
  const [tailors, setTailors]             = useState([])
  const [loading, setLoading]             = useState(true)
  const [selectedTailor, setSelectedTailor] = useState(null)
  const [reviewModal, setReviewModal]     = useState(false)
  const [updating, setUpdating]           = useState(false)
  const [error, setError]                 = useState('')
  const [success, setSuccess]             = useState('')
  const [search, setSearch]               = useState('')
  const [searchInput, setSearchInput]     = useState('')

  const fetchTailors = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = search ? `?q=${encodeURIComponent(search)}` : ''
      const res = await api.get(`/admin/tailors${params}`)
      setTailors(res.data?.data?.tailors || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tailors.')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { fetchTailors() }, [fetchTailors])

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400)
    return () => clearTimeout(t)
  }, [searchInput])

  const handleVerify = async (tailor, verifyStatus) => {
    setUpdating(true)
    setError('')
    try {
      // Use tailor user _id so the backend looks up TailorProfile by userId
      const id = tailor._id || tailor.id
      const res = await api.patch(`/admin/tailors/${id}/verify`, {
        verified: verifyStatus === 'VERIFIED',
        status: verifyStatus
      })

      const updatedProfile = res.data?.data?.profile
      const newStatus = updatedProfile?.verificationStatus || verifyStatus

      setTailors(prev => prev.map(t =>
        (t._id || t.id) === id
          ? { ...t, verificationStatus: newStatus, verified: newStatus === 'VERIFIED', tailorProfile: { ...t.tailorProfile, verificationStatus: newStatus } }
          : t
      ))

      if (selectedTailor && (selectedTailor._id || selectedTailor.id) === id) {
        setSelectedTailor(prev => ({ ...prev, verificationStatus: newStatus, verified: newStatus === 'VERIFIED' }))
      }

      const action = verifyStatus === 'VERIFIED' ? 'Approved & Verified' : 'Rejected'
      setSuccess(`"${tailor.name}" has been ${action} in MongoDB.`)
      setReviewModal(false)
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setError(err.response?.data?.message || 'Verification update failed.')
    } finally {
      setUpdating(false)
    }
  }

  const portfolioPhotos = [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&auto=format&fit=crop&q=80'
  ]

  return (
    <DashboardLayout role="admin">
      <div className="page-header">
        <div>
          <h1>Tailor Accreditation &amp; Verification Queue</h1>
          <p>Verify or reject tailor registrations. All changes persist to MongoDB in real time.</p>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fee', color: 'var(--danger)', border: '1px solid #fca', padding: '10px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div style={{ background: '#f0fdf4', color: 'var(--success)', border: '1px solid #bbf7d0', padding: '10px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
          ✅ {success}
        </div>
      )}

      {/* Search */}
      <div className="card" style={{ marginBottom: 20, padding: 16 }}>
        <div className="form-group" style={{ marginBottom: 0, maxWidth: 380 }}>
          <label>Search Tailors</label>
          <input
            className="form-control"
            placeholder="Search by name, email, or location…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      {/* Stats row */}
      {!loading && (
        <div style={{ display: 'flex', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'Total Tailors', count: tailors.length, color: 'var(--primary)' },
            { label: 'Verified',      count: tailors.filter(t => (t.verificationStatus || '').toUpperCase() === 'VERIFIED').length,  color: '#15803d' },
            { label: 'Pending',       count: tailors.filter(t => (t.verificationStatus || '').toUpperCase() === 'PENDING').length,   color: '#a16207' },
            { label: 'Rejected',      count: tailors.filter(t => (t.verificationStatus || '').toUpperCase() === 'REJECTED').length,  color: '#dc2626' }
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ flex: '1 1 140px', padding: '12px 16px' }}>
              <h3 style={{ margin: 0, fontSize: 12 }}>{s.label}</h3>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.count}</div>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          ⏳ Loading tailors from MongoDB…
        </div>
      ) : tailors.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          No tailors found.
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Tailor / Studio</th>
                  <th>Experience</th>
                  <th>Specialization</th>
                  <th>Location</th>
                  <th>Contact</th>
                  <th>Verification</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tailors.map(t => {
                  const vstyle = statusStyle(t.verificationStatus)
                  return (
                    <tr key={t._id || t.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img
                            src={t.profileImage || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'}
                            alt={t.name}
                            style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover', border: '1px solid var(--border)' }}
                          />
                          <div>
                            <strong>{t.name}</strong>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t.shopName || '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td><strong>{t.experience || '—'}</strong></td>
                      <td style={{ fontSize: 13 }}>{t.specialist || '—'}</td>
                      <td>{t.location || '—'}</td>
                      <td>
                        <div style={{ fontSize: 12 }}>📞 {t.phone || '—'}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.email}</div>
                      </td>
                      <td>
                        <span style={{ background: vstyle.bg, color: vstyle.color, padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                          {(t.verificationStatus || 'PENDING').toUpperCase()}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: 12 }}
                          onClick={() => { setSelectedTailor(t); setReviewModal(true) }}
                        >
                          Inspect &amp; Verify
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && selectedTailor && (
        <div className="modal-overlay" onClick={() => setReviewModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <h2>Accreditation Review: {selectedTailor.name}</h2>
              <button className="modal-close-btn" onClick={() => setReviewModal(false)}>✕</button>
            </div>

            {/* Tailor summary */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'center', background: 'var(--bg-page)', padding: 14, borderRadius: 8, border: '1px solid var(--border)' }}>
              <img
                src={selectedTailor.profileImage || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'}
                alt={selectedTailor.name}
                style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover' }}
              />
              <div>
                <h3 style={{ fontSize: 16, margin: '0 0 4px 0' }}>{selectedTailor.name}</h3>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{selectedTailor.shopName || '—'}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {selectedTailor.location} · {selectedTailor.experience || '—'} experience
                </div>
                <div style={{ marginTop: 6 }}>
                  <span style={{ ...statusStyle(selectedTailor.verificationStatus), padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                    Current: {(selectedTailor.verificationStatus || 'PENDING').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <h4 style={{ fontSize: 14, marginBottom: 6 }}>Specialization &amp; Bio:</h4>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', background: 'var(--bg-subtle)', padding: 10, borderRadius: 6, border: '1px solid var(--border-light)', margin: '0 0 16px 0' }}>
              {selectedTailor.about || selectedTailor.specialist || 'No bio provided.'}
            </p>

            <h4 style={{ fontSize: 14, marginBottom: 8 }}>Contact Details:</h4>
            <div style={{ fontSize: 13, marginBottom: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>📞 {selectedTailor.phone || '—'}</div>
              <div>📧 {selectedTailor.email}</div>
              <div>📍 {selectedTailor.location || '—'}</div>
              <div>⭐ Rating: {selectedTailor.rating || '—'}</div>
            </div>

            <h4 style={{ fontSize: 14, marginBottom: 8 }}>Portfolio Samples:</h4>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              {portfolioPhotos.map((url, i) => (
                <img key={i} src={url} alt="Portfolio" style={{ width: '32%', height: 75, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border)' }} />
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
              <button
                className="btn btn-danger"
                disabled={updating}
                onClick={() => handleVerify(selectedTailor, 'REJECTED')}
              >
                {updating ? '…' : '✕ Reject Application'}
              </button>
              <button
                className="btn btn-primary"
                disabled={updating}
                onClick={() => handleVerify(selectedTailor, 'VERIFIED')}
              >
                {updating ? '…' : '✓ Approve & Grant Verified Badge'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
