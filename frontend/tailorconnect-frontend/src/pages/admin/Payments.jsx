import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import * as storage from '../../services/storageService'
import Button from '../../components/Button'

export default function AdminPayments() {
  const [payments, setPayments] = useState([])
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    const raw = storage.getPayments ? storage.getPayments() : []
    if (raw.length > 0) {
      setPayments(raw)
    } else {
      setPayments([
        { id: 'PAY-ORD-1001', transactionId: 'TXN-TC-20260820-9921', userName: 'Priya Sharma', tailorName: 'Lakshmi Devi', title: 'Silk Bridal Blouse', amount: 1800, date: '2026-08-20', status: 'Successful', method: 'UPI', refundStatus: 'None' },
        { id: 'PAY-ORD-1003', transactionId: 'TXN-TC-20260801-4412', userName: 'Anitha Raj', tailorName: 'Suresh Kumar', title: 'Designer Lehenga', amount: 3200, date: '2026-08-01', status: 'Successful', method: 'Card', refundStatus: 'None' },
        { id: 'PAY-ORD-1004', transactionId: 'TXN-TC-20260705-1122', userName: 'Divya Kumar', tailorName: 'Grace Mary', title: 'Bridal Blouse & Veil Set', amount: 2200, date: '2026-07-05', status: 'Successful', method: 'UPI', refundStatus: 'None' }
      ])
    }
  }, [])

  const totalVolume = payments.reduce((acc, p) => acc + Number(p.amount || 0), 0)
  const totalCommission = Math.round(totalVolume * 0.1)
  const tailorPayouts = totalVolume - totalCommission

  const handleRefund = (payId) => {
    const updated = payments.map(p => p.id === payId ? { ...p, refundStatus: 'Refund Processed (₹' + p.amount + ')' } : p)
    setPayments(updated)
    setSuccessMsg(`Refund for transaction #${payId} issued to customer via original payment method.`)
    setTimeout(() => setSuccessMsg(''), 4000)
  }

  return (
    <DashboardLayout role="admin">
      <div className="page-header">
        <div>
          <h1>Platform Payments & Escrow Ledger</h1>
          <p>Monitor all transaction volume, platform commissions (10%), refund requests, and tailor payout settlements.</p>
        </div>
      </div>

      {successMsg && (
        <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '12px 16px', borderRadius: 8, marginBottom: 20 }}>
          ✅ {successMsg}
        </div>
      )}

      {/* METRICS CARDS */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <h3>Total Platform GMV</h3>
          <div className="stat-value" style={{ color: 'var(--primary)' }}>₹{totalVolume}</div>
          <span className="stat-subtitle">Gross merchandise volume</span>
        </div>
        <div className="stat-card">
          <h3>Platform Commission (10%)</h3>
          <div className="stat-value" style={{ color: 'var(--success)' }}>₹{totalCommission}</div>
          <span className="stat-subtitle">Net TailorConnect platform revenue</span>
        </div>
        <div className="stat-card">
          <h3>Tailor Payouts</h3>
          <div className="stat-value" style={{ color: 'var(--primary-dark)' }}>₹{tailorPayouts}</div>
          <span className="stat-subtitle">Settled to boutique accounts</span>
        </div>
        <div className="stat-card">
          <h3>Refund Requests</h3>
          <div className="stat-value" style={{ color: 'var(--text-muted)' }}>0 Pending</div>
          <span className="stat-subtitle">All dispute resolutions settled</span>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--primary-light)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Payment ID</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Customer</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Tailor Boutique</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Service</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Gross Amount</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Commission (10%)</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Method</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Status</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(pay => (
                <tr key={pay.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)', fontSize: 13 }}>{pay.id}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}><strong>{pay.userName}</strong></td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>{pay.tailorName}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>{pay.title}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700 }}>₹{pay.amount}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>₹{Math.round(pay.amount * 0.1)}</td>
                  <td style={{ padding: '14px 16px', fontSize: 12.5 }}>{pay.method}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>
                    <span className="badge badge-active">{pay.status}</span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    {pay.refundStatus && pay.refundStatus.includes('Refund') ? (
                      <span className="badge badge-cancelled">{pay.refundStatus}</span>
                    ) : (
                      <Button size="sm" variant="secondary" onClick={() => handleRefund(pay.id)}>
                        Issue Refund
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
