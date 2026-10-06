import React from 'react'
import Button from './Button'
import StatusBadge from './StatusBadge'

export default function QuotationCard({ quotation, onAccept, onReject }) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="flex-between">
          <h4 style={{ margin: 0 }}>{quotation.tailor}</h4>
          <StatusBadge status={quotation.status} />
        </div>
        <p style={{ margin: '8px 0', fontSize: 20, color: 'var(--pink-dark)', fontWeight: 700 }}>
          ₹{quotation.amount}
        </p>
        <p className="muted" style={{ margin: '0 0 6px 0' }}>Estimated: {quotation.estDays} days</p>
        <p style={{ fontSize: 13, margin: '0 0 10px 0' }}>{quotation.message}</p>
        {onAccept && (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" size="sm" onClick={() => onAccept(quotation)}>Accept</Button>
            <Button variant="outline" size="sm" onClick={() => onReject && onReject(quotation)}>Reject</Button>
          </div>
        )}
      </div>
    </div>
  )
}
