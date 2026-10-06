import React from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import ProgressBar from './ProgressBar'
import Button from './Button'

export default function OrderCard({ order, trackPath = '/tracking' }) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="flex-between">
          <h4 style={{ margin: 0 }}>{order.id}</h4>
          <StatusBadge status={order.status} />
        </div>
        <p className="muted" style={{ margin: '6px 0' }}>{order.item}</p>
        <p style={{ margin: '4px 0', fontSize: 13 }}>
          <strong>Tailor:</strong> {order.tailor} &nbsp;|&nbsp; <strong>Delivery:</strong> {order.deliveryDate}
        </p>
        <div className="flex-between" style={{ margin: '6px 0' }}>
          <span>₹{order.amount}</span>
          {order.urgent && <span className="badge badge-urgent">Urgent</span>}
        </div>
        <ProgressBar value={order.progress || 0} />
        <Link to={`${trackPath}/${order.id}`}>
          <Button variant="secondary" block style={{ marginTop: 10 }}>Track Order</Button>
        </Link>
      </div>
    </div>
  )
}
