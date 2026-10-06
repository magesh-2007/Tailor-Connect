import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const NAV_LINKS = [
  { label: 'Home', to: '/home' },
  { label: 'Find Tailors', to: '/home#tailors' },
  { label: 'Services', to: '/home#services' },
  { label: 'Courses', to: '/home#courses' },
  { label: 'About', to: '/home#about' },
]

const SERVICE_CATEGORIES = [
  { icon: '👗', title: 'Bridal Blouse', desc: 'Heavy Aari, Maggam & Zari work blouses tailored to perfection.', color: '#DDEBE7' },
  { icon: '🧵', title: 'Aari & Embroidery', desc: 'Handcrafted needle embroidery with stone, bead & metallic thread.', color: '#F0F7EF' },
  { icon: '✂️', title: 'Designer Blouse', desc: 'Contemporary designer blouses with custom patterns and cuts.', color: '#FFF8F0' },
  { icon: '📌', title: 'Saree Alteration', desc: 'Fall, pico, saree kuchu, waist tightening & border adjustments.', color: '#F5F0FB' },
  { icon: '👶', title: 'Kids Wear', desc: 'Pattu pavadai, ethnic kurtas, frocks & festive sets for children.', color: '#F0F9FF' },
  { icon: '🎀', title: 'Lehenga / Party Wear', desc: 'Custom party gowns, lehengas & modern ethnic designer outfits.', color: '#FFF0F5' },
  { icon: '🪡', title: 'Custom Stitching', desc: 'Bespoke tailoring based on your exact photos & measurements.', color: '#F5FBF0' },
  { icon: '🔧', title: 'Alterations', desc: 'Expert alterations for a perfect fit on any garment you own.', color: '#F0F4FB' },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: '🔍',
    title: 'Find Your Tailor',
    desc: 'Search by location, specialization, or service. Browse verified tailor profiles with portfolios and real reviews.',
  },
  {
    step: '02',
    icon: '📋',
    title: 'Submit Your Request',
    desc: 'Upload your reference design photo, describe what you want, set your budget and required date — no measurements needed.',
  },
  {
    step: '03',
    icon: '💬',
    title: 'Get Quotations',
    desc: 'Receive competitive quotes from tailors. Compare, ask questions, then accept the best offer.',
  },
  {
    step: '04',
    icon: '✅',
    title: 'Track & Receive',
    desc: 'Track stitching progress in real-time. Get delivery updates on a live map. Review your completed outfit.',
  },
]

