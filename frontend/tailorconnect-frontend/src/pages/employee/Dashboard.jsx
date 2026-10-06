import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

export default function EmployeeDashboard() {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/employees/dashboard')
        setStats(res.data?.data?.stats || null)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#e2e8f0'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>🏢</span>
          <div>
            <span style={{ fontWeight: 700, fontSize: 18, color: '#fff' }}>TailorConnect</span>
            <span style={{
              marginLeft: 10, fontSize: 11, fontWeight: 600, letterSpacing: 1,
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              padding: '2px 10px', borderRadius: 12, color: '#fff'
            }}>EMPLOYEE</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 14, color: '#9CA3AF' }}>
            Welcome, <strong style={{ color: '#e2e8f0' }}>{user?.name}</strong>
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171', padding: '6px 16px', borderRadius: 8,
              cursor: 'pointer', fontSize: 13, fontWeight: 600
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>

        {/* Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: 16, padding: '28px 32px', marginBottom: 32,
          display: 'flex', alignItems: 'center', gap: 20
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
          }}>🧑‍💼</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#fff' }}>
              Employee Dashboard
            </h1>
            <p style={{ margin: '4px 0 0 0', color: '#9CA3AF', fontSize: 14 }}>
              {user?.email} &nbsp;·&nbsp; Role: <strong style={{ color: '#a78bfa' }}>EMPLOYEE</strong>
              &nbsp;·&nbsp; Department: {user?.department || 'Operations'}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 10, padding: '12px 18px', marginBottom: 24, color: '#f87171', fontSize: 14
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Stats Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#667085', fontSize: 16 }}>
            Loading dashboard…
          </div>
        ) : stats ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 20, marginBottom: 32
          }}>
            {[
              { label: 'Total Customers', value: stats.totalCustomers, icon: '👗', color: '#06b6d4' },
              { label: 'Total Tailors',   value: stats.totalTailors,   icon: '🧵', color: '#8b5cf6' },
              { label: 'Total Students',  value: stats.totalStudents,  icon: '📚', color: '#10b981' },
              { label: 'Total Employees', value: stats.totalEmployees, icon: '🏢', color: '#f59e0b' },
              { label: 'Total Orders',    value: stats.totalOrders,    icon: '📦', color: '#6366f1' },
              { label: 'Active Orders',   value: stats.activeOrders,   icon: '⚡', color: '#ec4899' },
              { label: 'Delivered',       value: stats.deliveredOrders,icon: '✅', color: '#22c55e' },
            ].map((s) => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${s.color}30`,
                borderRadius: 14, padding: '20px 22px',
                transition: 'transform 0.2s'
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value ?? '—'}</div>
                <div style={{ fontSize: 13, color: '#667085', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Info Box */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14, padding: '24px 28px'
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 700, color: '#cbd5e1' }}>
            Your Account Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px', fontSize: 14 }}>
            {[
              ['Name', user?.name],
              ['Email', user?.email],
              ['Role', user?.role?.toUpperCase()],
              ['Location', user?.location || '—'],
              ['Phone', user?.phone || '—'],
              ['Status', user?.isActive !== false ? '✅ Active' : '❌ Inactive'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: '#667085', minWidth: 80 }}>{k}:</span>
                <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
