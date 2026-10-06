import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

// ── Restore saved theme & font on startup ──────────────────────
;(function restoreSettings() {
  try {
    const raw = localStorage.getItem('tc_customer_settings')
    if (!raw) return
    const s = JSON.parse(raw)
    const root = document.documentElement
    const color = s.customColor || s.themeColor
    if (color && color.startsWith('#')) {
      const darken = (hex, pct) => {
        const n = parseInt(hex.slice(1), 16)
        const r = Math.max(0, Math.min(255, (n >> 16) - Math.round(2.55 * pct)))
        const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) - Math.round(2.55 * pct)))
        const b = Math.max(0, Math.min(255, (n & 0xff) - Math.round(2.55 * pct)))
        return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
      }
      const hex2rgba = (hex, a) => {
        const n = parseInt(hex.slice(1), 16)
        return `rgba(${n >> 16},${(n >> 8) & 0xff},${n & 0xff},${a})`
      }
      root.style.setProperty('--primary',           color)
      root.style.setProperty('--primary-hover',     darken(color, 8))
      root.style.setProperty('--primary-dark',      darken(color, 12))
      root.style.setProperty('--primary-light',     darken(color, -8))
      root.style.setProperty('--primary-subtle',    hex2rgba(color, 0.12))
      root.style.setProperty('--bg-sidebar',        color)
      root.style.setProperty('--bg-sidebar-hover',  darken(color, -8))
      root.style.setProperty('--bg-sidebar-active', darken(color, 12))
      root.style.setProperty('--border-focus',      color)
      root.style.setProperty('--text-navy',         color)
    }
    if (s.fontFamily) {
      document.body.style.fontFamily = s.fontFamily
      const fontName = s.fontFamily.replace(/'/g, '').split(',')[0].trim()
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.id = 'tc-dynamic-font'
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700;800&display=swap`
      document.head.appendChild(link)
    }
    if (s.fontSize) document.body.style.fontSize = s.fontSize
  } catch (_) {}
})()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
