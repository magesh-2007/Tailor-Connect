import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import * as storage from '../../services/storageService'
import { LoadingState, EmptyState } from '../../components/States'
import StatusBadge from '../../components/StatusBadge'
import Button from '../../components/Button'

export default function CourseApproval() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

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

  const handleToggleCourseStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Closed' : 'Active'
    storage.updateOffer(id, { status: newStatus })
    loadData()
  }

  return (
    <DashboardLayout role="admin">
      <div className="page-header">
        <div>
          <h1>Masterclass & Course Supervision</h1>
          <p>Supervise learning content, syllabus quality, and active student enrollment capacity.</p>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading courses..." />
      ) : courses.length === 0 ? (
        <EmptyState message="No courses published yet." />
      ) : (
        <div className="card-grid">
          {courses.map((c) => (
            <div className="card" key={c.id}>
              <img src={c.image} alt={c.name} className="image-card-img" style={{ height: 180 }} />
              <div className="card-body">
                <div className="flex-between">
                  <h4 style={{ margin: 0, fontSize: 16 }}>{c.name}</h4>
                  <StatusBadge status={c.status} />
                </div>
                <p className="muted" style={{ margin: '4px 0 8px 0', fontSize: 12.5 }}>
                  Instructor: <strong>{c.trainerName}</strong> • {c.mode}
                </p>
                <div style={{ background: '#FFF8FA', padding: '8px 12px', borderRadius: 6, fontSize: 12, marginBottom: 12 }}>
                  <div><strong>Fee:</strong> ₹{c.price} | <strong>Duration:</strong> {c.durationDays} Days</div>
                  <div><strong>Enrollments:</strong> {c.registeredStudents || 0}/{c.maxCapacity} Registered</div>
                </div>
                <Button
                  variant={c.status === 'Active' ? 'danger' : 'success'}
                  size="sm"
                  block
                  onClick={() => handleToggleCourseStatus(c.id, c.status)}
                >
                  {c.status === 'Active' ? 'Suspend / Close Batch' : 'Approve & Activate'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
