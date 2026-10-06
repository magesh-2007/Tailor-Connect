import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Button from '../../components/Button'

export default function AdminSettings() {
  const [commissionRate, setCommissionRate] = useState('10')
  const [escrowHoldDays, setEscrowHoldDays] = useState('2')
  const [requireIdVerification, setRequireIdVerification] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [msg, setMsg] = useState('')

  const handleSave = (e) => {
    e.preventDefault()
    setMsg('Platform administrative settings saved successfully!')
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <DashboardLayout role="admin">
      <div className="page-header">
        <div>
          <h1>Platform System Configuration & Rules</h1>
          <p>Configure platform commission rate, tailor escrow protection window, and security compliance policies.</p>
        </div>
      </div>

      {msg && <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: 12, borderRadius: 6, marginBottom: 16 }}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        {/* FINANCIAL & ESCROW RULES */}
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 16, color: 'var(--primary-dark)', marginBottom: 14 }}>💳 Financial & Commission Policies</h2>

          <form onSubmit={handleSave}>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Platform Service Commission (%) *</label>
              <input 
                className="form-control"
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                required
              />
              <span className="muted" style={{ fontSize: 11.5, marginTop: 4, display: 'block' }}>
                Automatically deducted from tailor payouts on completed custom orders.
              </span>
            </div>

            <div className="form-group" style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Escrow Hold Period (Days after delivery) *</label>
              <input 
                className="form-control"
                type="number"
                value={escrowHoldDays}
                onChange={(e) => setEscrowHoldDays(e.target.value)}
                required
              />
              <span className="muted" style={{ fontSize: 11.5, marginTop: 4, display: 'block' }}>
                Days to allow client fitting inspection before releasing funds to tailor.
              </span>
            </div>

            <Button variant="primary" type="submit">Save Financial Rules</Button>
          </form>
        </div>

        {/* SECURITY & MAINTENANCE */}
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 16, color: 'var(--primary-dark)', marginBottom: 14 }}>🛡️ Security & Verification Policy</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input 
                type="checkbox"
                checked={requireIdVerification}
                onChange={(e) => setRequireIdVerification(e.target.checked)}
              />
              <div>
                <strong style={{ fontSize: 13 }}>Mandatory Tailor Document Verification</strong>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Require Aadhaar / GST / Artisan Certificate before tailors can bid on quotes.</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input 
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
              />
              <div>
                <strong style={{ fontSize: 13, color: maintenanceMode ? 'var(--danger)' : 'inherit' }}>
                  Platform Maintenance Mode
                </strong>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Temporarily pause new order placements for system upgrades.</div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
