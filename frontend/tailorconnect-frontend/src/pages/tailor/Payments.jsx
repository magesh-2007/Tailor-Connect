import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import * as storage from '../../services/storageService'
import Button from '../../components/Button'

export default function TailorPayments() {
  const [payments, setPayments] = useState([])
  const [payoutRequested, setPayoutRequested] = useState(false)

  const loadData = () => {
    const raw = storage.getPayments ? storage.getPayments() : []
    if (raw.length > 0) {
      setPayments(raw)
    } else {
      const defaultPays = [
        {
          id: 'PAY-ORD-1001',
          transactionId: 'TXN-TC-20260820-9921',
          orderId: 'ORD-1001',
          customerName: 'Priya Sharma',
          title: 'Silk Bridal Blouse (Aari Needlework)',
          amount: 1800,
          platformCommission: 180,
          netEarnings: 1620,
          date: '2026-08-20',
          status: 'Settled',
          method: 'UPI'
        },
        {
          id: 'PAY-ORD-1004',
          transactionId: 'TXN-TC-20260705-1122',
          orderId: 'ORD-1004',
          customerName: 'Divya Kumar',
          title: 'Bridal Blouse & Veil Set',
          amount: 2200,
          platformCommission: 220,
          netEarnings: 1980,
          date: '2026-07-05',
          status: 'Settled',
          method: 'Card'
        }
      ]
      setPayments(defaultPays)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const grossEarnings = payments.reduce((acc, p) => acc + Number(p.amount || 0), 0)
  const totalCommission = Math.round(grossEarnings * 0.10)
  const netEarnings = grossEarnings - totalCommission

  const handleRequestPayout = () => {
    setPayoutRequested(true)
    setTimeout(() => setPayoutRequested(false), 4000)
  }

  return (
    <DashboardLayout role="tailor">
      <div className="page-header">
        <div>
          <h1>Tailor Studio Earnings & Payouts</h1>
          <p>Track order revenue, platform commission deduction (10%), and bank account payout transfers.</p>
        </div>
        <Button variant="primary" onClick={handleRequestPayout}>
          💸 Request Bank Payout (₹{netEarnings})
        </Button>
      </div>

      {payoutRequested && (
        <div style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success)', padding: '12px 16px', borderRadius: 8, marginBottom: 20 }}>
          ✅ Payout request for ₹{netEarnings} submitted to admin! Funds will be transferred to your registered bank account within 24 hours.
        </div>
      )}

      {/* 4 REVENUE METRICS */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <h3>Gross Revenue</h3>
          <div className="stat-value" style={{ color: 'var(--primary)' }}>₹{grossEarnings}</div>
          <span className="stat-subtitle">Total payments received from clients</span>
        </div>
        <div className="stat-card">
          <h3>Platform Commission (10%)</h3>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>₹{totalCommission}</div>
          <span className="stat-subtitle">Platform service fee & escrow</span>
        </div>
        <div className="stat-card">
          <h3>Net Studio Earnings</h3>
          <div className="stat-value" style={{ color: 'var(--success)' }}>₹{netEarnings}</div>
          <span className="stat-subtitle">Available for instant bank withdrawal</span>
        </div>
        <div className="stat-card">
          <h3>Settled Orders</h3>
          <div className="stat-value">{payments.length}</div>
          <span className="stat-subtitle">All transactions verified & paid</span>
        </div>
      </div>

      {/* REVENUE BREAKDOWN TABLE */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--primary-light)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Payment ID</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Customer</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Item / Service</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Gross (₹)</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Comm. 10%</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Net Earned</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Date</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(pay => {
                const gross = Number(pay.amount || 0)
                const comm = Math.round(gross * 0.1)
                const net = gross - comm
                return (
                  <tr key={pay.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)', fontSize: 13 }}>
                      {pay.id}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13 }}>
                      <strong>{pay.customerName || pay.userName || 'Priya Sharma'}</strong>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13 }}>
                      {pay.title}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600 }}>
                      ₹{gross}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--warning)' }}>
                      -₹{comm}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: 'var(--success)' }}>
                      ₹{net}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12.5 }}>
                      {pay.date?.split(',')[0] || '2026-08-20'}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <span className="badge badge-active">✓ Settled</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
