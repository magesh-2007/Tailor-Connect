import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h2>404</h2>
        <p className="muted">The page you're looking for doesn't exist.</p>
        <Link to="/"><span className="btn btn-primary" style={{ display: 'inline-flex' }}>Go Home</span></Link>
      </div>
    </div>
  )
}
