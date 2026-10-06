import React, { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import * as storage from '../../services/storageService'
import Button from '../../components/Button'
import StatusBadge from '../../components/StatusBadge'

export default function Payment() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()

  const orderId = searchParams.get('orderId') || 'ORD-101'
  const tailor = searchParams.get('tailor') || 'Lakshmi Devi (Lakshmi Stitches)'
  const item = searchParams.get('item') || 'Silk Bridal Blouse with Aari Work'
  const rawAmount = Number(searchParams.get('amount')) || 1800

  const platformFee = 50
  const gst = Math.round(rawAmount * 0.05)
  const totalPayable = rawAmount + platformFee + gst

  const [paymentMethod, setPaymentMethod] = useState('upi') // 'upi' | 'card' | 'netbanking'
  const [upiApp, setUpiApp] = useState('gpay')
  const [upiId, setUpiId] = useState('user@okaxis')
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8921')
  const [cardExpiry, setCardExpiry] = useState('08/29')
  const [cardCvv, setCardCvv] = useState('•••')
  const [bank, setBank] = useState('HDFC Bank')
  const [processing, setProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [generatedPaymentId, setGeneratedPaymentId] = useState('')

  const handlePayNow = (e) => {
    e.preventDefault()
    setProcessing(true)

    setTimeout(() => {
      const pId = `PAY-${Date.now().toString().slice(-6)}`
      setGeneratedPaymentId(pId)

      // Record payment in storage
      if (storage.createPayment) {
        storage.createPayment({
          paymentId: pId,
          orderId,
          customer: user?.name || 'Priya Sharma',
          tailor,
          amount: totalPayable,
          platformFee,
          status: 'Paid',
          date: new Date().toISOString().split('T')[0]
        })
      }

      // Update order status to Fabric / Cutting in production
      storage.updateOrderStatus(orderId, 'Fabric')

      setProcessing(false)
      setPaymentSuccess(true)
    }, 1200)
  }

  return (
    <DashboardLayout role={user?.role || 'customer'}>
      <div className="page-header">
        <div>
          <h1>Secure Escrow Payment Gateway</h1>
          <p>Your funds are held securely in platform escrow and released to the tailor upon verified stitching completion and delivery.</p>
        </div>
      </div>

      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        {!paymentSuccess ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 24 }}>
            {/* PAYMENT METHOD SELECTOR & FORM */}
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 17, marginBottom: 16 }}>Select Payment Method</h2>

              {/* PAYMENT METHOD TABS: UPI, Card, Net Banking */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
                <button
                  type="button"
                  className={`btn btn-sm ${paymentMethod === 'upi' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  📱 UPI
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${paymentMethod === 'card' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  💳 Card
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${paymentMethod === 'netbanking' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setPaymentMethod('netbanking')}
                >
                  🏦 Net Banking
                </button>
              </div>

              <form onSubmit={handlePayNow}>
                {/* UPI FORM */}
                {paymentMethod === 'upi' && (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
                      {['gpay', 'phonepe', 'paytm'].map(app => (
                        <div
                          key={app}
                          style={{
                            padding: 10,
                            borderRadius: 6,
                            border: upiApp === app ? '2px solid var(--primary)' : '1px solid var(--border)',
                            background: upiApp === app ? 'var(--bg-hover)' : 'var(--bg-card)',
                            textAlign: 'center',
                            cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: 600,
                            textTransform: 'uppercase'
                          }}
                          onClick={() => setUpiApp(app)}
                        >
                          {app === 'gpay' ? 'Google Pay' : app === 'phonepe' ? 'PhonePe' : 'Paytm UPI'}
                        </div>
                      ))}
                    </div>

                    <div className="form-group">
                      <label className="form-label">UPI ID / VPA <span className="required">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="yourname@okhdfcbank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* CARD FORM */}
                {paymentMethod === 'card' && (
                  <div>
                    <div className="form-group">
                      <label className="form-label">Card Number <span className="required">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Expiry (MM/YY) <span className="required">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV <span className="required">*</span></label>
                        <input
                          type="password"
                          maxLength="4"
                          className="form-control"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* NET BANKING FORM */}
                {paymentMethod === 'netbanking' && (
                  <div className="form-group">
                    <label className="form-label">Select Bank <span className="required">*</span></label>
                    <select className="form-control" value={bank} onChange={(e) => setBank(e.target.value)}>
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="Axis Bank">Axis Bank</option>
                    </select>
                  </div>
                )}

                <div style={{ background: 'var(--bg-subtle)', padding: 12, borderRadius: 6, border: '1px solid var(--border-light)', marginBottom: 20, fontSize: 12, color: 'var(--text-secondary)' }}>
                  🔒 256-Bit SSL Encrypted Escrow Protection. 100% money back guarantee if stitching fails fitting criteria.
                </div>

                <Button type="submit" variant="primary" block size="lg" disabled={processing}>
                  {processing ? 'Processing Payment...' : `Pay ₹${totalPayable.toLocaleString()} via Escrow →`}
                </Button>
              </form>
            </div>

            {/* ORDER INVOICE SUMMARY */}
            <div className="card" style={{ padding: 22, height: 'fit-content' }}>
              <h3 style={{ fontSize: 16, marginBottom: 14 }}>Order Summary</h3>

              <div style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
                <div><strong>Order Ref:</strong> #{orderId}</div>
                <div><strong>Garment:</strong> {item}</div>
                <div><strong>Master Tailor:</strong> {tailor}</div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 12, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Stitching & Material:</span>
                  <strong>₹{rawAmount}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Platform Escrow Fee:</span>
                  <strong>₹{platformFee}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>GST (5%):</span>
                  <strong>₹{gst}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: 'var(--primary)', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                  <span>Total Payable:</span>
                  <span>₹{totalPayable.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* PAYMENT SUCCESS RECEIPT */
          <div className="card" style={{ padding: 36, textAlign: 'center' }}>
            <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'var(--success-bg)', color: 'var(--success)', fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              ✓
            </div>

            <h2 style={{ fontSize: 24, color: 'var(--text-main)', marginBottom: 6 }}>
              Payment Successful & Escrow Secured!
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
              Payment reference <strong>#{generatedPaymentId}</strong> of <strong>₹{totalPayable}</strong> has been secured in escrow. Tailor studio has received confirmation to begin fabric cutting.
            </p>

            {/* RECEIPT DATA TABLE */}
            <div style={{ background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: 8, padding: 18, maxWidth: 520, margin: '0 auto 28px auto', textAlign: 'left', fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Payment ID:</span>
                <strong>{generatedPaymentId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Order ID:</span>
                <strong>#{orderId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Customer:</span>
                <strong>{user?.name || 'Priya Sharma'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Tailor Studio:</span>
                <strong>{tailor}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Amount:</span>
                <strong style={{ color: 'var(--primary)' }}>₹{totalPayable}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                <StatusBadge status="Paid" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Link to={`/tracking/${orderId}`}>
                <Button variant="primary" size="lg">
                  Track 10-Stage Production Live →
                </Button>
              </Link>
              <Link to="/customer/dashboard">
                <Button variant="outline" size="lg">
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
