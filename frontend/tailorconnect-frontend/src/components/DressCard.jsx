import React from 'react'
import Button from './Button'

export default function DressCard({ dress, onSelect }) {
  return (
    <div className="card">
      <img src={dress.image} alt={dress.title} className="image-card-img" loading="lazy" />
      <div className="card-body">
        <h4 style={{ margin: '0 0 4px 0' }}>{dress.title}</h4>
        <p className="muted" style={{ margin: 0 }}>{dress.category} • {dress.fabric}</p>
        {onSelect && (
          <Button variant="secondary" size="sm" style={{ marginTop: 10 }} onClick={() => onSelect(dress)}>
            Select Design
          </Button>
        )}
      </div>
    </div>
  )
}
