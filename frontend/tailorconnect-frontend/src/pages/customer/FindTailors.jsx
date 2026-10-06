import React, { useEffect, useState, useCallback } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'

const SPECIALIZATIONS = [
  'All',
  'Bridal Blouse',
  'Aari Work',
  'Embroidery',
  'Lehenga',
  'Designer Blouse',
  'Saree Alteration',
  'Kids Wear',
  'Custom Stitching',
  'Traditional Wear',
  'Alterations',
]

const LOCATIONS = [
  'All',
  'Chennai',
  'Madurai',
  'Coimbatore',
  'Trichy',
  'Salem',
  'Tirunelveli',
  'Kovilpatti',
  'Vellore',
  'Erode',
]

export default function FindTailors() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialLocation = searchParams.get('location') || 'All'
  const initialSpecialist = searchParams.get('specialist') || 'All'
  const initialShop = searchParams.get('shop') || ''

  const [location, setLocation] = useState(initialLocation)
  const [specialist, setSpecialist] = useState(initialSpecialist)
  const [shopName, setShopName] = useState(initialShop)
  const [service, setService] = useState('')

  const [tailors, setTailors] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)

  const fetchTailors = useCallback(async (params = {}) => {
    setLoading(true)
    setSearched(true)
    try {
      const query = new URLSearchParams()
      const loc = params.location ?? location
      const spec = params.specialist ?? specialist
      const shop = params.shopName ?? shopName

      if (loc && loc !== 'All') query.set('location', loc)
      if (spec && spec !== 'All') query.set('specialist', spec)
      if (shop) query.set('q', shop)
      query.set('page', params.page ?? page)
      query.set('limit', 12)

      const res = await api.get(`/tailors?${query.toString()}`)
      const data = res.data?.data || res.data
      setTailors(data?.tailors || [])
      setTotal(data?.total || 0)
    } catch (err) {
      console.error('Failed to load tailors', err)
      setTailors([])
    } finally {
      setLoading(false)
    }
  }, [location, specialist, shopName, page])

  // Auto-load if URL has params
  useEffect(() => {
    if (initialLocation !== 'All' || initialSpecialist !== 'All' || initialShop) {
      fetchTailors()
    } else {
      // Load all tailors by default
      fetchTailors()
    }
  }, []) // eslint-disable-line

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchTailors({ page: 1 })
    // Update URL params
    const p = {}
    if (location !== 'All') p.location = location
    if (specialist !== 'All') p.specialist = specialist
    if (shopName) p.shop = shopName
    setSearchParams(p)
  }

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // In a real implementation, reverse geocode the coordinates
        // For now, just show a message
        alert(`Location obtained: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}\nLocation-based search requires a geocoding API.`)
      },
      () => alert('Unable to get your location. Please check permissions.')
    )
  }

  const clearFilters = () => {
    setLocation('All')
    setSpecialist('All')
    setShopName('')
    setService('')
    setSearchParams({})
    setPage(1)
    fetchTailors({ location: 'All', specialist: 'All', shopName: '' })
  }

  const hasFilters = location !== 'All' || specialist !== 'All' || shopName

  return (
    <DashboardLayout role="customer">
      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          <h1 style={{ color: '#0F5C5E' }}>Find Tailors</h1>
          <p>Search by location, shop name, or specialization to discover verified tailors near you.</p>
        </div>
      </div>

      {/* ── Search Panel ── */}
      <div style={{
        background: '#FFFFFF', border: '1.5px solid #E3E8E6',
        borderRadius: 14, padding: '24px', marginBottom: 24,
        boxShadow: '0 2px 12px rgba(15,92,94,0.06)',
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0F5C5E', marginBottom: 20 }}>
          🔍 Search for Tailors
        </h2>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 18 }}>

            {/* Location */}
            <div>
              <label style={labelStyle}>📍 Location</label>
              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
                style={selectStyle}
              >
                {LOCATIONS.map(l => <option key={l} value={l}>{l === 'All' ? 'All Locations' : l}</option>)}
              </select>
            </div>

            {/* Specialization */}
            <div>
              <label style={labelStyle}>🧵 Specialization</label>
              <select
                value={specialist}
                onChange={e => setSpecialist(e.target.value)}
                style={selectStyle}
              >
                {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s === 'All' ? 'All Specializations' : s}</option>)}
              </select>
            </div>

            {/* Shop Name */}
            <div>
              <label style={labelStyle}>🏪 Shop Name (optional)</label>
              <input
                type="text"
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                placeholder="e.g. Lakshmi Fashion Studio"
                style={inputStyle}
              />
            </div>

            {/* Service */}
            <div>
              <label style={labelStyle}>✂️ Service (optional)</label>
              <input
                type="text"
                value={service}
                onChange={e => setService(e.target.value)}
                placeholder="e.g. Bridal Blouse"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: '#0F5C5E', color: '#FFFFFF', border: 'none',
                padding: '10px 28px', borderRadius: 8, fontSize: 14, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              {loading ? <Spinner /> : '🔍'} Find Tailors
            </button>

            <button
              type="button"
              onClick={handleUseMyLocation}
              style={{
                background: '#DDEBE7', color: '#0F5C5E', border: '1.5px solid #E3E8E6',
                padding: '9px 20px', borderRadius: 8, fontSize: 13.5, fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              📱 Use My Location
            </button>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                style={{
                  background: 'transparent', color: '#667085',
                  border: '1.5px solid #E3E8E6',
                  padding: '9px 18px', borderRadius: 8, fontSize: 13.5,
                  cursor: 'pointer',
                }}
              >
                ✕ Clear Filters
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── Results ── */}
      {searched && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 14, color: '#667085' }}>
              {loading ? 'Searching…' : (
                <>
                  <strong style={{ color: '#0F5C5E' }}>{total}</strong> tailor{total !== 1 ? 's' : ''} found
                  {location !== 'All' && ` in ${location}`}
                  {specialist !== 'All' && ` specializing in ${specialist}`}
                </>
              )}
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : tailors.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 24px',
              background: '#FFFFFF', border: '1.5px solid #E3E8E6', borderRadius: 14,
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F5C5E', marginBottom: 8 }}>No tailors found</h2>
              <p style={{ color: '#667085', fontSize: 14, marginBottom: 20 }}>
                Try adjusting your search filters or expanding the location.
              </p>
              <button
                onClick={clearFilters}
                style={{
                  background: '#0F5C5E', color: '#FFFFFF', border: 'none',
                  padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}
              >
                Clear Filters & Show All
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
              {tailors.map(tailor => (
                <TailorCard key={tailor.id || tailor._id} tailor={tailor} navigate={navigate} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && total > 12 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28 }}>
              <button
                onClick={() => { setPage(p => Math.max(1, p - 1)); fetchTailors({ page: Math.max(1, page - 1) }) }}
                disabled={page === 1}
                style={{ ...pageBtn, opacity: page === 1 ? 0.4 : 1 }}
              >
                ← Prev
              </button>
              <span style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: '#667085' }}>
                Page {page} of {Math.ceil(total / 12)}
              </span>
              <button
                onClick={() => { setPage(p => p + 1); fetchTailors({ page: page + 1 }) }}
                disabled={page >= Math.ceil(total / 12)}
                style={{ ...pageBtn, opacity: page >= Math.ceil(total / 12) ? 0.4 : 1 }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}

