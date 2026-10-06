import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import * as storage from '../../services/storageService'
import StatusBadge from '../../components/StatusBadge'
import Button from '../../components/Button'

export default function OrderManagement() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const loadData = () => {
    const all = storage.getOrders ? storage.getOrders() : []
    setOrders(all)
  }

  useEffect(() => {
    loadData()
    const handleDataChange = () => loadData()
    window.addEventListener('tc_data_changed', handleDataChange)
    return () => window.removeEventListener('tc_data_changed', handleDataChange)
  }, [])

  const filtered = orders.filter((o) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      !searchTerm ||
      o.id.toLowerCase().includes(term) ||
      (o.customer && o.customer.toLowerCase().includes(term)) ||
      (o.tailor && o.tailor.toLowerCase().includes(term)) ||
      (o.item && o.item.toLowerCase().includes(term))

    const isDelayed = o.status === 'Delayed' || new Date(o.deliveryDate) < new Date()
    const isUrgent = Boolean(o.urgent)

    if (filter === 'delayed') return matchesSearch && isDelayed
    if (filter === 'urgent') return matchesSearch && isUrgent
    if (filter === 'active') return matchesSearch && !['Delivered', 'Completed', 'Cancelled'].includes(o.status)
    return matchesSearch
  })

  return (
    <DashboardLayout role="admin">
      <div className="page-header">
        <div>
          <h1>Platform Order Oversight & SLA Exception Monitoring</h1>
          <p>Supervise active marketplace orders, track delayed SLA risks, manage dispute escalations, and reassign stalled projects.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/admin/order-assignment">
            <Button variant="primary">🔄 Order Reassignment Tool</Button>
          </Link>
          <Link to="/admin/complaints">
            <Button variant="outline">⚠️ Review Disputes</Button>
          </Link>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="card" style={{ marginBottom: 20, padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 8 }}>
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
              className={`btn btn-sm ${filter === 'delayed' ? 'btn-danger' : 'btn-outline'}`}
              onClick={() => setFilter('delayed')}
            >
              ⚠️ Delayed / At Risk ({orders.filter(o => o.status === 'Delayed' || new Date(o.deliveryDate) < new Date()).length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filter === 'urgent' ? 'btn-danger' : 'btn-outline'}`}
              onClick={() => setFilter('urgent')}
            >
              🔥 Urgent SLA ({orders.filter(o => o.urgent).length})
            </button>
          </div>

          <div style={{ width: 260 }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search ID, customer, tailor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '6px 12px', fontSize: 13 }}
            />
          </div>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Assigned Tailor</th>
                <th>Garment Specification</th>
                <th>Due Date</th>
                <th>Amount (Escrow)</th>
                <th>Priority</th>
                <th>Current Status</th>
                <th style={{ textAlign: 'right' }}>Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ padding: 36, textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No orders found matching this filter.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const isDelayed = order.status === 'Delayed' || new Date(order.deliveryDate) < new Date()

                  return (
                    <tr key={order.id} style={{ backgroundColor: isDelayed ? '#FFFDFD' : undefined }}>
                      <td>
                        <strong style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>#{order.id}</strong>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{order.customer}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>📞 {order.customerPhone || '9876543210'}</div>
                      </td>
                      <td>
                        <div><strong>{order.tailor}</strong></div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{order.tailorShop}</div>
                      </td>
                      <td>
                        <div>{order.item || order.designName}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{order.category}</div>
                      </td>
                      <td>
                        <strong style={{ color: isDelayed ? 'var(--danger)' : 'var(--text-main)' }}>
                          {order.deliveryDate}
                        </strong>
                        {isDelayed && (
                          <span style={{ fontSize: 10, color: 'var(--danger)', display: 'block', fontWeight: 700 }}>
                            SLA DELAYED
                          </span>
                        )}
                      </td>
                      <td>
                        <strong>₹{order.amount}</strong>
                      </td>
                      <td>
                        {order.urgent ? (
                          <span className="status-badge badge-urgent" style={{ fontSize: 10 }}>🔥 Urgent</span>
                        ) : (
                          <span className="status-badge" style={{ fontSize: 10 }}>Normal</span>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={order.status} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <Link to={`/tracking/${order.id}`}>
                            <Button size="sm" variant="outline">
                              Inspect Tracker
                            </Button>
                          </Link>
                          <Link to={`/admin/order-assignment?orderId=${order.id}`}>
                            <Button size="sm" variant="secondary">
                              Reassign
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
