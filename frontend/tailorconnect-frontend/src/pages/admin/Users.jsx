import React, { useEffect, useState, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'

const ROLES = ['ALL', 'ADMIN', 'TAILOR', 'CUSTOMER', 'STUDENT', 'EMPLOYEE']

const roleBadgeColor = (role = '') => {
  const map = {
    ADMIN:    { bg: '#7c3aed22', color: '#7c3aed' },
    TAILOR:   { bg: '#0369a122', color: '#0369a1' },
    CUSTOMER: { bg: '#15803d22', color: '#15803d' },
    STUDENT:  { bg: '#b4530022', color: '#b45300' },
    EMPLOYEE: { bg: '#1d4ed822', color: '#1d4ed8' }
  }
  return map[role.toUpperCase()] || { bg: '#66708522', color: '#667085' }
}

const EMPTY_EMP = { name: '', email: '', password: '', phone: '', location: 'Chennai', department: 'Operations' }

export default function AdminUsers() {
  const [users, setUsers]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [togglingId, setTogglingId]     = useState(null)
  const [deletingId, setDeletingId]     = useState(null)
  const [error, setError]               = useState('')
  const [success, setSuccess]           = useState('')
  const [roleFilter, setRoleFilter]     = useState('ALL')
  const [search, setSearch]             = useState('')
  const [searchInput, setSearchInput]   = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [total, setTotal]               = useState(0)

  // Create Employee modal state
  const [showCreateEmp, setShowCreateEmp] = useState(false)
  const [empForm, setEmpForm]             = useState(EMPTY_EMP)
  const [empLoading, setEmpLoading]       = useState(false)
  const [empError, setEmpError]           = useState('')
  const [showEmpPwd, setShowEmpPwd]       = useState(false)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (roleFilter !== 'ALL') params.set('role', roleFilter)
      if (search) params.set('q', search)
      params.set('limit', '100')

      const res = await api.get(`/admin/users?${params.toString()}`)
      const data = res.data?.data || {}
      setUsers(data.users || [])
      setTotal(data.total || 0)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users.')
    } finally {
      setLoading(false)
    }
  }, [roleFilter, search])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400)
    return () => clearTimeout(t)
  }, [searchInput])

  const handleToggleStatus = async (user) => {
    setTogglingId(user._id)
    setError('')
    setSuccess('')
    try {
      const res = await api.patch(`/admin/users/${user._id}/status`)
      const updated = res.data?.data?.user
      if (updated) {
        setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isActive: updated.isActive } : u))
        if (selectedUser?._id === user._id) setSelectedUser(prev => ({ ...prev, isActive: updated.isActive }))
        setSuccess(`${user.name}'s account ${updated.isActive ? 'activated' : 'deactivated'}.`)
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user status.')
    } finally {
      setTogglingId(null)
    }
  }

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Delete ${user.name}'s account permanently? This cannot be undone.`)) return
    setDeletingId(user._id)
    setError('')
    try {
      await api.delete(`/admin/users/${user._id}`)
      setUsers(prev => prev.filter(u => u._id !== user._id))
      setTotal(t => t - 1)
      if (selectedUser?._id === user._id) setSelectedUser(null)
      setSuccess(`${user.name}'s account has been deleted.`)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleCreateEmployee = async (e) => {
    e.preventDefault()
    setEmpError('')
    if (!empForm.name || !empForm.email || !empForm.password) {
      setEmpError('Name, email, and password are required.')
      return
    }
    setEmpLoading(true)
    try {
      const res = await api.post('/admin/employees', empForm)
      const newUser = res.data?.data?.user
      if (newUser) {
        setUsers(prev => [newUser, ...prev])
        setTotal(t => t + 1)
      }
      setShowCreateEmp(false)
      setEmpForm(EMPTY_EMP)
      setSuccess('Employee account created successfully.')
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setEmpError(err.response?.data?.message || 'Failed to create employee account.')
    } finally {
      setEmpLoading(false)
    }
  }

  return (
    <DashboardLayout role="admin">
      <div className="page-header">
        <div>
          <h1>User &amp; Role Management</h1>
          <p>Supervise all registered users across every role. Data from MongoDB.</p>
        </div>
        <div className="page-actions">
          <button
            id="admin-create-employee-btn"
            className="btn btn-primary"
            onClick={() => { setShowCreateEmp(true); setEmpError('') }}
          >
            + Create Employee Account
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div style={{ background: '#FEF2F2', color: '#dc2626', border: '1px solid #FECACA', padding: '10px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '10px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
          ✅ {success}
        </div>
      )}

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20, padding: 16 }}>
        <div className="form-row" style={{ alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 2, minWidth: 200 }}>
            <label>Search by Name, Email, Username, or Location</label>
            <input
              className="form-control"
              placeholder="Search users…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Filter by Role</label>
            <select
              className="form-control"
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
            >
              {ROLES.map(r => (
                <option key={r} value={r}>{r === 'ALL' ? `All Roles (${total})` : r}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          ⏳ Loading users from MongoDB…
        </div>
      ) : users.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          No users found matching your search.
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Location</th>
                <th>Phone</th>
                <th>Verified</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const roleColors = roleBadgeColor(u.role)
                const isAdminUser = (u.role || '').toUpperCase() === 'ADMIN'
                return (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img
                          src={u.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={u.name}
                          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }}
                        />
                        <div>
                          <strong>{u.name}</strong>
                          <div className="muted" style={{ fontSize: 12 }}>{u.email}</div>
                          {u.username && <div className="muted" style={{ fontSize: 11 }}>@{u.username}</div>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ ...roleColors, padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                        {(u.role || 'CUSTOMER').toUpperCase()}
                      </span>
                    </td>
                    <td>{u.location || '—'}</td>
                    <td>{u.phone || '—'}</td>
                    <td>
                      <span style={{
                        padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                        background: u.isVerified ? '#dcfce7' : '#fef9c3',
                        color: u.isVerified ? '#15803d' : '#a16207'
                      }}>
                        {u.isVerified ? '✓ Verified' : '⏳ Pending'}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                        background: u.isActive ? '#dcfce7' : '#fee2e2',
                        color: u.isActive ? '#15803d' : '#dc2626'
                      }}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setSelectedUser(u)}
                          style={{ fontSize: 12 }}
                        >
                          View
                        </button>
                        {!isAdminUser && (
                          <button
                            className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-primary'}`}
                            onClick={() => handleToggleStatus(u)}
                            disabled={togglingId === u._id}
                            style={{ fontSize: 12 }}
                          >
                            {togglingId === u._id ? '…' : u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                        {!isAdminUser && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteUser(u)}
                            disabled={deletingId === u._id}
                            style={{ fontSize: 12, background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}
                          >
                            {deletingId === u._id ? '…' : 'Delete'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── CREATE EMPLOYEE MODAL ── */}
      {showCreateEmp && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateEmp(false)}
          style={{ zIndex: 1000 }}
        >
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: 540 }}
          >
            <div className="modal-header">
              <h2>🏢 Create Employee Account</h2>
              <button className="modal-close-btn" onClick={() => setShowCreateEmp(false)}>✕</button>
            </div>

            <div style={{
              background: '#EEF2FF', border: '1px solid #C7D2FE',
              borderRadius: 8, padding: '10px 14px', marginBottom: 20,
              fontSize: 13, color: '#3730A3', display: 'flex', gap: 8, alignItems: 'flex-start'
            }}>
              <span style={{ flexShrink: 0 }}>🔒</span>
              <span>
                Employee accounts are created <strong>only by admins</strong>. The employee will be able to log in
                using the email and password you set here. They will have read-only access to platform stats.
              </span>
            </div>

            {empError && (
              <div style={{
                background: '#FEF2F2', border: '1px solid #FECACA',
                borderRadius: 8, padding: '10px 14px', marginBottom: 18,
                color: '#dc2626', fontSize: 13
              }}>
                ⚠️ {empError}
              </div>
            )}

            <form onSubmit={handleCreateEmployee}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Name <span style={{ color: '#dc2626' }}>*</span></label>
                  <input
                    id="emp-name"
                    className="form-control"
                    placeholder="e.g. Ravi Kumar"
                    value={empForm.name}
                    onChange={e => setEmpForm(f => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Email Address <span style={{ color: '#dc2626' }}>*</span></label>
                  <input
                    id="emp-email"
                    type="email"
                    className="form-control"
                    placeholder="ravi@tailorconnect.com"
                    value={empForm.email}
                    onChange={e => setEmpForm(f => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0, position: 'relative' }}>
                  <label className="form-label">Password <span style={{ color: '#dc2626' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="emp-password"
                      type={showEmpPwd ? 'text' : 'password'}
                      className="form-control"
                      placeholder="Set a strong password"
                      value={empForm.password}
                      onChange={e => setEmpForm(f => ({ ...f, password: e.target.value }))}
                      required
                      style={{ paddingRight: 40 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowEmpPwd(v => !v)}
                      style={{
                        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: '#9CA3AF'
                      }}
                    >
                      {showEmpPwd ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Phone</label>
                  <input
                    id="emp-phone"
                    className="form-control"
                    placeholder="+91 98765 43210"
                    value={empForm.phone}
                    onChange={e => setEmpForm(f => ({ ...f, phone: e.target.value }))}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Department</label>
                  <select
                    id="emp-department"
                    className="form-control"
                    value={empForm.department}
                    onChange={e => setEmpForm(f => ({ ...f, department: e.target.value }))}
                  >
                    {['Operations', 'Customer Support', 'Quality Assurance', 'Delivery & Logistics', 'Finance', 'Marketing'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Location</label>
                  <select
                    id="emp-location"
                    className="form-control"
                    value={empForm.location}
                    onChange={e => setEmpForm(f => ({ ...f, location: e.target.value }))}
                  >
                    {['Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Kolkata', 'Pune'].map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => { setShowCreateEmp(false); setEmpForm(EMPTY_EMP) }}
                >
                  Cancel
                </button>
                <button
                  id="emp-submit-btn"
                  type="submit"
                  className="btn btn-primary"
                  disabled={empLoading}
                >
                  {empLoading ? 'Creating…' : '✓ Create Employee Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <div className="modal-header">
              <h2>User Details</h2>
              <button className="modal-close-btn" onClick={() => setSelectedUser(null)}>✕</button>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 18, alignItems: 'center' }}>
              <img
                src={selectedUser.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={selectedUser.name}
                style={{ width: 70, height: 70, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}
              />
              <div>
                <h3 style={{ margin: '0 0 4px 0' }}>{selectedUser.name}</h3>
                <div style={{ ...roleBadgeColor(selectedUser.role), display: 'inline-block', padding: '2px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                  {(selectedUser.role || '').toUpperCase()}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{selectedUser.email}</div>
                {selectedUser.username && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>@{selectedUser.username}</div>}
              </div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: 14, borderRadius: 8, fontSize: 13, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
              {[
                ['Phone',      selectedUser.phone || '—'],
                ['Location',   selectedUser.location || '—'],
                ['Address',    selectedUser.address || '—'],
                ['Age',        selectedUser.age || '—'],
                ['Status',     selectedUser.isActive ? '✅ Active' : '❌ Inactive'],
                ['Verified',   selectedUser.isVerified ? '✅ Yes' : '⏳ Pending'],
                ['Joined',     selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('en-IN') : '—'],
                ['MongoDB ID', selectedUser._id]
              ].map(([k, v]) => (
                <div key={k}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{k}</span>
                  <div style={{ fontWeight: 500, wordBreak: 'break-all' }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'right', marginTop: 18, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              {(selectedUser.role || '').toUpperCase() !== 'ADMIN' && (
                <>
                  <button
                    className={`btn ${selectedUser.isActive ? 'btn-danger' : 'btn-primary'}`}
                    onClick={() => { handleToggleStatus(selectedUser); setSelectedUser(null) }}
                  >
                    {selectedUser.isActive ? 'Deactivate Account' : 'Activate Account'}
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}
                    onClick={() => { handleDeleteUser(selectedUser); setSelectedUser(null) }}
                  >
                    Delete Account
                  </button>
                </>
              )}
              <button className="btn btn-outline" onClick={() => setSelectedUser(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
