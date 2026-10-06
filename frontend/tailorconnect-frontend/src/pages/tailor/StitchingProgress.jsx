import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import * as storage from '../../services/storageService'
import ProgressBar from '../../components/ProgressBar'
import StatusBadge from '../../components/StatusBadge'
import Button from '../../components/Button'

export const PRODUCTION_STAGES = [
  'Request',
  'Measurement',
  'Fabric',
  'Cutting',
  'Stitching',
  'Aari / Embroidery',
  'Finishing',
  'Quality Check',
  'Ready',
  'Delivery'
]

export default function StitchingProgress() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const highlightOrderId = searchParams.get('orderId')
  
  const [orders, setOrders] = useState([])
  const [successMsg, setSuccessMsg] = useState('')

  // Tailor Capacity Management State
  const [maxDailyOrders, setMaxDailyOrders] = useState(5)
  const [urgentOrderAvailable, setUrgentOrderAvailable] = useState(true)

  const loadData = () => {
    if (!user) return
    const myOrders = storage.getOrdersForTailor(user.id)
    setOrders(myOrders)
  }

  useEffect(() => {
    loadData()
    const handleDataChange = () => loadData()
    window.addEventListener('tc_data_changed', handleDataChange)
    return () => window.removeEventListener('tc_data_changed', handleDataChange)
  }, [user])

  const handleStageChange = (orderId, newStage) => {
    storage.updateOrderStatus(orderId, newStage)
    
    // Calculate progress %
    const stageIdx = PRODUCTION_STAGES.findIndex(s => s === newStage)
    if (stageIdx !== -1) {
      const percent = Math.round(((stageIdx + 1) / PRODUCTION_STAGES.length) * 100)
      storage.updateOrderProgress(orderId, percent)
    }

    setSuccessMsg(`Order #${orderId} stage transitioned to "${newStage}" successfully. Customer tracking updated.`)
    loadData()
    setTimeout(() => setSuccessMsg(''), 3500)
  }

  const currentWorkload = orders.filter(o => !['Delivered', 'Completed', 'Cancelled'].includes(o.status)).length
  const availableSlots = Math.max(0, maxDailyOrders - currentWorkload)
  const isOverloaded = availableSlots <= 1

  return (
    <DashboardLayout role="tailor">
      <div className="page-header">
        <div>
          <h1>10-Stage Production Queue & Capacity Management</h1>
          <p>Advance garments through the 10 production milestones, manage daily workload thresholds, and monitor delivery risk alerts.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/tailor/orders">
            <Button variant="outline">Customized Orders Table</Button>
          </Link>
          <Link to="/tailor/services">
            <Button variant="secondary">Services Catalog</Button>
          </Link>
        </div>
      </div>

      {successMsg && (
        <div style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success-border)', padding: '12px 18px', borderRadius: 8, marginBottom: 20 }}>
          ✅ {successMsg}
        </div>
      )}

      {/* CAPACITY & WORKLOAD METRICS PANEL */}
      <div className="card" style={{ marginBottom: 24, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h3 style={{ fontSize: 16, margin: 0 }}>Studio Capacity & Workload Balance</h3>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Defines visibility in customer recommendations and prevents bottleneck delays</span>
          </div>
          <div>
            {isOverloaded ? (
              <span className="status-badge" style={{ background: 'var(--warning-bg)', color: 'var(--warning)', fontWeight: 700 }}>
                ⚠️ Limited Capacity
              </span>
            ) : (
              <span className="status-badge" style={{ background: 'var(--success-bg)', color: 'var(--success)', fontWeight: 700 }}>
                ✓ Normal Capacity
              </span>
            )}
            {!urgentOrderAvailable && (
              <span className="status-badge" style={{ background: 'var(--danger-bg)', color: 'var(--danger)', marginLeft: 8, fontWeight: 700 }}>
                Urgent orders unavailable
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Maximum Daily Orders:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <input
                type="number"
                min="1"
                max="20"
                className="form-control"
                style={{ width: 90, padding: '4px 8px' }}
                value={maxDailyOrders}
                onChange={(e) => setMaxDailyOrders(Number(e.target.value))}
              />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Slots / Day</span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Current Workload:</span>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)', marginTop: 4 }}>
              {currentWorkload} Active Orders
            </div>
          </div>

          <div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Available Slots:</span>
            <div style={{ fontSize: 18, fontWeight: 700, color: availableSlots > 0 ? 'var(--success)' : 'var(--danger)', marginTop: 4 }}>
              {availableSlots} Available
            </div>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', marginTop: 12 }}>
              <input
                type="checkbox"
                checked={urgentOrderAvailable}
                onChange={(e) => setUrgentOrderAvailable(e.target.checked)}
              />
              Accept Urgent 48h Orders
            </label>
          </div>
        </div>
      </div>

      {/* PRODUCTION ORDERS QUEUE CARDS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {orders.map(order => {
          const currentStageKey = order.status
          const currentStageIdx = PRODUCTION_STAGES.findIndex(s => s === currentStageKey || (currentStageKey === 'Request Received' && s === 'Request'))
          const validIdx = currentStageIdx !== -1 ? currentStageIdx : 4

          // Delivery deadline & risk calculation
          const deliveryDateObj = new Date(order.deliveryDate || '2026-09-10')
          const today = new Date()
          const diffTime = deliveryDateObj - today
          const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          const isDeliveryRisk = daysRemaining <= 2 && validIdx < 6

          return (
            <div 
              className="card" 
              key={order.id} 
              style={{ 
                padding: 22,
                border: highlightOrderId === order.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                backgroundColor: isDeliveryRisk ? '#FFFDFD' : '#FFFFFF'
              }}
            >
              <div className="flex-between" style={{ marginBottom: 14, alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4 }}>
                    <h3 style={{ fontSize: 18, color: 'var(--text-main)', margin: 0 }}>
                      #{order.id} – {order.item || order.designName}
                    </h3>
                    <StatusBadge status={order.status} />
                    {order.urgent && <span className="status-badge badge-urgent">🔥 Urgent</span>}
                    {isDeliveryRisk && <span className="status-badge badge-risk">⚠️ Delivery Risk</span>}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    Customer: <strong>{order.customer}</strong> (📞 {order.customerPhone || '9876543210'}) • Category: <strong>{order.category}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>₹{order.amount}</div>
                  <div style={{ fontSize: 12, color: daysRemaining >= 0 ? 'var(--text-secondary)' : 'var(--danger)' }}>
                    Due: <strong>{order.deliveryDate}</strong> ({daysRemaining >= 0 ? `${daysRemaining} days left` : 'Overdue'})
                  </div>
                </div>
              </div>

              {/* STAGE TRANSITION BUTTONS (10 PRODUCTION STAGES) */}
              <div style={{ background: 'var(--bg-page)', padding: 14, borderRadius: 8, border: '1px solid var(--border)', marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-main)', marginBottom: 10 }}>
                  🎯 Advance Lifecycle Stage ({validIdx + 1} of 10):
                </label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {PRODUCTION_STAGES.map((st, sIdx) => {
                    const isSelected = order.status === st || (order.status === 'Request Received' && st === 'Request')
                    const isPassed = sIdx <= validIdx

                    return (
                      <button
                        key={st}
                        type="button"
                        className="btn btn-sm"
                        style={{
                          padding: '5px 10px',
                          fontSize: 12,
                          background: isSelected ? 'var(--primary)' : isPassed ? 'var(--success-bg)' : '#FFFFFF',
                          color: isSelected ? '#FFFFFF' : isPassed ? 'var(--success)' : 'var(--text-main)',
                          borderColor: isSelected ? 'var(--primary)' : isPassed ? 'var(--success-border)' : 'var(--border)',
                          fontWeight: isSelected ? 700 : 500
                        }}
                        onClick={() => handleStageChange(order.id, st)}
                      >
                        {sIdx + 1}. {st}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* PROGRESS BAR & CONTROLS */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span>Completion Status</span>
                <strong style={{ color: 'var(--primary)' }}>{Math.round(((validIdx + 1) / 10) * 100)}%</strong>
              </div>
              <ProgressBar value={Math.round(((validIdx + 1) / 10) * 100)} />

              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <Link to={`/tailor/chat?recipient=${encodeURIComponent(order.customer)}&orderId=${order.id}`}>
                  <Button size="sm" variant="outline">💬 Message Customer</Button>
                </Link>
                <Link to={`/tracking/${order.id}`}>
                  <Button size="sm" variant="secondary">View Tracking Screen</Button>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </DashboardLayout>
  )
}
