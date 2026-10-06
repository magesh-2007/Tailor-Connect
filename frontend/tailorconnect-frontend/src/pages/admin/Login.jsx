import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/* ─────────────────────────────────────────────────────────────────────────────
   TAILORCONNECT LOGO  (inline SVG — no external dependency)
───────────────────────────────────────────────────────────────────────────── */
function TCLogo({ size = 42 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="TailorConnect logo"
      style={{ flexShrink: 0 }}
    >
      <circle cx="24" cy="24" r="24" fill="#0F5C5E" />
      {/* Needle */}
      <line x1="24" y1="10" x2="24" y2="33" stroke="white" strokeWidth="2" strokeLinecap="round" />
      {/* Eye of needle */}
      <ellipse cx="24" cy="9" rx="3" ry="1.8" stroke="#C9A66B" strokeWidth="1.5" fill="none" />
      <ellipse cx="24" cy="12" rx="1.2" ry="1" stroke="white" strokeWidth="1.2" fill="none" />
      {/* Thread wave */}
      <path d="M17 27 Q20.5 22 24 27 Q27.5 32 31 27" stroke="#C9A66B" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Thread tail */}
      <path d="M24 33 C22 37 19 39 20.5 42" stroke="#C9A66B" strokeWidth="1.4" strokeDasharray="2 1.8" strokeLinecap="round" fill="none" />
      {/* Accent dot */}
      <circle cx="33" cy="15" r="2.2" fill="#C9A66B" opacity="0.9" />
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   EYE ICON
───────────────────────────────────────────────────────────────────────────── */
function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   SHIELD ICON
───────────────────────────────────────────────────────────────────────────── */
function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F5C5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   DECORATIVE BACKGROUND PATTERN
───────────────────────────────────────────────────────────────────────────── */
function BackgroundPattern() {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="admin-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#admin-grid)" />
      {/* Decorative circles */}
      <circle cx="10%" cy="20%" r="180" fill="rgba(201,166,107,0.04)" />
      <circle cx="90%" cy="80%" r="220" fill="rgba(15,92,94,0.08)" />
      <circle cx="85%" cy="15%" r="120" fill="rgba(255,255,255,0.03)" />
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN ADMIN LOGIN PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function AdminLogin() {
  const { login, user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ identifier: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [loginAttempts, setLoginAttempts] = useState(0)

  // If already logged in as admin, redirect immediately
  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [user, navigate])

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.identifier.trim() || !form.password.trim()) {
      setError('Please enter both email/username and password.')
      return
    }

    if (loginAttempts >= 5) {
      setError('Too many failed attempts. Please wait a moment before trying again.')
      return
    }

    setLoading(true)
    const result = await login({ identifier: form.identifier.trim(), password: form.password.trim() })
    setLoading(false)

    if (result.success) {
      const role = result.user?.role?.toLowerCase()
      if (role === 'admin') {
        // ✅ Valid admin credentials — proceed to dashboard
        navigate('/admin/dashboard', { replace: true })
      } else {
        // ❌ Valid credentials but NOT an admin account
        setLoginAttempts(n => n + 1)
        setError(
          `Access denied. Your account has role "${(result.user?.role || 'unknown').toUpperCase()}" — ` +
          'this portal is for platform administrators only. Please use the standard login page.'
        )
        // Clear the stored session — this user should not be lingering
        localStorage.removeItem('tc_token')
        localStorage.removeItem('tc_user')
      }
    } else {
      setLoginAttempts(n => n + 1)
      setError(result.error || 'Authentication failed. Please verify your credentials.')
    }
  }

  const inputStyle = (field) => ({
    width: '100%',
    height: 46,
    padding: '0 14px',
    fontSize: 14,
    fontFamily: "'Outfit', 'Inter', sans-serif",
    color: '#1F2937',
    background: '#FFFFFF',
    border: `1.5px solid ${focusedField === field ? '#0F5C5E' : '#E3E8E6'}`,
    borderRadius: 8,
    outline: 'none',
    boxShadow: focusedField === field ? '0 0 0 3px rgba(15,92,94,0.12)' : 'none',
    transition: 'border-color 0.18s, box-shadow 0.18s',
    boxSizing: 'border-box',
  })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500&display=swap');

        * { box-sizing: border-box; }

        @keyframes adminFadeIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }

        .admin-card {
          animation: adminFadeIn 0.4s ease both;
        }

        .admin-submit-btn {
          width: 100%;
          height: 50px;
          border: none;
          border-radius: 9px;
          background: linear-gradient(135deg, #0F5C5E 0%, #0A4547 100%);
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          box-shadow: 0 4px 14px rgba(15,92,94,0.35);
        }
        .admin-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(15,92,94,0.45);
          background: linear-gradient(135deg, #0A4547 0%, #073335 100%);
        }
        .admin-submit-btn:active:not(:disabled) { transform: translateY(0); }
        .admin-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; box-shadow: none; }

        .admin-back-link {
          display: inline-flex; align-items: center; gap: 6px;
          color: rgba(255,255,255,0.55); text-decoration: none;
          font-size: 13px; font-family: 'Outfit', sans-serif;
          transition: color 0.15s; margin-bottom: 28px;
        }
        .admin-back-link:hover { color: #C9A66B; }

        .admin-input-wrap { position: relative; }
        .admin-eye-btn {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #9CA3AF; padding: 4px;
          display: flex; align-items: center;
          transition: color 0.15s;
        }
        .admin-eye-btn:hover { color: #374151; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #0A1628 0%, #0B3D3F 45%, #0F5C5E 75%, #0A4547 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Outfit', 'Inter', sans-serif",
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <BackgroundPattern />

        <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>
          {/* Back to home */}
          <Link to="/home" className="admin-back-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5"/><path d="M12 5l-7 7 7 7"/>
            </svg>
            Back to Home
          </Link>

          {/* ── Card ── */}
          <div className="admin-card" style={{
            background: '#FFFFFF',
            borderRadius: 20,
            padding: '44px 44px 38px',
            boxShadow: '0 32px 100px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)',
          }}>
            {/* ── Header with Logo ── */}
            <div style={{ textAlign: 'center', marginBottom: 30 }}>
              {/* TailorConnect Logo */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                marginBottom: 20,
              }}>
                <TCLogo size={44} />
                <span style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 800,
                  fontSize: 22,
                  color: '#0F5C5E',
                  letterSpacing: '-0.3px',
                  lineHeight: 1,
                }}>
                  Tailor<span style={{ color: '#C9A66B' }}>Connect</span>
                </span>
              </div>

              {/* Separator */}
              <div style={{
                width: 48, height: 2,
                background: 'linear-gradient(90deg, transparent, #C9A66B, transparent)',
                margin: '0 auto 18px',
                borderRadius: 2,
              }} />

              {/* Admin Portal badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                background: 'linear-gradient(135deg, #EDFDF9, #D5F5EE)',
                border: '1px solid #B2E8D8',
                borderRadius: 999,
                padding: '5px 14px',
                marginBottom: 14,
              }}>
                <ShieldIcon />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0F5C5E', letterSpacing: '0.04em' }}>
                  ADMIN PORTAL
                </span>
              </div>

              <h1 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 26, fontWeight: 800,
                color: '#111827', margin: '0 0 6px',
                letterSpacing: '-0.02em',
              }}>
                Administrator Sign In
              </h1>
              <p style={{ fontSize: 13.5, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
                Restricted access · Platform administrators only
              </p>
            </div>

            {/* ── Security Notice ── */}
            <div style={{
              background: 'linear-gradient(135deg, #EFF9F7, #E8F5F2)',
              border: '1px solid #B2DFDB',
              borderRadius: 10,
              padding: '10px 14px',
              marginBottom: 22,
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>🔒</span>
              <span style={{ fontSize: 12.5, color: '#047857', lineHeight: 1.55 }}>
                This page is for authorized administrators only.
                Regular users should use the{' '}
                <Link to="/login" style={{ color: '#C9A66B', fontWeight: 700 }}>
                  standard login page
                </Link>.
              </span>
            </div>

            {/* ── Error ── */}
            {error && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 9,
                padding: '11px 14px',
                marginBottom: 20,
                display: 'flex',
                gap: 9,
                alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>⚠️</span>
                <span style={{ fontSize: 13, color: '#991B1B', lineHeight: 1.5 }}>{error}</span>
              </div>
            )}

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} noValidate>
              {/* Email / Username */}
              <div style={{ marginBottom: 16 }}>
                <label
                  htmlFor="admin-identifier"
                  style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 7 }}
                >
                  Email / Username
                </label>
                <div className="admin-input-wrap">
                  <input
                    id="admin-identifier"
                    type="text"
                    value={form.identifier}
                    onChange={handleChange('identifier')}
                    onFocus={() => setFocusedField('identifier')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="admin@tailorconnect.com"
                    required
                    autoComplete="username"
                    autoFocus
                    style={inputStyle('identifier')}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: 28 }}>
                <label
                  htmlFor="admin-password"
                  style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 7 }}
                >
                  Password
                </label>
                <div className="admin-input-wrap">
                  <input
                    id="admin-password"
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange('password')}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter admin password"
                    required
                    autoComplete="current-password"
                    style={{ ...inputStyle('password'), paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    className="admin-eye-btn"
                    onClick={() => setShowPass(s => !s)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    <EyeIcon open={showPass} />
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                id="admin-login-btn"
                type="submit"
                className="admin-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: 17, height: 17,
                      border: '2.5px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#FFFFFF',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                      display: 'inline-block',
                      flexShrink: 0,
                    }} />
                    Authenticating…
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    Sign In as Admin
                  </>
                )}
              </button>
            </form>

            {/* ── Footer ── */}
            <div style={{
              textAlign: 'center',
              marginTop: 24,
              paddingTop: 20,
              borderTop: '1px solid #F3F4F6',
            }}>
              <span style={{ fontSize: 13, color: '#9CA3AF' }}>Not an admin? </span>
              <Link
                to="/login"
                style={{ fontSize: 13, fontWeight: 600, color: '#0F5C5E', textDecoration: 'none' }}
              >
                Go to regular login →
              </Link>
            </div>
          </div>

          {/* ── Footer Note ── */}
          <p style={{
            textAlign: 'center',
            fontSize: 11.5,
            color: 'rgba(255,255,255,0.35)',
            marginTop: 20,
            lineHeight: 1.6,
          }}>
            TailorConnect Admin Console · Secured by JWT Authentication
            <br />
            Unauthorized access attempts are logged and monitored.
          </p>
        </div>
      </div>
    </>
  )
}
