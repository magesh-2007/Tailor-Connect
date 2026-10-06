import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import * as storage from '../../services/storageService'
import Button from '../../components/Button'
import { LoadingState, EmptyState } from '../../components/States'

export default function Courses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [modeFilter, setModeFilter] = useState('All')
  const [registerSuccess, setRegisterSuccess] = useState('')
  const [registerError, setRegisterError] = useState('')

  const loadData = () => {
    const all = storage.getOffers().filter((o) => o.type === 'Course' || o.targetAudience === 'Student')
    setCourses(all)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
    const handleDataChange = () => loadData()
    window.addEventListener('tc_data_changed', handleDataChange)
    return () => window.removeEventListener('tc_data_changed', handleDataChange)
  }, [])

  const handleRegister = (courseId) => {
    if (!user) return
    setRegisterError('')
    setRegisterSuccess('')

    const res = storage.registerForCourse(courseId, user)
    if (res.success) {
      setRegisterSuccess(`Successfully enrolled in "${res.offer.name}"!`)
      loadData()
      setTimeout(() => setRegisterSuccess(''), 4000)
    } else {
      setRegisterError(res.error || 'Registration failed.')
      setTimeout(() => setRegisterError(''), 4000)
    }
  }

  const categories = ['All', 'Aari Blouse', 'Bridal Blouse', 'Embroidery', 'Custom Dress']

  const filteredCourses = courses.filter((c) => {
    const term = search.toLowerCase()
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(term) ||
      (c.category && c.category.toLowerCase().includes(term)) ||
      (c.trainerName && c.trainerName.toLowerCase().includes(term)) ||
      (c.description && c.description.toLowerCase().includes(term))

    const matchesCat = categoryFilter === 'All' || c.category === categoryFilter
    const matchesMode = modeFilter === 'All' || c.mode === modeFilter

    return matchesSearch && matchesCat && matchesMode
  })

  return (
    <DashboardLayout role="student">
      <div className="page-header">
        <div>
          <h1>Tailoring & Embroidery Masterclasses</h1>
          <p>Learn specialized South Indian Aari needlework, bridal stitching, and drafting patterns from master tailors.</p>
        </div>
      </div>

      {registerSuccess && (
        <div style={{ background: '#E8F5E9', border: '1px solid #C8E6C9', color: '#2E7D32', padding: '12px 16px', borderRadius: 8, marginBottom: 16 }}>
          ✅ {registerSuccess}
        </div>
      )}

      {registerError && (
        <div style={{ background: '#FFEBEE', border: '1px solid #FFCDD2', color: '#C62828', padding: '12px 16px', borderRadius: 8, marginBottom: 16 }}>
          ⚠️ {registerError}
        </div>
      )}

      {/* SEARCH AND FILTERS */}
      <div className="card" style={{ marginBottom: 24, padding: 16 }}>
        <div className="form-row" style={{ alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 2 }}>
            <label>Search Masterclasses (e.g. Aari, Zari, Pattern Cutting)</label>
            <input
              className="form-control"
              placeholder="Search by course title or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Category</label>
            <select
              className="form-control"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Delivery Mode</label>
            <select
              className="form-control"
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
            >
              <option value="All">All Modes</option>
              <option value="Offline">Offline (Studio Workshop)</option>
              <option value="Online">Online (Live Video)</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Discovering tailoring masterclasses..." />
      ) : filteredCourses.length === 0 ? (
        <EmptyState message="No courses match your search criteria. Try modifying your search keywords." />
      ) : (
        <div className="card-grid-wide">
          {filteredCourses.map((c) => {
            const isEnrolled = c.registeredUserIds?.includes(user?.id)
            const remainingSeats = Math.max(0, (c.maxCapacity || 20) - (c.registeredStudents || 0))
            const isFull = remainingSeats === 0 || c.status === 'Closed'

            return (
              <div className="card" key={c.id}>
                <div style={{ position: 'relative' }}>
                  <img src={c.image} alt={c.name} className="image-card-img" style={{ height: 200 }} />
                  <span
                    className={`badge ${c.status === 'Active' ? 'badge-active' : 'badge-closed'}`}
                    style={{ position: 'absolute', top: 10, right: 10 }}
                  >
                    {c.status === 'Active' ? (isFull ? 'Seats Full' : 'Enrollment Open') : 'Closed'}
                  </span>
                  <span className="tag" style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(255,255,255,0.92)' }}>
                    {c.category} • {c.mode}
                  </span>
                </div>

                <div className="card-body">
                  <h3 style={{ fontSize: 17, margin: '0 0 4px 0' }}>{c.name}</h3>
                  <p className="muted" style={{ margin: '0 0 10px 0', fontSize: 13 }}>
                    Trainer: <strong>{c.trainerName}</strong> ({c.shopName})
                  </p>

                  <div style={{ background: '#FFF8FA', padding: '10px 14px', borderRadius: 8, marginBottom: 12 }}>
                    <div className="flex-between" style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary-dark)' }}>
                      <span>Fee: ₹{c.price}</span>
                      <span>⏱️ {c.durationDays} Days</span>
                    </div>
                    <div style={{ fontSize: 12, marginTop: 4, color: isFull ? 'var(--danger)' : 'var(--text-main)' }}>
                      👥 <strong>{c.registeredStudents || 0} Students Registered</strong> ({remainingSeats} seats left)
                    </div>
                  </div>

                  <p style={{ fontSize: 12.5, color: 'var(--text-main)', margin: '0 0 12px 0' }}>
                    <strong>Schedule:</strong> {c.availableDays} ({c.availableTime})<br />
                    <strong>Location:</strong> {c.location}
                  </p>

                  <div className="flex-between" style={{ gap: 8 }}>
                    <Link to={`/student/courses/${c.id}`} style={{ flex: 1 }}>
                      <Button variant="outline" size="sm" block>Syllabus & Lessons</Button>
                    </Link>

                    {isEnrolled ? (
                      <Link to={`/student/courses/${c.id}`} style={{ flex: 1 }}>
                        <Button variant="secondary" size="sm" block>✓ Enrolled (Study)</Button>
                      </Link>
                    ) : (
                      <Button
                        size="sm"
                        style={{ flex: 1 }}
                        disabled={isFull}
                        onClick={() => handleRegister(c.id)}
                      >
                        {isFull ? 'Capacity Full' : 'Register Now'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}
