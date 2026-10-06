import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import * as storage from '../../services/storageService'
import ProgressBar from '../../components/ProgressBar'
import StatusBadge from '../../components/StatusBadge'
import Button from '../../components/Button'

export const PRODUCTION_STAGES = [
  { key: 'Request Created', label: 'Request Created', desc: 'Custom dress order specification submitted with measurements.' },
  { key: 'Quotation Received', label: 'Quotation Received', desc: 'Verified master tailors reviewed requirements and submitted bids.' },
  { key: 'Tailor Selected', label: 'Tailor Selected', desc: 'Customer finalized tailor offer and delivery timeline.' },
  { key: 'Payment Completed', label: 'Payment Completed', desc: 'Payment placed in secure platform escrow guarantee.' },
  { key: 'Measurement Confirmed', label: 'Measurement Confirmed', desc: 'Fitting parameters and margin allowance locked with studio.' },
  { key: 'Fabric Confirmed', label: 'Fabric Confirmed', desc: 'Fabric material inspected, pre-washed, and cut-marked.' },
  { key: 'Cutting', label: 'Cutting', desc: 'Precision drafting and pattern cutting completed.' },
  { key: 'Stitching', label: 'Stitching', desc: 'Main bodice, panels, side seams, and piping stitched.' },
  { key: 'Aari / Embroidery', label: 'Aari / Embroidery', desc: 'Intricate needlework, zari thread, and stone border work.' },
  { key: 'Quality Check', label: 'Quality Check', desc: 'Measurement adherence and symmetry verified against specification.' },
  { key: 'Ready', label: 'Ready', desc: 'Garment steam-pressed and packed in protective cover.' },
  { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Dispatched with logistics tracking to customer address.' },
  { key: 'Delivered', label: 'Delivered', desc: 'Order delivered safely to customer doorstep.' }
]

export default function OrderTracking() {
  const { id } = useParams()
  const { user } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadOrder = () => {
    const list = storage.getOrders()
    const found = list.find(o => String(o.id) === String(id)) || list[0]
    setOrder(found)
    setLoading(false)
  }

  useEffect(() => {
    loadOrder()
    const handleDataChange = () => loadOrder()
    window.addEventListener('tc_data_changed', handleDataChange)
    return () => window.removeEventListener('tc_data_changed', handleDataChange)
  }, [id])

  if (loading) {
    return (
      <DashboardLayout role={user?.role || 'customer'}>
        <div style={{ padding: 40, textAlign: 'center' }}>Loading live tracking data...</div>
      </DashboardLayout>
    )
  }

  if (!order) {
    return (
      <DashboardLayout role={user?.role || 'customer'}>
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <h2>Order Not Found</h2>
          <p>The requested order tracking ID was not found in the platform database.</p>
          <Link to="/customer/orders">
            <Button variant="primary">View All Orders</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  // Calculate current stage index
  const stageIndex = PRODUCTION_STAGES.findIndex(s => s.key === order.status || s.label === order.status)
  const activeStageIdx = stageIndex !== -1 ? stageIndex : 4 // Default to Stitching if customized status
  const progressPercent = Math.round(((activeStageIdx + 1) / PRODUCTION_STAGES.length) * 100)

  // Calculate days remaining & delivery risk
  const deliveryDateObj = new Date(order.deliveryDate || '2026-09-10')
  const today = new Date()
  const diffTime = deliveryDateObj - today
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const isDeliveryRisk = daysRemaining <= 2 && activeStageIdx < 6

  return (
    <DashboardLayout role={user?.role || 'customer'}>
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1>Live Production Timeline: #{order.id}</h1>
            <StatusBadge status={order.status} />
            {order.urgent && <span className="status-badge badge-urgent">🔥 Urgent SLA</span>}
            {isDeliveryRisk && <span className="status-badge badge-risk">⚠️ Delivery Risk</span>}
          </div>
          <p>Real-time 10-stage production tracking and milestone verification from master tailor studio.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to={`/customer/chat?recipient=${encodeURIComponent(order.tailor || 'Tailor')}&orderId=${order.id}`}>
            <Button variant="secondary">💬 Chat with Tailor</Button>
          </Link>
          <Link to="/customer/orders">
            <Button variant="outline">← Back to Orders</Button>
          </Link>
        </div>
      </div>

      {/* DELIVERY RISK WARNING BANNER (IF APPLICABLE) */}
      {isDeliveryRisk && (
        <div 
          style={{ 
            background: 'var(--warning-bg)', 
            border: '1px solid var(--warning-border)', 
            padding: '12px 18px', 
            borderRadius: 8, 
            marginBottom: 24, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}
        >
          <div>
            <strong style={{ color: 'var(--danger)', fontSize: 13 }}>⚠️ Delivery Risk Alert:</strong>
            <span style={{ fontSize: 13, color: 'var(--text-main)', marginLeft: 6 }}>
              Target delivery is in <strong>{daysRemaining} day(s)</strong> and needlework is currently in progress. Artisan studio has expedited production.
            </span>
          </div>
          <Link to={`/customer/chat?recipient=${encodeURIComponent(order.tailor || 'Tailor')}&orderId=${order.id}`}>
            <Button size="sm" variant="outline" style={{ background: '#FFFFFF' }}>Inquire Timeline</Button>
          </Link>
        </div>
      )}

      {/* ORDER SUMMARY & PROGRESS HEADER */}
      <div className="card" style={{ marginBottom: 28, padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18, marginBottom: 20 }}>
          <div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block' }}>Garment Specification</span>
            <strong style={{ fontSize: 16, color: 'var(--text-main)' }}>{order.item || order.designName}</strong>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{order.category} • {order.fabric}</div>
          </div>
          <div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block' }}>Assigned Master Tailor</span>
            <strong style={{ fontSize: 15, color: 'var(--text-main)' }}>{order.tailor || order.tailorShop}</strong>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Studio Hotline: {order.tailorPhone || '9876543211'}</div>
          </div>
          <div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block' }}>Required Delivery Date</span>
            <strong style={{ fontSize: 15, color: 'var(--primary)' }}>{order.deliveryDate}</strong>
            <div style={{ fontSize: 12, color: daysRemaining >= 0 ? 'var(--text-secondary)' : 'var(--danger)' }}>
              {daysRemaining >= 0 ? `${daysRemaining} days remaining` : 'Delayed'}
            </div>
          </div>
          <div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block' }}>Escrow Payment Status</span>
            <strong style={{ fontSize: 15, color: 'var(--success)' }}>₹{order.amount} (Secured)</strong>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Paid via UPI / Escrow Protection</div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
            <span>Production Progress ({activeStageIdx + 1} of 10 Milestones Complete)</span>
            <strong style={{ color: 'var(--primary)' }}>{progressPercent}% Complete</strong>
          </div>
          <ProgressBar value={progressPercent} height={10} color="var(--primary)" />
        </div>
      </div>

      {/* 10-STAGE VERTICAL TIMELINE */}
      <div className="card" style={{ padding: 28, maxWidth: 840 }}>
        <h2 style={{ fontSize: 18, marginBottom: 20 }}>10-Stage Stitching Lifecycle</h2>

        <div className="timeline-pipeline">
          {PRODUCTION_STAGES.map((stage, idx) => {
            const isCompleted = idx < activeStageIdx
            const isActive = idx === activeStageIdx

            return (
              <div
                key={stage.key}
                className={`timeline-stage-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
              >
                <div className="timeline-stage-node">
                  {isCompleted ? '✓' : idx + 1}
                </div>

                <div className="timeline-stage-content">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
                    <div className="timeline-stage-title" style={{ color: isActive ? 'var(--primary-dark)' : undefined }}>
                      {idx + 1}. {stage.label}
                    </div>
                    {isActive && (
                      <span className="status-badge" style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', fontSize: 11 }}>
                        Current Stage
                      </span>
                    )}
                    {isCompleted && (
                      <span style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600 }}>
                        ✓ Verified Complete
                      </span>
                    )}
                  </div>
                  <div className="timeline-stage-desc">
                    {stage.desc}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
