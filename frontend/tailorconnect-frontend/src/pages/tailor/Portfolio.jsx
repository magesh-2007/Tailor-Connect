import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Button from '../../components/Button'

export default function TailorPortfolio() {
  const [items, setItems] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    title: '',
    category: 'Bridal Blouse',
    priceRange: '₹1500 - ₹2500',
    description: '',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80'
  })

  const loadData = () => {
    const raw = localStorage.getItem('tc_tailor_portfolio')
    if (raw) {
      setItems(JSON.parse(raw))
    } else {
      const defaultPortfolio = [
        {
          id: 'PORT-1',
          title: 'Royal Peacock Aari Bridal Blouse',
          category: 'Bridal Blouse',
          priceRange: '₹1800 - ₹2800',
          description: 'Intricate peacock feather motif needlework in dual-tone gold and emerald green zari thread.',
          image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80'
        },
        {
          id: 'PORT-2',
          title: 'Antique Zardosi Maggam Work Blouse',
          category: 'Aari Work',
          priceRange: '₹2200 - ₹3500',
          description: 'Heirloom temple motif embroidery with bullion wire, pearl drops, and stone lace.',
          image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80'
        },
        {
          id: 'PORT-3',
          title: 'Velvet Flared Bridal Lehenga Set',
          category: 'Designer Dress',
          priceRange: '₹3500 - ₹6000',
          description: 'Double flare bridal skirt with heavy metallic border hem and padded designer blouse.',
          image: 'https://images.unsplash.com/photo-1610030469668-932d59f77f52?w=600&auto=format&fit=crop&q=80'
        },
        {
          id: 'PORT-4',
          title: 'Cut-work Contemporary Saree Blouse',
          category: 'Saree Alteration',
          priceRange: '₹900 - ₹1400',
          description: 'High neck back cut-work pattern with potli buttons and contrast silk piping.',
          image: 'https://images.unsplash.com/photo-1583391733975-0210f9689408?w=600&auto=format&fit=crop&q=80'
        }
      ]
      localStorage.setItem('tc_tailor_portfolio', JSON.stringify(defaultPortfolio))
      setItems(defaultPortfolio)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSave = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return

    const newItem = {
      id: `PORT-${Date.now().toString().slice(-4)}`,
      title: form.title,
      category: form.category,
      priceRange: form.priceRange,
      description: form.description,
      image: form.image
    }

    const updated = [newItem, ...items]
    setItems(updated)
    localStorage.setItem('tc_tailor_portfolio', JSON.stringify(updated))
    setShowModal(false)
    setForm({
      title: '',
      category: 'Bridal Blouse',
      priceRange: '₹1500 - ₹2500',
      description: '',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80'
    })
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this portfolio item?')) {
      const updated = items.filter(i => i.id !== id)
      setItems(updated)
      localStorage.setItem('tc_tailor_portfolio', JSON.stringify(updated))
    }
  }

  return (
    <DashboardLayout role="tailor">
      <div className="page-header">
        <div>
          <h1>Master Studio Portfolio</h1>
          <p>Upload and showcase completed bespoke garments, Aari embroidery samples, and bridal outfits to attract new clients.</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Upload Completed Work
        </Button>
      </div>

      {/* PORTFOLIO CARDS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {items.map(item => (
          <div className="card" key={item.id} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ position: 'relative' }}>
              <img 
                src={item.image} 
                alt={item.title} 
                style={{ width: '100%', height: 180, objectFit: 'cover' }}
              />
              <span className="tag" style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(255,255,255,0.92)' }}>
                {item.category}
              </span>
            </div>

            <div className="card-body" style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div className="flex-between" style={{ marginBottom: 6 }}>
                <h3 style={{ fontSize: 16, margin: 0, color: 'var(--primary-dark)' }}>{item.title}</h3>
                <strong style={{ color: 'var(--primary)', fontSize: 14 }}>{item.priceRange}</strong>
              </div>

              <p className="muted" style={{ fontSize: 12.5, margin: '0 0 14px 0', lineHeight: 1.4 }}>
                {item.description}
              </p>

              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>
                  🗑️ Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* UPLOAD MODAL */}
      {showModal && (
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
          <div className="card" style={{ maxWidth: 500, width: '100%', padding: 24 }}>
            <div className="flex-between" style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, color: 'var(--primary-dark)', margin: 0 }}>
                Upload Completed Work
              </h2>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Work Title *</label>
                <input 
                  className="form-control"
                  type="text"
                  placeholder="e.g. Royal Peacock Aari Bridal Blouse"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Category</label>
                  <select 
                    className="form-control"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="Bridal Blouse">Bridal Blouse</option>
                    <option value="Aari Work">Aari Work</option>
                    <option value="Embroidery">Embroidery</option>
                    <option value="Designer Dress">Designer Dress</option>
                    <option value="Saree Alteration">Saree Alteration</option>
                    <option value="Kids Wear">Kids Wear</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Price Range</label>
                  <input 
                    className="form-control"
                    type="text"
                    placeholder="e.g. ₹1500 - ₹2500"
                    value={form.priceRange}
                    onChange={(e) => setForm({ ...form, priceRange: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Work Description</label>
                <textarea 
                  className="form-control"
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Image URL</label>
                <input 
                  className="form-control"
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Upload to Portfolio</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
