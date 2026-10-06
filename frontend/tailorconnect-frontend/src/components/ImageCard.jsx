import React from 'react'

export default function ImageCard({ image, title, subtitle, footer, onClick }) {
  return (
    <div className="card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <img src={image} alt={title} className="image-card-img" loading="lazy" />
      <div className="card-body">
        {title && <h4 style={{ margin: '0 0 4px 0' }}>{title}</h4>}
        {subtitle && <p className="muted" style={{ margin: 0 }}>{subtitle}</p>}
        {footer}
      </div>
    </div>
  )
}
