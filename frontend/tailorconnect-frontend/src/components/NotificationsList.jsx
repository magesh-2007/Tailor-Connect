import React from 'react'
import { EmptyState } from './States'

export default function NotificationsList({ notifications }) {
  if (!notifications || notifications.length === 0) {
    return <EmptyState message="You're all caught up! No new notifications." />
  }
  return (
    <div>
      {notifications.map((n) => (
        <div key={n.id} className="card" style={{ marginBottom: 10 }}>
          <div className="card-body flex-between">
            <div>
              <strong>{n.title}</strong>{!n.read && <span className="badge badge-pending" style={{ marginLeft: 8 }}>New</span>}
              <p className="muted" style={{ margin: '4px 0 0 0' }}>{n.body}</p>
            </div>
            <span className="muted" style={{ whiteSpace: 'nowrap' }}>{n.time}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
