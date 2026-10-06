import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'

const EMPTY_FORM = { name: '', email: '', password: '', phone: '', location: 'Chennai', department: 'Operations' }

export default function AdminEmployees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')
  const [total, setTotal]         = useState(0)

  // Create employee modal
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState(EMPTY_FORM)
  const [saving, setSaving]       = useState(false)
  const [formError, setFormError] = useState('')
  const [showPwd, setShowPwd]     = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/employees?limit=100')
      const data = res.data?.data || {}
      setEmployees(data.employees || [])
      setTotal(data.total || data.employees?.length || 0)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load employees.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!form.name || !form.email || !form.password) {
      setFormError('Name, email, and password are required.')
      return
    }
    setSaving(true)
    try {
      await api.post('/admin/employees', form)
      setSuccess('Employee account created successfully.')
      setShowModal(false)
      setForm(EMPTY_FORM)
      load()
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create employee.')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (id, currentActive) => {
    try {
      await api.patch(`/admin/users/${id}/status`)
      setEmployees(prev => prev.map(e => e._id === id ? { ...e, isActive: !currentActive } : e))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.')
    }
  }

  return (
    <DashboardLayout role="admin">
      <div className="page-header">
        <div>
          <h1>🏢 Employees</h1>
          <p>Manage platform staff accounts — {total} employee{total !== 1 ? 's' : ''} registered.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Create Employee
          </button>
        </div>
      </div>

      {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '12px 16px', borderRadius: 8, marginBottom: 16 }}>⚠️ {error}</div>}
      {success && <div style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', color: '#065F46', padding: '12px 16px', borderRadius: 8, marginBottom: 16 }}>✅ {success}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>⏳ Loading employees…</div>
      ) : employees.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏢</div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>No employees found.</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Create First Employee</button>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--primary-light)', borderBottom: '1px solid var(--border)' }}>
                {['Name', 'Email', 'Phone', 'Location', 'Username', 'Status', 'Joined', 'Action'].map(h => (
                  <th key={h} style={{ padding: '13px 16px', fontSize: 12, fontWeight: 700, color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={emp.profileImage} alt={emp.name} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }} />
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{emp.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 12.5, color: 'var(--text-secondary)' }}>{emp.email}</td>
                  <td style={{ padding: '13px 16px', fontSize: 13 }}>{emp.phone || '—'}</td>
                  <td style={{ padding: '13px 16px', fontSize: 13 }}>{emp.location || '—'}</td>
                  <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>@{emp.username || '—'}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 700,
                      background: emp.isActive ? '#ECFDF5' : '#FEF2F2',
                      color: emp.isActive ? '#065F46' : '#991B1B',
                    }}>
                      {emp.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--text-muted)' }}>
                    {emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <button
                      className={`btn btn-sm ${emp.isActive ? 'btn-outline' : 'btn-primary'}`}
                      style={{ fontSize: 12, padding: '4px 12px' }}
                      onClick={() => handleToggle(emp._id, emp.isActive)}
                    >
                      {emp.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Employee Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 20,
        }} onClick={() => setShowModal(false)}>
          <div
            style={{ background: '#FFFFFF', borderRadius: 16, padding: '32px 32px 28px', maxWidth: 480, width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.25)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>🏢 Create Employee</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#9CA3AF' }}>✕</button>
            </div>

            {formError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>⚠️ {formError}</div>
            )}

            <form onSubmit={handleCreate}>
              {[
                { label: 'Full Name *', key: 'name', type: 'text', placeholder: 'Karthik Raj' },
                { label: 'Email *', key: 'email', type: 'email', placeholder: 'employee@tailorconnect.com' },
                { label: 'Phone', key: 'phone', type: 'tel', placeholder: '9876543210' },
                { label: 'Location', key: 'location', type: 'text', placeholder: 'Chennai' },
                { label: 'Department', key: 'department', type: 'text', placeholder: 'Operations' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key} style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 5 }}>{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    style={{ width: '100%', height: 40, padding: '0 12px', border: '1.5px solid #E5E7EB', borderRadius: 7, fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                </div>
              ))}

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Min 8 characters"
                    style={{ width: '100%', height: 40, padding: '0 40px 0 12px', border: '1.5px solid #E5E7EB', borderRadius: 7, fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                  <button type="button" onClick={() => setShowPwd(s => !s)}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 14 }}>
                    {showPwd ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1 }}>
                  {saving ? 'Creating…' : 'Create Employee'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
