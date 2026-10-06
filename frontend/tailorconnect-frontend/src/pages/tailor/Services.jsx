import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Button from '../../components/Button'
import StatusBadge from '../../components/StatusBadge'
import Modal from '../../components/Modal'

const DEFAULT_SERVICES = [
  {
    id: 'SRV-101',
    name: 'Bridal Blouse Designing',
    category: 'Bridal Blouse',
    description: 'Heavy Aari, Maggam, and Zari needlework wedding blouses with custom cup padding and double piping.',
    startingPrice: 1800,
    estimatedDays: '5 - 7 Days',
    urgentAvailable: true,
    maxDailyOrders: 3,
    fabricOptions: 'Customer Fabric / Pure Kanchipuram Silk / Raw Silk',
    serviceImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80',
    status: 'Active'
  },
  {
    id: 'SRV-102',
    name: 'Aari Needle & Maggam Embroidery',
    category: 'Aari Work',
    description: 'Handcrafted floral motifs, antique gold wire, peacock patterns, and stone border detailing.',
    startingPrice: 1200,
    estimatedDays: '6 - 8 Days',
    urgentAvailable: true,
    maxDailyOrders: 4,
    fabricOptions: 'Raw Silk, Velvet, Organza',
    serviceImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&auto=format&fit=crop&q=80',
    status: 'Active'
  },
  {
    id: 'SRV-103',
    name: 'Designer Lehenga & Party Gown Stitching',
    category: 'Designer Dress',
    description: 'Custom layered can-can lehenga choli, festive reception gowns, and Indo-Western flared silhouettes.',
    startingPrice: 2500,
    estimatedDays: '7 - 10 Days',
    urgentAvailable: false,
    maxDailyOrders: 2,
    fabricOptions: 'Silk, Georgette, Net, Brocade',
    serviceImage: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=500&auto=format&fit=crop&q=80',
    status: 'Active'
  },
  {
    id: 'SRV-104',
    name: 'Saree Alteration & Kuchu Tassels',
    category: 'Saree Alteration',
    description: 'Fall, pico, crochet saree kuchu, bridal bead tassels, and waist blouse adjustments.',
    startingPrice: 350,
    estimatedDays: '2 - 3 Days',
    urgentAvailable: true,
    maxDailyOrders: 8,
    fabricOptions: 'Any Saree Material',
    serviceImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&auto=format&fit=crop&q=80',
    status: 'Active'
  },
  {
    id: 'SRV-105',
    name: 'Kids Pattu Pavadai & Ethnic Frocks',
    category: 'Kids Wear',
    description: 'Traditional South Indian pattu pavadai sets, kid kurtas, and festive party frocks.',
    startingPrice: 650,
    estimatedDays: '3 - 5 Days',
    urgentAvailable: true,
    maxDailyOrders: 5,
    fabricOptions: 'Cotton Silk, Art Silk, Chanderi',
    serviceImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=80',
    status: 'Active'
  },
  {
    id: 'SRV-106',
    name: 'Custom Tailoring & Pattern Stitching',
    category: 'Custom Stitching',
    description: 'Bespoke blouse and salwar stitching according to your reference photo and measurement profile.',
    startingPrice: 500,
    estimatedDays: '4 - 6 Days',
    urgentAvailable: true,
    maxDailyOrders: 6,
    fabricOptions: 'Customer Provided / Studio Sourced',
    serviceImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&auto=format&fit=crop&q=80',
    status: 'Active'
  }
]

