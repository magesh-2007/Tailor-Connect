import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import * as storage from '../../services/storageService'
import { LoadingState, EmptyState } from '../../components/States'

export default function StudentNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = () => {
    if (!user) return
    const notifs = storage.getNotificationsForUser(user.id)
    setNotifications(notifs)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
    const handleDataChange = () => loadData()
    window.addEventListener('tc_data_changed', handleDataChange)
    return () => window.removeEventListener('tc_data_changed', handleDataChange)
  }, [user])

  const handleMarkRead = (id) => {
    storage.markNotificationRead(id)
    loadData()
  }

  return (
    <DashboardLayout role="student">
      <div className="page-header">
        <div>
          <h1>Student Learning Notifications</h1>
          <p>Course enrollment confirmations, class reminders, completion alerts, and certificates.</p>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading notifications..." />
      ) : notifications.length === 0 ? (
        <EmptyState message="No notifications yet." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              className="card"
              style={{
                borderLeft: n.read ? '1px solid var(--border-light)' : '4px solid var(--primary)',
                background: n.read ? 'var(--white)' : '#FFF8FA'
              }}
            >
              <div className="card-body" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: 14.5, color: 'var(--primary-dark)' }}>
                    {n.title} {!n.read && <span style={{ fontSize: 10, background: 'var(--primary)', color: 'white', padding: '1px 6px', borderRadius: 10, marginLeft: 6 }}>NEW</span>}
                  </h4>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--text-main)' }}>{n.message}</p>
                  <span className="muted" style={{ fontSize: 11.5, marginTop: 4, display: 'inline-block' }}>🕒 {n.time}</span>
                </div>
                {!n.read && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer', color: 'var(--primary)' }}
                  >
                    Mark Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