// ── TailorCard ──────────────────────────────────────────────────────────────

function TailorCard({ tailor, navigate }) {
  const [hovered, setHovered] = useState(false)
  const id = tailor.id || tailor._id

  return (
    <div
      style={{
        background: '#FFFFFF', border: `1.5px solid ${hovered ? '#0F5C5E' : '#E3E8E6'}`,
        borderRadius: 14, overflow: 'hidden', transition: 'all 0.2s',
        boxShadow: hovered ? '0 8px 24px rgba(15,92,94,0.12)' : 'none',
        transform: hovered ? 'translateY(-3px)' : 'none',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/customer/tailors/${id}`)}
    >
      {/* Cover */}
      <div style={{
        height: 110,
        background: tailor.coverImage
          ? `url(${tailor.coverImage}) center/cover no-repeat`
          : 'linear-gradient(135deg, #0F5C5E 0%, #167A7D 100%)',
        position: 'relative',
        display: 'flex', alignItems: 'flex-end', padding: '0 16px 12px',
      }}>
        {tailor.verified && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: '#3F7D5A', color: '#FFFFFF',
            fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 999,
          }}>
            ✓ Verified
          </div>
        )}
        <div style={{
          width: 54, height: 54, borderRadius: '50%',
          background: '#FFFFFF',
          border: '3px solid #FFFFFF',
          overflow: 'hidden', flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}>
          {tailor.profileImage || tailor.avatar ? (
            <img src={tailor.profileImage || tailor.avatar} alt={tailor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#C9A66B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#FFFFFF' }}>
              {tailor.name?.[0] || 'T'}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '10px 16px 16px' }}>
        <div style={{ marginBottom: 8 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F5C5E', margin: '0 0 2px' }}>{tailor.name}</h3>
          <div style={{ fontSize: 12.5, color: '#667085' }}>{tailor.shopName || 'Fashion Studio'}</div>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: '#667085', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>📍</span> {tailor.location || tailor.shopLocation || 'Chennai'}
          </div>
          {tailor.experience && (
            <div style={{ fontSize: 12, color: '#667085', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>🕐</span> {tailor.experience}
            </div>
          )}
        </div>

        {tailor.specialist && (
          <div style={{
            display: 'inline-block', background: '#DDEBE7', color: '#0F5C5E',
            fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999, marginBottom: 10,
          }}>
            {tailor.specialist}
          </div>
        )}

        {tailor.services && tailor.services.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {tailor.services.slice(0, 2).map(s => (
              <span key={s} style={{
                fontSize: 10.5, color: '#667085', background: '#FCFBF7',
                border: '1px solid #E3E8E6', padding: '2px 8px', borderRadius: 999,
              }}>
                {s}
              </span>
            ))}
            {tailor.services.length > 2 && (
              <span style={{ fontSize: 10.5, color: '#9CA3AF' }}>+{tailor.services.length - 2} more</span>
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#C9A66B' }}>
            ⭐ {Number(tailor.rating || 4.8).toFixed(1)}
            <span style={{ fontSize: 11, fontWeight: 400, color: '#9CA3AF', marginLeft: 4 }}>
              ({tailor.reviewsCount || tailor.reviewCount || 0})
            </span>
          </div>
          <button
            onClick={e => { e.stopPropagation(); navigate(`/customer/tailors/${id}`) }}
            style={{
              background: '#0F5C5E', color: '#FFFFFF', border: 'none',
              padding: '7px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div style={{ background: '#FFFFFF', border: '1.5px solid #E3E8E6', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ height: 110, background: 'linear-gradient(90deg, #F2F6F5 25%, #E8EFF7 50%, #F2F6F5 75%)', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ padding: '14px 16px' }}>
        {[80, 60, 40].map(w => (
          <div key={w} style={{ height: 12, background: '#F2F6F5', borderRadius: 6, marginBottom: 10, width: `${w}%` }} />
        ))}
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <span style={{
      width: 14, height: 14, borderRadius: '50%',
      border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#FFFFFF',
      animation: 'spin 0.8s linear infinite', display: 'inline-block',
    }} />
  )
}

const labelStyle = {
  display: 'block', fontSize: 12.5, fontWeight: 600, color: '#1F2937', marginBottom: 6,
}
const inputStyle = {
  width: '100%', padding: '10px 12px', border: '1.5px solid #E3E8E6',
  borderRadius: 8, fontSize: 13.5, color: '#1F2937', background: '#FFFFFF', outline: 'none',
}
const selectStyle = {
  width: '100%', padding: '10px 12px', border: '1.5px solid #E3E8E6',
  borderRadius: 8, fontSize: 13.5, color: '#1F2937', background: '#FFFFFF', outline: 'none',
  appearance: 'auto',
}
const pageBtn = {
  background: '#FFFFFF', color: '#0F5C5E', border: '1.5px solid #E3E8E6',
  padding: '8px 18px', borderRadius: 8, fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
}