const BENEFITS = [
  { icon: '🛡️', title: 'Verified Tailors', desc: 'Every tailor is manually verified by our team before they can accept orders.' },
  { icon: '💰', title: 'Competitive Pricing', desc: 'Get multiple quotes and compare. No hidden charges or surprise fees.' },
  { icon: '📍', title: 'Live Tracking', desc: 'Track your order from stitching to doorstep delivery on a live map.' },
  { icon: '⭐', title: 'Genuine Reviews', desc: 'Read real reviews from actual customers who received completed orders.' },
  { icon: '📱', title: 'Easy Communication', desc: 'Message your tailor directly. Get real-time notifications at every stage.' },
  { icon: '🎓', title: 'Learning Platform', desc: 'Learn tailoring from professionals through online and offline courses.' },
]

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tailors, setTailors] = useState([])
  const [offers, setOffers] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    // Load a sample of real tailors and offers from backend
    api.get('/tailors?limit=4').then(res => {
      const data = res.data?.data?.tailors || res.data?.tailors || []
      setTailors(data.slice(0, 4))
    }).catch(() => {})

    api.get('/offers?limit=4').then(res => {
      const data = res.data?.data?.offers || res.data?.offers || []
      setOffers(data.slice(0, 4))
    }).catch(() => {})
  }, [])

  const handleGetStarted = () => {
    if (user?.role) {
      const dest = {
        customer: '/customer/dashboard',
        tailor: '/tailor/dashboard',
        student: '/student/dashboard',
        admin: '/admin/dashboard',
        employee: '/employee/dashboard',
      }[user.role.toLowerCase()]
      navigate(dest || '/login')
    } else {
      navigate('/register')
    }
  }

  const handleFindTailor = () => {
    if (user?.role === 'customer') {
      navigate('/customer/tailors')
    } else {
      navigate('/login')
    }
  }

  const handleCategoryClick = (categoryTitle) => {
    if (user?.role === 'customer') {
      navigate(`/customer/tailors?specialist=${encodeURIComponent(categoryTitle)}`)
    } else {
      navigate(`/login`)
    }
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#263238', overflowX: 'hidden' }}>
      {/* ══════════════════════════════════════════════════════════ NAVBAR */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#FFFFFF',
        borderBottom: '1px solid #E3E8E6',
        boxShadow: '0 1px 8px rgba(15,92,94,0.07)',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto', padding: '0 24px',
          height: 66, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="#0F5C5E"/>
              <line x1="24" y1="10" x2="24" y2="33" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <ellipse cx="24" cy="9" rx="3" ry="1.8" stroke="#C9A66B" strokeWidth="1.5" fill="none"/>
              <ellipse cx="24" cy="12" rx="1.2" ry="1" stroke="white" strokeWidth="1.2" fill="none"/>
              <path d="M17 27 Q20.5 22 24 27 Q27.5 32 31 27" stroke="#C9A66B" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
              <circle cx="33" cy="15" r="2.2" fill="#C9A66B" opacity="0.9"/>
            </svg>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 800, color: '#0F5C5E', letterSpacing: '-0.03em' }}>
              Tailor<span style={{ color: '#C9A66B' }}>Connect</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', gap: 6, alignItems: 'center' }} className="home-desktop-nav">
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.to} style={{
                padding: '7px 14px', borderRadius: 7, fontSize: 14, fontWeight: 500,
                color: '#263238', textDecoration: 'none', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.target.style.background = '#E8F0EF'; e.target.style.color = '#0F5C5E' }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#263238' }}>
                {l.label}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {user ? (
              <button
                onClick={handleGetStarted}
                style={{
                  background: '#0F5C5E', color: '#FFFFFF', border: 'none',
                  padding: '9px 22px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.18s',
                }}
                onMouseEnter={e => e.target.style.background = '#0A4547'}
                onMouseLeave={e => e.target.style.background = '#0F5C5E'}
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link to="/login" style={{
                  padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                  color: '#0F5C5E', border: '1.5px solid #0F5C5E', textDecoration: 'none',
                  transition: 'all 0.15s',
                }}>Login</Link>
                <Link to="/register" style={{
                  background: '#0F5C5E', color: '#FFFFFF', border: 'none',
                  padding: '9px 22px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                  textDecoration: 'none', transition: 'all 0.18s',
                }}>Register</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════ HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #0A4547 0%, #0F5C5E 55%, #167A7D 100%)',
        padding: '90px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background pattern */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: 'radial-gradient(circle at 20% 50%, #C9A66B 1px, transparent 1px), radial-gradient(circle at 80% 20%, #C9A66B 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          {/* Left */}
          <div>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(201, 166, 107, 0.15)', border: '1px solid rgba(201, 166, 107, 0.35)',
              padding: '6px 16px', borderRadius: 9999, marginBottom: 28,
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#C9A66B' }}>
                ✦ Verified Tailors Across Tamil Nadu
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 52, fontWeight: 800, color: '#FFFFFF',
              lineHeight: 1.12, marginBottom: 22, letterSpacing: '-0.03em',
            }}>
              Find the right tailor<br />
              <span style={{ color: '#C9A66B' }}>for your style.</span>
            </h1>

            <p style={{
              fontSize: 17, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7,
              marginBottom: 36, maxWidth: 480,
            }}>
              Discover verified tailors, compare services, share your design, manage tailoring requests and track delivery — all in one platform.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button
                onClick={handleFindTailor}
                style={{
                  background: '#C9A66B', color: '#FFFFFF', border: 'none',
                  padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.18s', boxShadow: '0 4px 16px rgba(201,166,107,0.35)',
                }}
                onMouseEnter={e => e.target.style.background = '#B08D52'}
                onMouseLeave={e => e.target.style.background = '#C9A66B'}
              >
                Find a Tailor
              </button>
              <button
                onClick={handleGetStarted}
                style={{
                  background: 'transparent', color: '#FFFFFF',
                  border: '2px solid rgba(255,255,255,0.4)',
                  padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.18s',
                }}
                onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.borderColor = 'rgba(255,255,255,0.7)' }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(255,255,255,0.4)' }}
              >
                Get Started
              </button>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 36, marginTop: 48, flexWrap: 'wrap' }}>
              {[['500+', 'Verified Tailors'], ['10K+', 'Happy Customers'], ['50+', 'Cities'], ['4.8★', 'Avg. Rating']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#C9A66B', fontFamily: "'Outfit', sans-serif" }}>{n}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual card mockup */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <HeroCard />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ SERVICE CATEGORIES */}
      <section id="services" style={{ padding: '80px 24px', background: '#FCFBF7' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionHeader
            badge="Popular Services"
            title="Explore Tailoring Services"
            subtitle="Click a category to discover verified tailors specializing in that service."
          />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 18, marginTop: 40,
          }}>
            {SERVICE_CATEGORIES.map((cat) => (
              <button
                key={cat.title}
                onClick={() => handleCategoryClick(cat.title)}
                style={{
                  background: '#FFFFFF', border: '1.5px solid #E3E8E6',
                  borderRadius: 12, padding: '20px 22px', textAlign: 'left',
                  cursor: 'pointer', transition: 'all 0.2s', display: 'block', width: '100%',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#0F5C5E'
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,92,94,0.12)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#E3E8E6'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ fontSize: 30, marginBottom: 12 }}>{cat.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F5C5E', marginBottom: 6 }}>{cat.title}</h3>
                <p style={{ fontSize: 13, color: '#667085', lineHeight: 1.5, margin: 0 }}>{cat.desc}</p>
                <div style={{ marginTop: 14, fontSize: 13, fontWeight: 600, color: '#0F5C5E' }}>
                  Find Tailors →
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ FEATURED TAILORS */}
      {tailors.length > 0 && (
        <section id="tailors" style={{ padding: '80px 24px', background: '#FFFFFF' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <SectionHeader
              badge="Featured Tailors"
              title="Verified Tailor Studios"
              subtitle="Handpicked, verified tailors with proven portfolios and genuine reviews."
            />
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20, marginTop: 40,
            }}>
              {tailors.map(t => <TailorCard key={t.id || t._id} tailor={t} onView={() => navigate(user ? `/customer/tailors/${t.id || t._id}` : '/login')} />)}
            </div>
            <div style={{ textAlign: 'center', marginTop: 36 }}>
              <button
                onClick={() => navigate(user?.role === 'customer' ? '/customer/tailors' : '/login')}
                style={{
                  background: '#0F5C5E', color: '#FFFFFF', border: 'none',
                  padding: '13px 32px', borderRadius: 9, fontSize: 15, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.18s',
                }}
                onMouseEnter={e => e.target.style.background = '#0A4547'}
                onMouseLeave={e => e.target.style.background = '#0F5C5E'}
              >
                Browse All Tailors →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════ LATEST OFFERS */}
      {offers.length > 0 && (
        <section style={{ padding: '80px 24px', background: '#FCFBF7' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <SectionHeader
              badge="Latest Offers"
              title="Special Tailoring Offers"
              subtitle="Limited-time offers from verified tailors across our platform."
            />
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20, marginTop: 40,
            }}>
              {offers.map(o => <OfferCard key={o._id} offer={o} onView={() => navigate('/login')} />)}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════ HOW IT WORKS */}
      <section style={{ padding: '80px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionHeader
            badge="How It Works"
            title="Simple. Fast. Reliable."
            subtitle="From finding a tailor to receiving your outfit — TailorConnect handles everything."
          />
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 28, marginTop: 50,
          }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} style={{
                position: 'relative', padding: '28px 24px',
                background: '#FCFBF7', border: '1.5px solid #E3E8E6',
                borderRadius: 14, textAlign: 'center',
              }}>
                <div style={{
                  width: 54, height: 54, borderRadius: '50%',
                  background: '#0F5C5E', color: '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, margin: '0 auto 16px',
                }}>
                  {step.icon}
                </div>
                <div style={{
                  position: 'absolute', top: 12, right: 16,
                  fontSize: 11, fontWeight: 800, color: '#E3E8E6',
                  letterSpacing: '0.05em', fontFamily: "'Outfit', sans-serif",
                }}>
                  {step.step}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F5C5E', marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 13.5, color: '#667085', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ LEARNING */}
      <section id="courses" style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, #0A4547 0%, #0F5C5E 100%)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block', background: 'rgba(201,166,107,0.15)',
            border: '1px solid rgba(201,166,107,0.3)',
            padding: '5px 16px', borderRadius: 9999, marginBottom: 20,
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#C9A66B' }}>Learning Platform</span>
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 38, fontWeight: 800,
            color: '#FFFFFF', marginBottom: 18, letterSpacing: '-0.02em',
          }}>
            Learn Tailoring from Professionals
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, maxWidth: 580, margin: '0 auto 36px' }}>
            Join online and offline courses taught by experienced tailors. Master Aari embroidery, blouse designing, lehenga stitching and more.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate(user?.role === 'student' ? '/student/courses' : '/register?role=student')}
              style={{
                background: '#C9A66B', color: '#FFFFFF', border: 'none',
                padding: '13px 30px', borderRadius: 9, fontSize: 15, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.18s',
              }}
              onMouseEnter={e => e.target.style.background = '#B08D52'}
              onMouseLeave={e => e.target.style.background = '#C9A66B'}
            >
              Browse Courses
            </button>
            <button
              onClick={() => navigate('/register?role=tailor')}
              style={{
                background: 'transparent', color: '#FFFFFF',
                border: '2px solid rgba(255,255,255,0.4)',
                padding: '13px 30px', borderRadius: 9, fontSize: 15, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.18s',
              }}
              onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={e => { e.target.style.background = 'transparent' }}
            >
              Teach on TailorConnect
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ BENEFITS */}
      <section style={{ padding: '80px 24px', background: '#FCFBF7' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionHeader
            badge="Why TailorConnect"
            title="A Platform Built for Real Tailoring"
            subtitle="Not a generic marketplace. Purpose-built for the tailoring industry."
          />
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20, marginTop: 44,
          }}>
            {BENEFITS.map(b => (
              <div key={b.title} style={{
                background: '#FFFFFF', border: '1.5px solid #E3E8E6',
                borderRadius: 12, padding: '22px 20px', display: 'flex', gap: 16,
              }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 10,
                  background: '#DDEBE7', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 22, flexShrink: 0,
                }}>
                  {b.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F5C5E', marginBottom: 6 }}>{b.title}</h3>
                  <p style={{ fontSize: 13.5, color: '#667085', lineHeight: 1.55, margin: 0 }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ CTA */}
      <section style={{ padding: '72px 24px', background: '#FFFFFF' }}>
        <div style={{
          maxWidth: 700, margin: '0 auto', textAlign: 'center',
          background: 'linear-gradient(135deg, #0A4547 0%, #0F5C5E 100%)',
          borderRadius: 20, padding: '56px 40px',
        }}>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 34, fontWeight: 800,
            color: '#FFFFFF', marginBottom: 14, letterSpacing: '-0.02em',
          }}>
            Ready to get started?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', marginBottom: 32 }}>
            Join thousands of customers who found their perfect tailor on TailorConnect.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/register')}
              style={{
                background: '#C9A66B', color: '#FFFFFF', border: 'none',
                padding: '13px 32px', borderRadius: 9, fontSize: 15, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.18s',
              }}
              onMouseEnter={e => e.target.style.background = '#B08D52'}
              onMouseLeave={e => e.target.style.background = '#C9A66B'}
            >
              Create Free Account
            </button>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'transparent', color: '#FFFFFF',
                border: '2px solid rgba(255,255,255,0.5)',
                padding: '13px 32px', borderRadius: 9, fontSize: 15, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.18s',
              }}
              onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={e => { e.target.style.background = 'transparent' }}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ FOOTER */}
      <footer id="about" style={{
        background: '#0A4547', color: 'rgba(255,255,255,0.7)',
        padding: '52px 24px 24px',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 36, marginBottom: 40 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <svg width="30" height="30" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="24" fill="#C9A66B"/>
                  <line x1="24" y1="10" x2="24" y2="33" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <ellipse cx="24" cy="9" rx="3" ry="1.8" stroke="white" strokeWidth="1.5" fill="none"/>
                </svg>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>
                  Tailor<span style={{ color: '#C9A66B' }}>Connect</span>
                </span>
              </div>
              <p style={{ fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>
                India's trusted tailoring services and learning platform. Connecting customers with verified tailors since 2024.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', marginBottom: 14 }}>Platform</h4>
              {['Find Tailors', 'Browse Courses', 'Post Your Request', 'Track Delivery', 'Reviews'].map(l => (
                <div key={l} style={{ marginBottom: 8 }}>
                  <a href="#" style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}
                    onMouseEnter={e => e.target.style.color = '#C9A66B'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
                  >{l}</a>
                </div>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', marginBottom: 14 }}>For Tailors</h4>
              {['Register as Tailor', 'Manage Orders', 'Post Offers', 'Teach Courses', 'Get Verified'].map(l => (
                <div key={l} style={{ marginBottom: 8 }}>
                  <a href="#" style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>{l}</a>
                </div>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', marginBottom: 14 }}>Company</h4>
              {['About Us', 'Privacy Policy', 'Terms of Service', 'Contact Support', 'Admin Login'].map((l, i) => (
                <div key={l} style={{ marginBottom: 8 }}>
                  <a
                    href={i === 4 ? '/admin/login' : '#'}
                    style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}
                  >{l}</a>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 13, margin: 0 }}>© 2026 TailorConnect. All rights reserved.</p>
            <p style={{ fontSize: 13, margin: 0 }}>Made with ♥ in Tamil Nadu, India</p>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .home-desktop-nav { display: none !important; }
        }
      `}</style>
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────────────────────

function SectionHeader({ badge, title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
      <div style={{
        display: 'inline-block',
        background: '#DDEBE7', border: '1px solid #E3E8E6',
        padding: '5px 16px', borderRadius: 9999, marginBottom: 14,
      }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#0F5C5E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{badge}</span>
      </div>
      <h2 style={{
        fontFamily: "'Outfit', sans-serif", fontSize: 32, fontWeight: 800,
        color: '#263238', marginBottom: 12, letterSpacing: '-0.02em',
      }}>{title}</h2>
      <p style={{ fontSize: 15, color: '#667085', lineHeight: 1.65, margin: 0 }}>{subtitle}</p>
    </div>
  )
}

function TailorCard({ tailor, onView }) {
  return (
    <div style={{
      background: '#FFFFFF', border: '1.5px solid #E3E8E6',
      borderRadius: 14, overflow: 'hidden', transition: 'all 0.2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,92,94,0.12)'; e.currentTarget.style.borderColor = '#0F5C5E' }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E3E8E6' }}
    >
      <div style={{ height: 120, background: 'linear-gradient(135deg, #0F5C5E 0%, #167A7D 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {tailor.profileImage ? (
          <img src={tailor.profileImage} alt={tailor.name} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid #C9A66B' }} />
        ) : (
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#C9A66B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#FFFFFF', fontWeight: 800 }}>
            {tailor.name?.[0] || 'T'}
          </div>
        )}
      </div>
      <div style={{ padding: '16px 18px' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F5C5E', marginBottom: 3 }}>{tailor.name}</h3>
        <div style={{ fontSize: 13, color: '#667085', marginBottom: 4 }}>{tailor.shopName || 'Fashion Studio'}</div>
        <div style={{ fontSize: 12.5, color: '#9CA3AF', marginBottom: 10 }}>📍 {tailor.location || tailor.shopLocation || 'Chennai'}</div>
        {tailor.specialist && (
          <div style={{
            display: 'inline-block', background: '#DDEBE7', color: '#0F5C5E',
            fontSize: 11.5, fontWeight: 600, padding: '3px 10px', borderRadius: 9999, marginBottom: 12,
          }}>
            {tailor.specialist}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#C9A66B' }}>⭐ {tailor.rating || '4.8'}</div>
          <button
            onClick={onView}
            style={{
              background: '#0F5C5E', color: '#FFFFFF', border: 'none',
              padding: '7px 16px', borderRadius: 7, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
            }}
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  )
}

function OfferCard({ offer, onView }) {
  return (
    <div style={{
      background: '#FFFFFF', border: '1.5px solid #E3E8E6',
      borderRadius: 14, overflow: 'hidden', transition: 'all 0.2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,92,94,0.1)'; e.currentTarget.style.borderColor = '#C9A66B' }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E3E8E6' }}
    >
      <div style={{
        height: 110, background: 'linear-gradient(135deg, #C9A66B 0%, #B08D52 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{offer.category}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>₹{offer.price}</div>
        </div>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F5C5E', marginBottom: 6 }}>{offer.title}</h3>
        <p style={{ fontSize: 12.5, color: '#667085', lineHeight: 1.55, margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {offer.description || 'Special limited-time offer from a verified tailor.'}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: '#9CA3AF' }}>Valid till {offer.endDate}</div>
          <button
            onClick={onView}
            style={{
              background: '#DDEBE7', color: '#0F5C5E', border: 'none',
              padding: '6px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            View Offer
          </button>
        </div>
      </div>
    </div>
  )
}

function HeroCard() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: 20, padding: '28px 24px', width: '100%', maxWidth: 380,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#C9A66B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>👩‍🦱</div>
        <div>
          <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: 15 }}>Lakshmi Devi</div>
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)' }}>Bridal Blouse Specialist • Chennai</div>
        </div>
      </div>
      {[
        { label: 'Rating', value: '⭐ 4.9 (127 reviews)' },
        { label: 'Experience', value: '12 Years' },
        { label: 'Specialization', value: 'Aari & Heavy Work' },
      ].map(row => (
        <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{row.label}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>{row.value}</span>
        </div>
      ))}
      <div style={{ marginTop: 18, background: '#C9A66B', borderRadius: 8, padding: '10px 0', textAlign: 'center', fontSize: 13.5, fontWeight: 700, color: '#FFFFFF', cursor: 'pointer' }}>
        Request Tailoring Service →
      </div>
    </div>
  )
}
