import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import * as storage from '../../services/storageService'
import { EmptyState, LoadingState } from '../../components/States'
import Button from '../../components/Button'

export default function Wishlist() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = () => {
    if (!user) return
    const list = storage.getWishlistForUser(user.id)
    setItems(list)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
    const handleDataChange = () => loadData()
    window.addEventListener('tc_data_changed', handleDataChange)
    return () => window.removeEventListener('tc_data_changed', handleDataChange)
  }, [user])

  const handleRemove = (item) => {
    storage.toggleWishlistItem(user.id, { id: item.itemId })
    loadData()
  }

  return (
    <DashboardLayout role="customer">
      <div className="page-header">
        <div>
          <h1>My Saved Boutique Designs ❤️</h1>
          <p>Curate your dream bridal blouses, lehengas, and embroidery styles to order when ready.</p>
        </div>
        <Link to="/customer/tailors">
          <Button variant="outline">Browse More Tailors</Button>
        </Link>
      </div>

      {loading ? (
        <LoadingState message="Loading your wishlist..." />
      ) : items.length === 0 ? (
        <EmptyState message="Your wishlist is empty. Browse master tailor profiles and click the ❤️ icon on designs to save them here!" />
      ) : (
        <div className="card-grid">
          {items.map((item) => (
            <div className="card" key={item.id}>
              <div style={{ position: 'relative' }}>
                <img src={item.image} alt={item.title} className="image-card-img" style={{ height: 210 }} />
                <span className="tag" style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(255,255,255,0.92)' }}>
                  {item.category}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(item)}
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    fontSize: 16
                  }}
                  title="Remove from Wishlist"
                >
                  💔
                </button>
              </div>

              <div className="card-body">
                <h4 style={{ margin: '0 0 4px 0', fontSize: 16 }}>{item.title}</h4>
                <p className="muted" style={{ margin: '0 0 10px 0', fontSize: 13 }}>
                  By <strong>{item.tailor}</strong> • Price: <strong>{item.price}</strong>
                </p>

                <div className="flex-between">
                  <Link to={`/customer/create-order?item=${encodeURIComponent(item.title)}`}>
                    <Button size="sm">👗 Order This Design</Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => handleRemove(item)}>
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
