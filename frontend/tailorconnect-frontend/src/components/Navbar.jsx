import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const ROLE_LABELS = {
  customer: 'Customer',
  tailor:   'Tailor Studio',
  student:  'Fashion Student',
  admin:    'Platform Admin',
  employee: 'Employee',
}

function BellIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [unreadCount, setUnreadCount] = useState(0)

  // Load unread notification count from real API
  useEffect(() => {
    if (!user) return
    api.get('/notifications?limit=50').then(res => {
      const notifications = res.data?.data?.notifications || res.data?.notifications || []
      setUnreadCount(notifications.filter(n => !n.isRead).length)
    }).catch(() => {})
  }, [user])

  const handleLogout = () => {
    logout()
    navigate('/home')
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U'

  const role = user?.role?.toLowerCase()

  return (
    <header className="navbar">
      {/* ── Left: Hamburger + Search ── */}
      <div className="navbar-left">
        <button
          type="button"
          className="hamburger-btn"
          id="sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <MenuIcon />
        </button>

        <div className="navbar-search">
          <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search tailoring requests, tailors, courses…"
            aria-label="Search platform"
          />
        </div>
      </div>

      {/* ── Right: Actions ── */}
      <div className="navbar-right">
        {user ? (
          <>
            {/* Wishlist heart — customer only */}
            {role === 'customer' && (
              <Link
                to="/customer/wishlist"
                style={{
                  position: 'relative', padding: '7px 10px',
                  display: 'flex', alignItems: 'center',
                  borderRadius: 7, border: '1.5px solid var(--border)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-secondary)', transition: 'var(--transition)',
                  textDecoration: 'none',
                }}
                title="Wishlist"
                aria-label="View wishlist"
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--danger)'; e.currentTarget.style.color = 'var(--danger)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
              >
                <HeartIcon />
              </Link>
            )}

            {/* Notification bell */}
            <Link
              to={`/${role}/notifications`}
              style={{
                position: 'relative', padding: '7px 10px',
                display: 'flex', alignItems: 'center',
                borderRadius: 7, border: '1.5px solid var(--border)',
                background: 'var(--bg-card)',
                color: 'var(--text-secondary)', transition: 'var(--transition)',
                textDecoration: 'none',
              }}
              title="Notifications"
              aria-label="View notifications"
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              <BellIcon />
              {unreadCount > 0 && (
                <span
                  aria-label={`${unreadCount} unread notifications`}
                  style={{
                    position: 'absolute', top: 4, right: 4,
                    minWidth: 14, height: 14,
                    backgroundColor: '#B45353',
                    borderRadius: '50%',
                    border: '1.5px solid var(--bg-card)',
                    fontSize: 9, fontWeight: 800, color: '#FFFFFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 2px',
                  }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Profile chip */}
            <Link
              to={`/${role}/profile`}
              className="navbar-user-chip"
              aria-label="View profile"
            >
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name || 'Profile'}
                  style={{
                    width: 30, height: 30, borderRadius: '50%',
                    objectFit: 'cover', flexShrink: 0,
                  }}
                />
              ) : (
                <div className="navbar-avatar">{initials}</div>
              )}
              <div style={{ textAlign: 'left', lineHeight: 1.25 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user.name || 'User'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  {ROLE_LABELS[role] || user.role}
                </div>
              </div>
            </Link>

            {/* Sign Out */}
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleLogout}
              style={{ fontSize: 12 }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">
            Sign In
          </Link>
        )}
      </div>
    </header>
  )
}
