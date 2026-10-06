import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import * as storage from '../../services/storageService'
import Button from '../../components/Button'
import { LoadingState, EmptyState } from '../../components/States'

export default function TailorOffers() {
  const { user } = useAuth()
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOffer, setEditingOffer] = useState(null)
  const [viewingOffer, setViewingOffer] = useState(null)

  const [form, setForm] = useState({
    name: '',
    type: 'Course',
    targetAudience: 'Student',
    category: 'Aari Blouse',
    description: '',
    mode: 'Offline',
    durationDays: 15,
    startDate: '',
    endDate: '',
    availableDays: 'Monday to Friday',
    availableTime: '10:00 AM – 12:00 PM',
    location: user?.address || 'Chennai',
    shopName: user?.shopName || 'Boutique Studio',
    trainerName: user?.name || 'Master Tailor',
    price: 1200,
    maxCapacity: 20,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80',
    requirements: 'Basic tailoring knowledge',
    whatWillBeTaught: 'Aari needlework, Zari thread technique, Neckline motifs',
    whatWillBeReceived: 'Certificate of Completion & Materials Toolkit',
    contactInfo: `Phone: ${user?.phone || '9876543211'} | Email: ${user?.email || 'tailor@tailorconnect.com'}`
  })

  const loadData = () => {
    if (!user) return
    const all = storage.getOffersForTailor(user.id)
    setOffers(all)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
    const handleDataChange = () => loadData()
    window.addEventListener('tc_data_changed', handleDataChange)
    return () => window.removeEventListener('tc_data_changed', handleDataChange)
  }, [user])

  const openAddModal = () => {
    setEditingOffer(null)
    setForm({
      name: '',
      type: 'Course',
      targetAudience: 'Student',
      category: 'Aari Blouse',
      description: '',
      mode: 'Offline',
      durationDays: 15,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      availableDays: 'Monday to Friday',
      availableTime: '10:00 AM – 12:00 PM',
      location: user?.address || user?.location || 'Chennai',
      shopName: user?.shopName || 'Boutique Studio',
      trainerName: user?.name || 'Master Tailor',
      price: 1200,
      maxCapacity: 20,
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80',
      requirements: 'Basic needlework interest',
      whatWillBeTaught: 'Aari needlework, Zari thread locks, Stone chain fixing',
      whatWillBeReceived: 'Verified Certificate & Tool Kit',
      contactInfo: `Phone: ${user?.phone || '9876543211'} | Email: ${user?.email || 'tailor@tailorconnect.com'}`
    })
    setIsModalOpen(true)
  }

  const openEditModal = (offer) => {
    setEditingOffer(offer)
    setForm({ ...offer })
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this offer/course?')) {
      storage.deleteOffer(id)
      loadData()
    }
  }

  const handleToggleStatus = (offer) => {
    const nextStatus = offer.status === 'Active' ? 'Closed' : 'Active'
    storage.toggleOfferAvailability(offer.id, nextStatus)
    loadData()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return

    if (editingOffer) {
      storage.updateOffer(editingOffer.id, form)
    } else {
      storage.createOffer({
        ...form,
        tailorId: user.id
      })
    }
    setIsModalOpen(false)
    loadData()
  }

  const filteredOffers = offers.filter((o) => {
    if (filter === 'All') return true
    if (filter === 'Course') return o.type === 'Course'
    if (filter === 'Offer') return o.type === 'Offer'
    if (filter === 'Active') return o.status === 'Active'
    if (filter === 'Closed') return o.status === 'Closed'
    return true
  })

  return (
    <DashboardLayout role="tailor">
      <div className="page-header">
        <div>
          <h1>Offers & Courses Management</h1>
          <p>Create and manage tailoring learning courses, festival offers, and seat capacities.</p>
        </div>
        <Button onClick={openAddModal}>+ Create New Offer / Course</Button>
      </div>

      {/* Filter Tabs */}
      <div className="tabs-nav">
        {['All', 'Course', 'Offer', 'Active', 'Closed'].map((t) => (
          <button
            key={t}
            className={`tab-btn ${filter === t ? 'active' : ''}`}
            onClick={() => setFilter(t)}
          >
            {t === 'All' ? 'All Items' : t + 's'}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState message="Loading your offers..." />
      ) : filteredOffers.length === 0 ? (
        <EmptyState message="No offers or courses created yet. Click '+ Create New Offer / Course' to publish your first one!" />
      ) : (
        <div className="card-grid-wide">
          {filteredOffers.map((item) => {
            const remainingSeats = Math.max(0, (item.maxCapacity || 20) - (item.registeredStudents || 0))

            return (
              <div className="card" key={item.id}>
                <div style={{ position: 'relative' }}>
                  <img src={item.image} alt={item.name} className="image-card-img" style={{ height: 200 }} />
                  <span
                    className={`badge ${item.status === 'Active' ? 'badge-active' : 'badge-closed'}`}
                    style={{ position: 'absolute', top: 12, right: 12 }}
                  >
                    {item.status}
                  </span>
                  <span
                    className="tag"
                    style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(255,255,255,0.92)' }}
                  >
                    {item.type} ({item.targetAudience})
                  </span>
                </div>

                <div className="card-body">
                  <h3 style={{ fontSize: 17, marginBottom: 6 }}>{item.name}</h3>
                  <p className="muted" style={{ margin: '0 0 10px 0', fontSize: 13 }}>
                    {item.category} • {item.mode} • ⏱️ {item.durationDays} Days
                  </p>

                  <div style={{ background: 'var(--primary-light)', padding: '10px 14px', borderRadius: 8, marginBottom: 12 }}>
                    <div className="flex-between" style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary-dark)' }}>
                      <span>👥 {item.registeredStudents || 0} Students Registered</span>
                      <span>₹{item.price}</span>
                    </div>
                    <div style={{ fontSize: 12, color: remainingSeats <= 3 ? 'var(--danger)' : 'var(--text-muted)', marginTop: 4 }}>
                      {remainingSeats > 0 ? `🟢 ${remainingSeats} seats remaining (Max ${item.maxCapacity})` : '🔴 Capacity Full'}
                    </div>
                  </div>

                  <p style={{ fontSize: 12.5, color: 'var(--text-main)', margin: '0 0 14px 0' }}>
                    <strong>Schedule:</strong> {item.availableDays} ({item.availableTime})<br />
                    <strong>Location:</strong> {item.location}
                  </p>

                  <div className="flex-between" style={{ gap: 8, flexWrap: 'wrap' }}>
                    <Button variant="outline" size="sm" onClick={() => setViewingOffer(item)}>
                      View Details
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => openEditModal(item)}>
                      Edit
                    </Button>
                    <Button
                      variant={item.status === 'Active' ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => handleToggleStatus(item)}
                    >
                      {item.status === 'Active' ? 'Close Offer' : 'Reopen Offer'}
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewingOffer && (
        <div className="modal-overlay" onClick={() => setViewingOffer(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{viewingOffer.name}</h2>
              <button className="modal-close-btn" onClick={() => setViewingOffer(null)}>✕</button>
            </div>
            <img src={viewingOffer.image} alt={viewingOffer.name} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8, marginBottom: 14 }} />
            
            <p><strong>Description:</strong> {viewingOffer.description}</p>
            <p><strong>Audience / Type:</strong> {viewingOffer.targetAudience} ({viewingOffer.type}) - {viewingOffer.mode}</p>
            <p><strong>Duration & Dates:</strong> {viewingOffer.durationDays} Days ({viewingOffer.startDate} to {viewingOffer.endDate})</p>
            <p><strong>Schedule:</strong> {viewingOffer.availableDays} from {viewingOffer.availableTime}</p>
            <p><strong>Location / Shop:</strong> {viewingOffer.shopName}, {viewingOffer.location}</p>
            <p><strong>Trainer:</strong> {viewingOffer.trainerName}</p>
            <p><strong>Price:</strong> ₹{viewingOffer.price}</p>
            <p><strong>Capacity Status:</strong> {viewingOffer.registeredStudents || 0} / {viewingOffer.maxCapacity} registered ({Math.max(0, viewingOffer.maxCapacity - (viewingOffer.registeredStudents || 0))} seats remaining)</p>
            <p><strong>What Will Be Taught:</strong> {viewingOffer.whatWillBeTaught}</p>
            <p><strong>What Will Be Received:</strong> {viewingOffer.whatWillBeReceived}</p>
            <p><strong>Requirements:</strong> {viewingOffer.requirements}</p>
            <p><strong>Contact:</strong> {viewingOffer.contactInfo}</p>
            
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Button onClick={() => setViewingOffer(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <h2>{editingOffer ? 'Edit Offer / Course' : 'Create New Offer / Course'}</h2>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Offer / Course Title *</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Aari Embroidery Masterclass"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select
                    className="form-control"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="Course">Course (Learning)</option>
                    <option value="Offer">Stitching Offer (Discount/Package)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Target Audience</label>
                  <select
                    className="form-control"
                    value={form.targetAudience}
                    onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                  >
                    <option value="Student">Student</option>
                    <option value="Customer">Customer</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="form-control"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="Aari Blouse">Aari Blouse</option>
                    <option value="Bridal Blouse">Bridal Blouse</option>
                    <option value="Designer Blouse">Designer Blouse</option>
                    <option value="Embroidery">Embroidery & Zardosi</option>
                    <option value="Lehenga">Lehenga & Flared Gown</option>
                    <option value="Saree Blouse">Saree Blouse</option>
                    <option value="Kids Wear">Kids Ethnic Wear</option>
                    <option value="Custom Dress">Custom Dress & Pattern Drafting</option>
                    <option value="Alteration">Fast Alteration</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Mode</label>
                  <select
                    className="form-control"
                    value={form.mode}
                    onChange={(e) => setForm({ ...form, mode: e.target.value })}
                  >
                    <option value="Offline">Offline (In-Shop Workshop)</option>
                    <option value="Online">Online (Live Video)</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Duration in Days</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.durationDays}
                    onChange={(e) => setForm({ ...form, durationDays: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Max Registrations *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.maxCapacity}
                    onChange={(e) => setForm({ ...form, maxCapacity: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Available Days</label>
                  <input
                    className="form-control"
                    value={form.availableDays}
                    onChange={(e) => setForm({ ...form, availableDays: e.target.value })}
                    placeholder="e.g. Monday to Friday"
                  />
                </div>
                <div className="form-group">
                  <label>Available Time</label>
                  <input
                    className="form-control"
                    value={form.availableTime}
                    onChange={(e) => setForm({ ...form, availableTime: e.target.value })}
                    placeholder="e.g. 10:00 AM – 12:00 PM"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Location / Address</label>
                <input
                  className="form-control"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. T.Nagar, Chennai"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed description of what the course or offer covers..."
                />
              </div>

              <div className="form-group">
                <label>What Will Be Taught</label>
                <input
                  className="form-control"
                  value={form.whatWillBeTaught}
                  onChange={(e) => setForm({ ...form, whatWillBeTaught: e.target.value })}
                  placeholder="e.g. Needle handling, Zari thread lock, Stone fixing"
                />
              </div>

              <div className="form-group">
                <label>What the Customer/Student Will Receive</label>
                <input
                  className="form-control"
                  value={form.whatWillBeReceived}
                  onChange={(e) => setForm({ ...form, whatWillBeReceived: e.target.value })}
                  placeholder="e.g. Certificate of Completion, Tool Kit"
                />
              </div>

              <div className="form-group">
                <label>Relevant Topic Image URL</label>
                <input
                  className="form-control"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="form-group">
                <label>Contact Information</label>
                <input
                  className="form-control"
                  value={form.contactInfo}
                  onChange={(e) => setForm({ ...form, contactInfo: e.target.value })}
                  placeholder="Phone / WhatsApp / Email"
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingOffer ? 'Save Changes' : 'Publish Offer / Course'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
