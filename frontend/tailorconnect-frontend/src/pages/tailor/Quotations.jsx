import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/Button'
import StatusBadge from '../../components/StatusBadge'
import Modal from '../../components/Modal'

export default function TailorQuotations() {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [selectedReq, setSelectedReq] = useState(null)
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [notification, setNotification] = useState('')

  // Submit quote fields
  const [quotedPrice, setQuotedPrice] = useState('1800')
  const [stitchingCost, setStitchingCost] = useState('1400')
  const [materialCost, setMaterialCost] = useState('300')
  const [additionalCharges, setAdditionalCharges] = useState('100')
  const [estimatedDays, setEstimatedDays] = useState('7')
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0])
  const [message, setMessage] = useState('Can start cutting immediately. Double interlock stitch, gold zari piping, and 1.5-inch side margin included.')
  const [urgentConfirmed, setUrgentConfirmed] = useState(true)

  const loadRequests = () => {
    const raw = localStorage.getItem('tc_quotation_requests')
    if (raw) {
      setRequests(JSON.parse(raw))
    } else {
      const defaultReqs = [
        {
          id: 'REQ-1002',
          customerId: 'user-cust-1',
          customerName: 'Priya Sharma',
          customerPhone: '9876543210',
          dressCategory: 'Bridal Blouse',
          serviceName: 'Silk Bridal Blouse (Aari Needlework)',
          description: 'Deep U-neck back design with gold zari embroidery, potli buttons, and double piping.',
          neckPattern: 'Deep U-Neck with Peacock Motif',
          sleeveStyle: 'Elbow Length (11 inch) with heavy border',
          referenceImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
          budgetRange: '₹1500 - ₹2500',
          requiredDate: '2026-09-08',
          orderPriority: 'Normal',
          fabricType: 'Kanchipuram Pure Silk',
          fabricColor: 'Crimson Pink & Antique Gold',
          status: 'pending'
        },
        {
          id: 'REQ-1003',
          customerId: 'user-cust-2',
          customerName: 'Ananya Ramesh',
          customerPhone: '9876543220',
          dressCategory: 'Designer Dress',
          serviceName: 'Can-Can Layered Party Lehenga Choli',
          description: 'Flared lehenga skirt with raw silk choli, back dori with latkan tassels, and sweetheart neckline.',
          neckPattern: 'Sweetheart Neck',
          sleeveStyle: 'Sleeveless with golden piping',
          referenceImage: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=600&auto=format&fit=crop&q=80',
          budgetRange: '₹2500 - ₹4000',
          requiredDate: '2026-09-12',
          orderPriority: 'Urgent',
          fabricType: 'Georgette & Brocade',
          fabricColor: 'Royal Blue & Gold',
          status: 'pending'
        }
      ]
      setRequests(defaultReqs)
      localStorage.setItem('tc_quotation_requests', JSON.stringify(defaultReqs))
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  const openQuoteModal = (req) => {
    setSelectedReq(req)
    setQuotedPrice(req.orderPriority === 'Urgent' ? '2800' : '1800')
    setStitchingCost(req.orderPriority === 'Urgent' ? '2200' : '1400')
    setMaterialCost('300')
    setAdditionalCharges(req.orderPriority === 'Urgent' ? '300' : '100')
    setEstimatedDays(req.orderPriority === 'Urgent' ? '4' : '7')
    setExpectedDeliveryDate(req.requiredDate)
    setUrgentConfirmed(req.orderPriority === 'Urgent')
    setQuoteModalOpen(true)
  }

  const handleSubmitQuote = (e) => {
    e.preventDefault()
    if (!selectedReq) return

    const newQuote = {
      id: `QT-${Date.now().toString().slice(-4)}`,
      requestId: selectedReq.id,
      customerId: selectedReq.customerId,
      customerName: selectedReq.customerName,
      tailorId: user?.id || 'user-tailor-1',
      tailor: user?.name || 'Lakshmi Devi',
      shopName: user?.shopName || 'Lakshmi Stitches Studio',
      rating: user?.rating || 4.9,
      experience: user?.experience || '8 yrs',
      price: Number(quotedPrice),
      stitchingCost: Number(stitchingCost),
      materialCost: Number(materialCost),
      additionalCharges: Number(additionalCharges),
      estimatedDays: Number(estimatedDays),
      deliveryDate: expectedDeliveryDate,
      urgentSupport: urgentConfirmed ? 'Yes – Express Priority Included' : 'Standard Turnaround',
      message,
      dressItem: selectedReq.serviceName,
      fabric: selectedReq.fabricType,
      status: 'pending'
    }

    const quotes = JSON.parse(localStorage.getItem('tc_quotations_data') || '[]')
    quotes.unshift(newQuote)
    localStorage.setItem('tc_quotations_data', JSON.stringify(quotes))

    setNotification(`Quotation offer for #${selectedReq.id} submitted directly to ${selectedReq.customerName}!`)
    setQuoteModalOpen(false)
    setTimeout(() => setNotification(''), 3500)
  }

  return (
    <DashboardLayout role="tailor">
      <div className="page-header">
        <div>
          <h1>Customer Custom Order Requests</h1>
          <p>Review incoming bespoke dress specifications, check material requirements, and submit competitive quotation offers.</p>
        </div>
        <Link to="/tailor/orders">
          <Button variant="outline">View Active Orders</Button>
        </Link>
      </div>

      {notification && (
        <div style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success-border)', padding: '12px 18px', borderRadius: 8, marginBottom: 20 }}>
          ✅ {notification}
        </div>
      )}

      {/* REQUESTS LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {requests.map((req) => (
          <div key={req.id} className="card" style={{ padding: 22 }}>
            <div className="flex-between" style={{ marginBottom: 12, alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <h3 style={{ fontSize: 17, margin: 0, color: 'var(--text-main)' }}>
                    #{req.id} – {req.serviceName}
                  </h3>
                  <StatusBadge status={req.status} />
                  {req.orderPriority === 'Urgent' && <span className="status-badge badge-urgent">🔥 Urgent SLA</span>}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  Customer: <strong>{req.customerName}</strong> (📞 {req.customerPhone}) • Category: <strong>{req.dressCategory}</strong>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block' }}>Customer Budget</span>
                <strong style={{ fontSize: 16, color: 'var(--primary)' }}>{req.budgetRange}</strong>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: 16, marginBottom: 16 }}>
              <div style={{ background: 'var(--bg-page)', padding: 14, borderRadius: 6, border: '1px solid var(--border-light)', fontSize: 13 }}>
                <div style={{ marginBottom: 6 }}>
                  <strong>Neck & Sleeve:</strong> {req.neckPattern || 'Custom'} • {req.sleeveStyle || 'Standard'}
                </div>
                <div style={{ marginBottom: 6 }}>
                  <strong>Fabric:</strong> {req.fabricType} ({req.fabricColor})
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 12.5 }}>
                  <strong>Description:</strong> {req.description}
                </div>
              </div>

              <div style={{ background: 'var(--bg-page)', padding: 14, borderRadius: 6, border: '1px solid var(--border-light)', fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span>Required Date:</span>
                  <strong>{req.requiredDate}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span>Turnaround Priority:</span>
                  <strong style={{ color: req.orderPriority === 'Urgent' ? 'var(--danger)' : 'var(--text-main)' }}>
                    {req.orderPriority}
                  </strong>
                </div>
                {req.referenceImage && (
                  <div style={{ marginTop: 8 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Attached Reference</span>
                    <img src={req.referenceImage} alt="Reference" style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 4 }} />
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Link to={`/tailor/chat?recipient=${encodeURIComponent(req.customerName)}&reqId=${req.id}`}>
                <Button size="sm" variant="outline">
                  💬 Chat with Customer
                </Button>
              </Link>
              <Button size="sm" variant="primary" onClick={() => openQuoteModal(req)}>
                🏷️ Submit Quotation Offer
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* SUBMIT QUOTE MODAL */}
      {quoteModalOpen && selectedReq && (
        <Modal
          title={`Submit Quotation Offer for #${selectedReq.id}`}
          onClose={() => setQuoteModalOpen(false)}
          maxWidth={600}
        >
          <form onSubmit={handleSubmitQuote}>
            <div style={{ background: 'var(--bg-page)', padding: 12, borderRadius: 6, border: '1px solid var(--border)', marginBottom: 16, fontSize: 13 }}>
              <div><strong>Customer:</strong> {selectedReq.customerName}</div>
              <div><strong>Dress:</strong> {selectedReq.serviceName}</div>
              <div><strong>Target Budget:</strong> {selectedReq.budgetRange}</div>
              <div><strong>Required By:</strong> {selectedReq.requiredDate}</div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Total Quoted Price (₹) <span className="required">*</span></label>
                <input
                  type="number"
                  className="form-control"
                  value={quotedPrice}
                  onChange={(e) => setQuotedPrice(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Stitching & Labor Cost (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={stitchingCost}
                  onChange={(e) => setStitchingCost(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Material & Zari Lining (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={materialCost}
                  onChange={(e) => setMaterialCost(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Additional Detailing (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={additionalCharges}
                  onChange={(e) => setAdditionalCharges(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Estimated Days</label>
                <input
                  type="number"
                  className="form-control"
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Expected Delivery Date <span className="required">*</span></label>
                <input
                  type="date"
                  className="form-control"
                  value={expectedDeliveryDate}
                  onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Personal Message / Fit Guarantee</label>
              <textarea
                className="form-control"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Include details about trial fitting, interlock stitching, and lining material..."
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={urgentConfirmed}
                  onChange={(e) => setUrgentConfirmed(e.target.checked)}
                />
                Confirm Expedited Turnaround (Urgent Order SLA Guaranteed)
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <Button variant="outline" size="sm" onClick={() => setQuoteModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm">
                Send Quotation to Customer →
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  )
}
