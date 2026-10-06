import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import Button from '../../components/Button'
import ProgressBar from '../../components/ProgressBar'

export default function StudentMyCourses() {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const raw = localStorage.getItem('tc_tailor_courses')
    let courseList = []
    if (raw) {
      courseList = JSON.parse(raw)
    } else {
      courseList = [
        {
          id: 'CRS-1',
          name: 'Basic Tailoring & Pattern Making',
          trainerName: 'Lakshmi Devi',
          duration: '15 Days',
          progress: 75,
          lessonsCount: 14,
          completedLessons: 10,
          image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&auto=format&fit=crop&q=80'
        },
        {
          id: 'CRS-2',
          name: 'Aari Embroidery & Maggam Work Masterclass',
          trainerName: 'Lakshmi Devi',
          duration: '20 Days',
          progress: 40,
          lessonsCount: 16,
          completedLessons: 6,
          image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80'
        }
      ]
    }
    setCourses(courseList)
  }, [])

  return (
    <DashboardLayout role="student">
      <div className="page-header">
        <div>
          <h1>My Enrolled Masterclasses & Courses</h1>
          <p>Resume your tailoring lessons, practice drafting blueprints, and take module tests.</p>
        </div>
        <Link to="/student/courses">
          <Button variant="primary">🔍 Browse More Courses</Button>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {courses.map(c => (
          <div className="card" key={c.id} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <img 
              src={c.image || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&auto=format&fit=crop&q=80'} 
              alt={c.name}
              style={{ width: '100%', height: 160, objectFit: 'cover' }}
            />
            <div className="card-body" style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ fontSize: 16, color: 'var(--primary-dark)', margin: '0 0 6px 0' }}>{c.name}</h3>
              <p className="muted" style={{ fontSize: 12.5, margin: '0 0 10px 0' }}>
                Instructor: <strong>{c.trainerName || 'Lakshmi Devi'}</strong> • {c.duration}
              </p>

              <div style={{ marginBottom: 14 }}>
                <div className="flex-between" style={{ fontSize: 12, marginBottom: 4 }}>
                  <span>Progress: {c.completedLessons || 8}/{c.lessonsCount || 12} Lessons</span>
                  <strong style={{ color: 'var(--primary)' }}>{c.progress || 60}%</strong>
                </div>
                <ProgressBar value={c.progress || 60} />
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
                <Link to={`/student/lessons?courseId=${c.id}`} style={{ flex: 1 }}>
                  <Button variant="primary" size="sm" block>▶ Resume Lesson</Button>
                </Link>
                <Link to={`/student/courses/${c.id}`}>
                  <Button variant="outline" size="sm">Details</Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
