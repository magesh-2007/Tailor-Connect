import React from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function EmployeeSettings() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <DashboardLayout role="employee">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account preferences.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 480 }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: 15, fontWeight: 700 }}>Account</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', borderRadius: 8, border: '1px solid var(--border)',
            background: 'var(--bg-subtle)'
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Sign Out</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                End your current session and return to the login page.
              </div>
            </div>
            <button
              id="employee-logout-btn"
              onClick={handleLogout}
              className="btn btn-danger"
              style={{ fontSize: 13, padding: '7px 18px' }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
