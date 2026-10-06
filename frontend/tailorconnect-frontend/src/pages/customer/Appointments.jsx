import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import * as storage from '../../services/storageService'
import Button from '../../components/Button'
import StatusBadge from '../../components/StatusBadge'

export default function CustomerAppointments() {
  const { user } = useAuth()
  const [tailors, setTailors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  // Form State: Select Tailor, Select Service, Select Date, Select Time, Purpose, Book
  const [selectedTailorId, setSelectedTailorId] = useState('user-tailor-1')
  const [selectedService, setSelectedService] = useState('Bridal Blouse Measurement & Styling')
  const [selectedDate, setSelectedDate] = useState(new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0])
  const [selectedTime, setSelectedTime] = useState('11:00 AM')
  const [purpose, setPurpose] = useState('Neck pattern finalization & zari embroidery consultation.')

  const servicesList = [
    'Bridal Blouse Measurement & Styling',
    'Aari & Maggam Work Consultation',
    'Silk Fabric Swatch & Color Selection',
    'Bridal Lehenga Fitting & Trial',
    'Custom Stitching & Alteration Check',
    'Doorstep Measurement Visit'
  ]

  const timesList = [
    '10:00 AM',
    '11:30 AM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
    '06:30 PM'
  ]

  const loadData = () => {
    const tList = storage.getTailors()
    setTailors(tList)

    const raw = localStorage.getItem('tc_appointments_data')
    if (raw) {
      setAppointments(JSON.parse(raw))
    } else {
      const defaultAppts = [
        {
          id: 'APT-101',
          customerId: user?.id || 'user-cust-1',
          customerName: user?.name || 'Priya Sharma',
          tailorId: 'user-tailor-1',
          tailorName: 'Lakshmi Devi (Lakshmi Stitches)',
          shopName: 'Lakshmi Stitches & Bridal Studio',
          service: 'Bridal Blouse Measurement & Styling',
          date: '2026-08-28',
          time: '11:00 AM',
          purpose: 'Bridal Blouse Measurement & Neckline Customization',
          status: 'pending'
        },
        {
          id: 'APT-102',
          customerId: user?.id || 'user-cust-1',
          customerName: user?.name || 'Priya Sharma',
          tailorId: 'user-tailor-5',
          tailorName: 'Grace Mary (Grace Bridal)',
          shopName: 'Grace Bridal Couture Hub',
          service: 'Silk Fabric Swatch & Color Selection',
          date: '2026-08-30',
          time: '03:00 PM',
          purpose: 'Silk Fabric Swatch & Zardosi Pattern Finalization',
          status: 'approved'
        }
      ]
      localStorage.setItem('tc_appointments_data', JSON.stringify(defaultAppts))
      setAppointments(defaultAppts)
    }
  }

  useEffect(() => {
    loadData()
    const handleDataChange = () => loadData()
    window.addEventListener('tc_data_changed', handleDataChange)
    return () => window.removeEventListener('tc_data_changed', handleDataChange)
  }, [user])

  const handleBook = (e) => {
    e.preventDefault()
    const selectedTailorObj = tailors.find(t => t.id === selectedTailorId) || tailors[0]

    const newAppt = {
      id: `APT-${Date.now().toString().slice(-4)}`,
      customerId: user?.id || 'user-cust-1',
      customerName: user?.name || 'Priya Sharma',
      customerEmail: user?.email || 'customer@tailorconnect.com',
      customerPhone: user?.phone || '9876543210',
      tailorId: selectedTailorObj?.id || 'user-tailor-1',
      tailorName: selectedTailorObj?.name || 'Lakshmi Devi',
      shopName: selectedTailorObj?.shopName || 'Lakshmi Stitches',
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      purpose,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    const updated = [newAppt, ...appointments]
    setAppointments(updated)
    localStorage.setItem('tc_appointments_data', JSON.stringify(updated))

    setSuccessMsg('Appointment booked successfully! Tailor will confirm your slot shortly.')
    setShowBookingForm(false)
    setTimeout(() => setSuccessMsg(''), 4000)
  }

  return (
    <DashboardLayout role="customer">
      <div className="page-header">
        <div>
          <h1>Tailor Appointments & Consultations</h1>
          <p>Book one-on-one studio visits or doorstep appointments with master tailors for precision measurements and fabric trials.</p>
        </div>
        <Button variant="primary" onClick={() => setShowBookingForm(!showBookingForm)}>
          {showBookingForm ? '✕ Close Booking Form' : '+ Book New Appointment'}
        </Button>
      </div>

      {successMsg && (
        <div style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success)', padding: '12px 16px', borderRadius: 8, marginBottom: 20 }}>
          ✅ {successMsg}
        </div>
      )}

      {/* BOOKING FORM ACCORDION/CARD */}
      {showBookingForm && (
        <div className="card" style={{ marginBottom: 24, padding: 24, background: 'var(--bg-page)', borderColor: 'var(--primary)' }}>
          <h2 style={{ fontSize: 18, color: 'var(--primary-dark)', marginBottom: 4 }}>📅 Book Master Tailor Appointment</h2>
          <p className="muted" style={{ fontSize: 13, marginBottom: 18 }}>Select your preferred boutique tailor, service requirement, and slot.</p>

          <form onSubmit={handleBook}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 16 }}>
              {/* Select Tailor */}
              <div className="form-group">
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Select Tailor / Boutique *</label>
                <select 
                  className="form-control"
                  value={selectedTailorId}
                  onChange={(e) => setSelectedTailorId(e.target.value)}
                >
                  {tailors.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.shopName || t.name} ({t.location}) - {t.specialist || 'Master Tailor'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Service */}
              <div className="form-group">
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Select Service *</label>
                <select 
                  className="form-control"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  {servicesList.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Select Date */}
              <div className="form-group">
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Select Date *</label>
                <input 
                  className="form-control"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>

              {/* Select Time */}
              <div className="form-group">
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Select Time Slot *</label>
                <select 
                  className="form-control"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                >
                  {timesList.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Purpose */}
            <div className="form-group" style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Purpose & Custom Notes *</label>
              <textarea 
                className="form-control"
                rows={2}
                placeholder="Explain what needs to be measured, neck designs, fabric samples, or fitting concerns..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button variant="secondary" type="button" onClick={() => setShowBookingForm(false)}>Cancel</Button>
              <Button variant="primary" type="submit">Confirm & Book Appointment</Button>
            </div>
          </form>
        </div>
      )}

      {/* APPOINTMENTS LIST */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--primary-light)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Appt ID</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Tailor & Boutique</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Service</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Date & Time</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Purpose</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Status</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: 28, textAlign: 'center', color: 'var(--text-muted)' }}>
                    No appointments scheduled yet. Click <strong>+ Book New Appointment</strong> above.
                  </td>
                </tr>
              ) : (
                appointments.map(appt => (
                  <tr key={appt.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)', fontSize: 13 }}>
                      {appt.id}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13 }}>
                      <strong>{appt.tailorName}</strong>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{appt.shopName}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13 }}>
                      {appt.service}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13 }}>
                      <strong>{appt.date}</strong>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{appt.time}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12.5, color: 'var(--text-main)', maxWidth: 220 }}>
                      {appt.purpose}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13 }}>
                      <StatusBadge status={appt.status} />
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <Link to="/customer/chat">
                        <Button size="sm" variant="secondary">💬 Chat</Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
