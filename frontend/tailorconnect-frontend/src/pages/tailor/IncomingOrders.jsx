import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import * as storage from '../../services/storageService'
import StatusBadge from '../../components/StatusBadge'
import Button from '../../components/Button'

export default function IncomingOrders() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const highlightId = searchParams.get('highlight')

  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const loadData = () => {
    if (!user) return
    const list = storage.getOrdersForTailor(user.id)
    setOrders(list)
  }

  useEffect(() => {
    loadData()
    const handleDataChange = () => loadData()
    window.addEventListener('tc_data_changed', handleDataChange)
    return () => window.removeEventListener('tc_data_changed', handleDataChange)
  }, [user])

  const filtered = orders.filter((o) => {
    const matchesSearch =
      !searchTerm ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.customer && o.customer.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.item && o.item.toLowerCase().includes(searchTerm.toLowerCase()))

    let matchesFilter = true
    if (filter === 'active') {
      matchesFilter = !['Delivered', 'Completed', 'Cancelled'].includes(o.status)
    } else if (filter === 'urgent') {
      matchesFilter = Boolean(o.urgent)
    } else if (filter === 'completed') {
      matchesFilter = ['Delivered', 'Completed'].includes(o.status)
    }

    return matchesSearch && matchesFilter
  })

  return (
    <DashboardLayout role="tailor">
      <div className="page-header">
        <div>
          <h1>Customized Orders Management</h1>
          <p>Supervise active bespoke garment orders, customer specifications, due dates, payment escrow, and stage progression.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/tailor/progress">
            <Button variant="primary">⚡ 10-Stage Production Queue</Button>
          </Link>
          <Link to="/tailor/quotations">
            <Button variant="outline">🏷️ Quotation Requests</Button>
          </Link>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="card" style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter('all')}
            >
              All Orders ({orders.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filter === 'active' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter('active')}
            >
              In Production ({orders.filter(o => !['Delivered', 'Completed', 'Cancelled'].includes(o.status)).length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filter === 'urgent' ? 'btn-danger' : 'btn-outline'}`}
              onClick={() => setFilter('urgent')}
            >
              🔥 Urgent Orders ({orders.filter(o => o.urgent).length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filter === 'completed' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter('completed')}
            >
              Completed ({orders.filter(o => ['Delivered', 'Completed'].includes(o.status)).length})
            </button>
          </div>

          <div style={{ width: 240 }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search customer, ID, dress..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '6px 12px', fontSize: 13 }}
            />
          </div>
        </div>
      </div>

      {/* ORDERS DATA TABLE (FIELDS: Order ID, Customer, Dress, Due Date, Priority, Current Stage, Payment, Action) */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Dress</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Current Stage</th>
                <th>Payment</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: 36, textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No customized orders found matching this filter.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const isUrgent = order.urgent
                  const isPaid = order.paymentStatus !== 'Pending'

                  return (
                    <tr 
                      key={order.id}
                      style={{
                        backgroundColor: highlightId === order.id ? 'var(--bg-hover)' : undefined
                      }}
                    >
                      <td>
                        <strong style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>#{order.id}</strong>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{order.customer}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>📞 {order.customerPhone || '9876543210'}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{order.item || order.designName}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{order.category} • {order.fabric}</div>
                      </td>
                      <td>
                        <div><strong>{order.deliveryDate}</strong></div>
                      </td>
                      <td>
                        {isUrgent ? (
                          <span className="status-badge badge-urgent" style={{ fontSize: 11 }}>🔥 Urgent</span>
                        ) : (
                          <span className="status-badge" style={{ fontSize: 11 }}>Normal</span>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={order.status} />
                      </td>
                      <td>
                        <strong style={{ color: isPaid ? 'var(--success)' : 'var(--warning)', fontSize: 13 }}>
                          ₹{order.amount} ({isPaid ? 'Secured' : 'Pending'})
                        </strong>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <Link to={`/tailor/progress?orderId=${order.id}`}>
                            <Button size="sm" variant="primary">
                              Advance Stage
                            </Button>
                          </Link>
                          <Link to={`/tailor/chat?recipient=${encodeURIComponent(order.customer)}&orderId=${order.id}`}>
                            <Button size="sm" variant="outline">
                              Chat
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
