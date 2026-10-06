import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/Button'
import StatusBadge from '../../components/StatusBadge'

export default function TailorAppointments() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [reschedulingAppt, setReschedulingAppt] = useState(null)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleTime, setRescheduleTime] = useState('11:00 AM')

  const loadAppointments = () => {
    const raw = localStorage.getItem('tc_appointments_data')
    if (raw) {
      setAppointments(JSON.parse(raw))
    } else {
      const defaultAppts = [
        {
          id: 'APT-101',
          customerId: 'user-cust-1',
          customerName: 'Priya Sharma',
          customerPhone: '9876543210',
          tailorId: user?.id || 'user-tailor-1',
          tailorName: user?.name || 'Lakshmi Devi',
          service: 'Bridal Blouse Measurement & Styling',
          date: '2026-08-28',
          time: '11:00 AM',
          purpose: 'Bridal Blouse Measurement & Neckline Customization',
          status: 'pending'
        },
        {
          id: 'APT-102',
          customerId: 'user-cust-3',
          customerName: 'Divya Kumar',
          customerPhone: '9876543215',
          tailorId: user?.id || 'user-tailor-1',
          tailorName: user?.name || 'Lakshmi Devi',
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
    loadAppointments()
  }, [])

  const updateStatus = (apptId, status) => {
    const updated = appointments.map(a => a.id === apptId ? { ...a, status } : a)
    setAppointments(updated)
    localStorage.setItem('tc_appointments_data', JSON.stringify(updated))
  }

  const handleOpenReschedule = (appt) => {
    setReschedulingAppt(appt)
    setRescheduleDate(appt.date)
    setRescheduleTime(appt.time)
  }

  const handleSaveReschedule = (e) => {
    e.preventDefault()
    if (!reschedulingAppt) return

    const updated = appointments.map(a => {
      if (a.id === reschedulingAppt.id) {
        return { ...a, date: rescheduleDate, time: rescheduleTime, status: 'rescheduled' }
      }
      return a
    })

    setAppointments(updated)
    localStorage.setItem('tc_appointments_data', JSON.stringify(updated))
    setReschedulingAppt(null)
  }

  return (
    <DashboardLayout role="tailor">
      <div className="page-header">
        <div>
          <h1>Studio Fittings & Client Appointments</h1>
          <p>Review customer booking requests, accept slots, reschedule times, or mark appointments as completed.</p>
        </div>
      </div>

      {/* APPOINTMENTS TABLE */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--primary-light)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Appt ID</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Customer</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Service</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Date & Time</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Purpose / Note</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Status</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: 28, textAlign: 'center', color: 'var(--text-muted)' }}>
                    No appointments scheduled currently.
                  </td>
                </tr>
              ) : (
                appointments.map(appt => (
                  <tr key={appt.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)', fontSize: 13 }}>
                      {appt.id}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13 }}>
                      <strong>{appt.customerName}</strong>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>📞 {appt.customerPhone}</div>
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
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        {appt.status !== 'approved' && appt.status !== 'completed' && (
                          <Button size="sm" variant="primary" onClick={() => updateStatus(appt.id, 'approved')}>
                            Accept
                          </Button>
                        )}
                        {appt.status === 'approved' && (
                          <Button size="sm" variant="outline" onClick={() => updateStatus(appt.id, 'completed')}>
                            Complete
                          </Button>
                        )}
                        <Button size="sm" variant="secondary" onClick={() => handleOpenReschedule(appt)}>
                          Reschedule
                        </Button>
                        {appt.status !== 'cancelled' && (
                          <Button size="sm" variant="danger" onClick={() => updateStatus(appt.id, 'cancelled')}>
                            Reject
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESCHEDULE MODAL */}
      {reschedulingAppt && (
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
          <div className="card" style={{ maxWidth: 440, width: '100%', padding: 24 }}>
            <div className="flex-between" style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, color: 'var(--primary-dark)', margin: 0 }}>
                Reschedule Appointment #{reschedulingAppt.id}
              </h2>
              <button 
                type="button" 
                onClick={() => setReschedulingAppt(null)}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveReschedule}>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>New Date *</label>
                <input 
                  className="form-control"
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>New Time Slot *</label>
                <select 
                  className="form-control"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                >
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                  <option value="06:00 PM">06:00 PM</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <Button variant="secondary" type="button" onClick={() => setReschedulingAppt(null)}>Cancel</Button>
                <Button variant="primary" type="submit">Confirm Reschedule</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
