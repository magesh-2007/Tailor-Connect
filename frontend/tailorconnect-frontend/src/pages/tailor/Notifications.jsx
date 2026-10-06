import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import Button from '../../components/Button'

const TAILOR_NOTIFICATIONS = [
  {
    id: 1,
    title: 'New Custom Dress Order Broadcast',
    message: 'Customer Priya Sharma requested a quotation for a Silk Bridal Blouse with Aari Work #REQ-1002.',
    time: '10 mins ago',
    unread: true,
    link: '/tailor/quotations'
  },
  {
    id: 2,
    title: 'Quotation Accepted by Customer',
    message: 'Your bid of ₹1,800 for Order #ORD-101 was accepted by customer. Payment secured in escrow.',
    time: '1 hour ago',
    unread: true,
    link: '/tailor/orders'
  },
  {
    id: 3,
    title: 'Delivery SLA Milestone Approaching',
    message: 'Order #ORD-101 is due in 3 days. Ensure finishing and quality inspection are scheduled.',
    time: '5 hours ago',
    unread: false,
    link: '/tailor/progress'
  },
  {
    id: 4,
    title: 'New Course Student Enrollment',
    message: 'Student Meena Sundaram enrolled in your "Aari Embroidery Masterclass".',
    time: 'Yesterday',
    unread: false,
    link: '/tailor/courses'
  },
  {
    id: 5,
    title: 'Fitting Studio Appointment Booked',
    message: 'Appointment confirmed for Measurement & Trial Fitting on Aug 30 at 3:00 PM.',
    time: '2 days ago',
    unread: false,
    link: '/tailor/appointments'
  }
]

export default function TailorNotifications() {
  const [notifications, setNotifications] = useState(TAILOR_NOTIFICATIONS)
  const [filter, setFilter] = useState('all')

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return n.unread
    return true
  })

  return (
    <DashboardLayout role="tailor">
      <div className="page-header">
        <div>
          <h1>Tailor Studio Activity & Notifications</h1>
          <p>Real-time order requests, quotation acceptances, delivery deadlines, and student enrollments.</p>
        </div>
        <Button variant="outline" size="sm" onClick={markAllRead}>
          Mark All as Read
        </Button>
      </div>

      <div className="card" style={{ marginBottom: 20, padding: 12, display: 'flex', gap: 10 }}>
        <button
          type="button"
          className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('all')}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          type="button"
          className={`btn btn-sm ${filter === 'unread' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({notifications.filter(n => n.unread).length})
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((n) => (
          <div
            key={n.id}
            className="card"
            style={{
              padding: 18,
              borderLeft: n.unread ? '4px solid var(--primary)' : '1px solid var(--border)',
              background: n.unread ? 'var(--bg-hover)' : '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <strong style={{ fontSize: 14, color: 'var(--text-main)' }}>{n.title}</strong>
                {n.unread && (
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)', display: 'inline-block' }} />
                )}
                <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{n.time}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                {n.message}
              </p>
            </div>

            <Link to={n.link}>
              <Button size="sm" variant="outline">
                View Details →
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
