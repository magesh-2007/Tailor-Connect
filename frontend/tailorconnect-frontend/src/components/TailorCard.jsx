import React from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'

export default function TailorCard({ tailor, actionLabel = 'View Profile', to }) {
  const name = tailor.shopName || tailor.name
  const subName = tailor.shopName ? `By ${tailor.name}` : ''
  const img = tailor.coverImage || tailor.avatar || tailor.image || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80'

  return (
    <div className="card">
      <div style={{ position: 'relative' }}>
        <img src={img} alt={name} className="image-card-img" loading="lazy" style={{ height: 180 }} />
        {tailor.verified && <span className="badge badge-verified" style={{ position: 'absolute', top: 10, right: 10 }}>✓ Verified</span>}
        <span className="tag" style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(255,255,255,0.92)' }}>
          📍 {tailor.location}
        </span>
      </div>
      <div className="card-body">
        <div className="flex-between">
          <div>
            <h4 style={{ margin: 0, fontSize: 16 }}>{name}</h4>
            {subName && <p className="muted" style={{ margin: '2px 0 0 0', fontSize: 12 }}>{subName}</p>}
          </div>
          <span className="rating">★ {tailor.rating || 4.8}</span>
        </div>

        <p style={{ margin: '6px 0 8px 0', fontSize: 13, color: 'var(--primary-dark)', fontWeight: 600 }}>
          🏷️ {tailor.specialist || 'Bridal & Aari Specialist'}
        </p>

        {to && (
          <Link to={to} style={{ display: 'block', marginTop: 10 }}>
            <Button variant="secondary" block>{actionLabel}</Button>
          </Link>
        )}
      </div>
    </div>
  )
}