export default function TailorServices() {
  const [services, setServices] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [notification, setNotification] = useState('')

  // Form states
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Bridal Blouse')
  const [description, setDescription] = useState('')
  const [startingPrice, setStartingPrice] = useState('1200')
  const [estimatedDays, setEstimatedDays] = useState('5 - 7 Days')
  const [urgentAvailable, setUrgentAvailable] = useState(true)
  const [maxDailyOrders, setMaxDailyOrders] = useState('4')
  const [fabricOptions, setFabricOptions] = useState('Customer Fabric / Pure Silk')
  const [serviceImage, setServiceImage] = useState('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80')

  const loadServices = () => {
    const raw = localStorage.getItem('tc_tailor_services_data')
    if (raw) {
      setServices(JSON.parse(raw))
    } else {
      setServices(DEFAULT_SERVICES)
      localStorage.setItem('tc_tailor_services_data', JSON.stringify(DEFAULT_SERVICES))
    }
  }

  useEffect(() => {
    loadServices()
  }, [])

  const openAddModal = () => {
    setEditingService(null)
    setName('')
    setCategory('Bridal Blouse')
    setDescription('')
    setStartingPrice('1200')
    setEstimatedDays('5 - 7 Days')
    setUrgentAvailable(true)
    setMaxDailyOrders('4')
    setFabricOptions('Customer Fabric / Pure Silk')
    setServiceImage('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80')
    setModalOpen(true)
  }

  const openEditModal = (srv) => {
    setEditingService(srv)
    setName(srv.name)
    setCategory(srv.category)
    setDescription(srv.description)
    setStartingPrice(String(srv.startingPrice))
    setEstimatedDays(srv.estimatedDays)
    setUrgentAvailable(srv.urgentAvailable)
    setMaxDailyOrders(String(srv.maxDailyOrders))
    setFabricOptions(srv.fabricOptions)
    setServiceImage(srv.serviceImage)
    setModalOpen(true)
  }

  const handleSaveService = (e) => {
    e.preventDefault()
    if (!name || !startingPrice) return

    let updated = []
    if (editingService) {
      updated = services.map(s => s.id === editingService.id ? {
        ...s,
        name,
        category,
        description,
        startingPrice: Number(startingPrice),
        estimatedDays,
        urgentAvailable,
        maxDailyOrders: Number(maxDailyOrders),
        fabricOptions,
        serviceImage
      } : s)
      setNotification(`Service "${name}" updated successfully!`)
    } else {
      const newSrv = {
        id: `SRV-${Date.now().toString().slice(-4)}`,
        name,
        category,
        description,
        startingPrice: Number(startingPrice),
        estimatedDays,
        urgentAvailable,
        maxDailyOrders: Number(maxDailyOrders),
        fabricOptions,
        serviceImage,
        status: 'Active'
      }
      updated = [newSrv, ...services]
      setNotification(`New service "${name}" added to catalog!`)
    }

    setServices(updated)
    localStorage.setItem('tc_tailor_services_data', JSON.stringify(updated))
    setModalOpen(false)
    setTimeout(() => setNotification(''), 3000)
  }

  const toggleStatus = (id) => {
    const updated = services.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'Active' ? 'Disabled' : 'Active'
        return { ...s, status: nextStatus }
      }
      return s
    })
    setServices(updated)
    localStorage.setItem('tc_tailor_services_data', JSON.stringify(updated))
  }

  const handleDelete = (id, srvName) => {
    if (window.confirm(`Are you sure you want to delete "${srvName}"?`)) {
      const updated = services.filter(s => s.id !== id)
      setServices(updated)
      localStorage.setItem('tc_tailor_services_data', JSON.stringify(updated))
      setNotification(`Service deleted.`)
      setTimeout(() => setNotification(''), 2500)
    }
  }

  return (
    <DashboardLayout role="tailor">
      <div className="page-header">
        <div>
          <h1>Tailoring Services & Pricing Catalog</h1>
          <p>Configure your specialty stitching services, starting prices, turnaround SLA, daily capacities, and urgent availability.</p>
        </div>
        <Button variant="primary" onClick={openAddModal}>
          + Add New Service
        </Button>
      </div>

      {notification && (
        <div style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success-border)', padding: '10px 16px', borderRadius: 6, marginBottom: 20 }}>
          ✅ {notification}
        </div>
      )}

      {/* SERVICES GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {services.map((srv) => {
          const isActive = srv.status === 'Active'

          return (
            <div
              key={srv.id}
              className="card"
              style={{
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: isActive ? 1 : 0.65
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span className="sidebar-role-badge" style={{ fontSize: 11 }}>{srv.category}</span>
                  <button
                    type="button"
                    onClick={() => toggleStatus(srv.id)}
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <StatusBadge status={srv.status} />
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
                  <img
                    src={srv.serviceImage}
                    alt={srv.name}
                    style={{ width: 72, height: 72, borderRadius: 6, objectFit: 'cover', border: '1px solid var(--border)' }}
                  />
                  <div>
                    <h3 style={{ fontSize: 16, margin: '0 0 4px 0', color: 'var(--text-main)' }}>{srv.name}</h3>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)' }}>
                      Starting at ₹{srv.startingPrice}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      Turnaround: <strong>{srv.estimatedDays}</strong>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 14px 0', lineHeight: 1.45 }}>
                  {srv.description}
                </p>

                <div style={{ background: 'var(--bg-subtle)', padding: 10, borderRadius: 6, border: '1px solid var(--border-light)', fontSize: 12, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>Max Daily Orders:</span>
                    <strong>{srv.maxDailyOrders} Orders</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>Urgent (48h) Support:</span>
                    <strong style={{ color: srv.urgentAvailable ? 'var(--success)' : 'var(--danger)' }}>
                      {srv.urgentAvailable ? '✓ Available' : '✕ Disabled'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Fabrics: {srv.fabricOptions}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--border-light)', paddingTop: 12 }}>
                <Button variant="outline" size="sm" style={{ flex: 1 }} onClick={() => openEditModal(srv)}>
                  Edit Service
                </Button>
                <Button 
                  variant={isActive ? 'secondary' : 'primary'} 
                  size="sm" 
                  style={{ flex: 1 }} 
                  onClick={() => toggleStatus(srv.id)}
                >
                  {isActive ? 'Disable' : 'Enable'}
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(srv.id, srv.name)}>
                  Delete
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* ADD / EDIT SERVICE MODAL */}
      {modalOpen && (
        <Modal
          title={editingService ? `Edit Service: ${editingService.name}` : 'Add New Tailoring Service'}
          onClose={() => setModalOpen(false)}
          maxWidth={600}
        >
          <form onSubmit={handleSaveService}>
            <div className="form-group">
              <label className="form-label">Service Name <span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Bridal Aari Blouse Stitching"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Bridal Blouse">Bridal Blouse</option>
                  <option value="Aari Work">Aari Work</option>
                  <option value="Embroidery">Embroidery</option>
                  <option value="Designer Dress">Designer Dress</option>
                  <option value="Saree Alteration">Saree Alteration</option>
                  <option value="Kids Wear">Kids Wear</option>
                  <option value="Custom Stitching">Custom Stitching</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Starting Price (₹) <span className="required">*</span></label>
                <input
                  type="number"
                  className="form-control"
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Estimated Days</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 5 - 7 Days"
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Max Daily Orders</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  className="form-control"
                  value={maxDailyOrders}
                  onChange={(e) => setMaxDailyOrders(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Fabric Sourcing Options</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Customer provided / Silk / Velvet"
                value={fabricOptions}
                onChange={(e) => setFabricOptions(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Detail the stitching techniques, lining options, and design inclusions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={urgentAvailable}
                  onChange={(e) => setUrgentAvailable(e.target.checked)}
                />
                Enable Urgent 48h Turnaround for this service
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm">
                {editingService ? 'Save Changes' : 'Publish Service'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  )
}
