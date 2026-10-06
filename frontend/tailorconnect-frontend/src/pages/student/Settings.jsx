import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Button from '../../components/Button'

export default function StudentSettings() {
  const [courseAlerts, setCourseAlerts] = useState(true)
  const [assignmentAlerts, setAssignmentAlerts] = useState(true)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [msg, setMsg] = useState('')

  const handlePasswordChange = (e) => {
    e.preventDefault()
    setMsg('Password updated successfully!')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <DashboardLayout role="student">
      <div className="page-header">
        <div>
          <h1>Student Learning Settings</h1>
          <p>Configure assignment deadline notifications, learning preferences, and account security.</p>
        </div>
      </div>

      {msg && <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: 12, borderRadius: 6, marginBottom: 16 }}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 16, color: 'var(--primary-dark)', marginBottom: 14 }}>🔔 Notifications & Reminders</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={assignmentAlerts} onChange={(e) => setAssignmentAlerts(e.target.checked)} />
              <div>
                <strong style={{ fontSize: 13 }}>Assignment Deadline Alerts</strong>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Get reminders 2 days prior to stitching assignment due dates.</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={courseAlerts} onChange={(e) => setCourseAlerts(e.target.checked)} />
              <div>
                <strong style={{ fontSize: 13 }}>New Masterclass Announcements</strong>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Alerts when your favorite tailors release new masterclasses.</div>
              </div>
            </label>
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 16, color: 'var(--primary-dark)', marginBottom: 14 }}>🔒 Change Password</h2>

          <form onSubmit={handlePasswordChange}>
            <div className="form-group" style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Current Password</label>
              <input className="form-control" type="password" placeholder="••••••••" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            </div>
            <div className="form-group" style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>New Password</label>
              <input className="form-control" type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Confirm Password</label>
              <input className="form-control" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>

            <Button variant="primary" type="submit">Update Password</Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
