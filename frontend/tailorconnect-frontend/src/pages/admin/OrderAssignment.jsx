import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import * as storage from '../../services/storageService'
import Button from '../../components/Button'
import StatusBadge from '../../components/StatusBadge'

export default function AdminOrderAssignment() {
  const [orders, setOrders] = useState([])
  const [tailors, setTailors] = useState([])
  const [reassignOrder, setReassignOrder] = useState(null)
  const [targetTailorId, setTargetTailorId] = useState('user-tailor-1')
  const [reassignReason, setReassignReason] = useState('Tailor schedule overload / express deadline priority')
  const [successMsg, setSuccessMsg] = useState('')

  const loadData = () => {
    setOrders(storage.getOrders())
    setTailors(storage.getTailors())
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleReassignSubmit = (e) => {
    e.preventDefault()
    if (!reassignOrder) return

    const selectedTailorObj = tailors.find(t => t.id === targetTailorId) || tailors[0]

    // Update in storage
    const allOrders = storage.getOrders()
    const updatedOrders = allOrders.map(o => {
      if (o.id === reassignOrder.id) {
        return {
          ...o,
          tailor: selectedTailorObj.name,
          tailorId: selectedTailorObj.id,
          tailorShop: selectedTailorObj.shopName,
          status: 'Tailor Selected',
          specialInstructions: `${o.specialInstructions || ''} [Reassigned by Admin: ${reassignReason}]`
        }
      }
      return o
    })

    localStorage.setItem('tc_orders_data', JSON.stringify(updatedOrders))
    setSuccessMsg(`Order #${reassignOrder.id} successfully reassigned to ${selectedTailorObj.name} (${selectedTailorObj.shopName})!`)
    setReassignOrder(null)
    loadData()
    setTimeout(() => setSuccessMsg(''), 4000)
  }

  return (
    <DashboardLayout role="admin">
      <div className="page-header">
        <div>
          <h1>Order Assignment & Exception Management</h1>
          <p>Monitor urgent/delayed orders, handle boutique exceptions, and reassign master tailors when required.</p>
        </div>
      </div>

      {successMsg && (
        <div style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success)', padding: '12px 16px', borderRadius: 8, marginBottom: 20 }}>
          ✅ {successMsg}
        </div>
      )}

      {/* ORDERS ASSIGNMENT TABLE */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--primary-light)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Order ID</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Customer</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Garment Item</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Currently Assigned Tailor</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Target Delivery</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Priority</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Status</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)', fontSize: 13 }}>
                    {order.id}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>
                    <strong>{order.customer}</strong>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>📞 {order.customerPhone}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>
                    <strong>{order.item || order.designName}</strong>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{order.category}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>
                    <strong style={{ color: 'var(--primary-dark)' }}>{order.tailor}</strong>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{order.tailorShop}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>
                    {order.deliveryDate}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 12 }}>
                    {order.urgent ? (
                      <span className="badge badge-urgent">🔥 Urgent Priority</span>
                    ) : (
                      <span className="tag">Normal Queue</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>
                    <StatusBadge status={order.status} />
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <Button size="sm" variant="primary" onClick={() => { setReassignOrder(order); setTargetTailorId(order.tailorId); }}>
                      🔄 Reassign Tailor
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REASSIGN MODAL */}
      {reassignOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: 20
        }}>
          <div className="card" style={{ maxWidth: 500, width: '100%', padding: 24 }}>
            <div className="flex-between" style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, color: 'var(--primary-dark)', margin: 0 }}>
                Reassign Order #{reassignOrder.id}
              </h2>
              <button 
                type="button" 
                onClick={() => setReassignOrder(null)}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReassignSubmit}>
              <div style={{ background: 'var(--bg-page)', padding: 12, borderRadius: 6, marginBottom: 14, fontSize: 13, border: '1px solid var(--border-light)' }}>
                <div><strong>Garment:</strong> {reassignOrder.item}</div>
                <div><strong>Current Tailor:</strong> {reassignOrder.tailor}</div>
                <div><strong>Client Target Date:</strong> {reassignOrder.deliveryDate}</div>
              </div>

              <div className="form-group" style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Select New Master Tailor *</label>
                <select
                  className="form-control"
                  value={targetTailorId}
                  onChange={(e) => setTargetTailorId(e.target.value)}
                >
                  {tailors.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.shopName || t.name} ({t.location}) - {t.experience || '8 yrs'} Exp ★ {t.rating || 4.9}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Administrative Reassignment Reason *</label>
                <textarea 
                  className="form-control"
                  rows={2}
                  value={reassignReason}
                  onChange={(e) => setReassignReason(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <Button variant="secondary" type="button" onClick={() => setReassignOrder(null)}>Cancel</Button>
                <Button variant="primary" type="submit">Confirm Reassignment</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
