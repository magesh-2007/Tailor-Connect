import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import Button from '../../components/Button'

export default function AdminCourses() {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const defaultCourses = [
      { id: 'CRS-1', name: 'Basic Tailoring & Pattern Making', trainerName: 'Lakshmi Devi', duration: '15 Days', fee: 499, category: 'Beginner', enrolled: 18, status: 'Approved' },
      { id: 'CRS-2', name: 'Blouse Stitching & Pattern Architecture', trainerName: 'Lakshmi Devi', duration: '10 Days', fee: 799, category: 'Bridal Wear', enrolled: 14, status: 'Approved' },
      { id: 'CRS-3', name: 'Aari Embroidery & Maggam Work Masterclass', trainerName: 'Mrs. Radha Raman', duration: '20 Days', fee: 1299, category: 'Aari Embroidery', enrolled: 15, status: 'Approved' },
      { id: 'CRS-4', name: 'Advanced Dress Designing & Fitting', trainerName: 'Suresh Kumar', duration: '30 Days', fee: 1899, category: 'Designer Wear', enrolled: 11, status: 'Pending Review' }
    ]
    setCourses(defaultCourses)
  }, [])

  return (
    <DashboardLayout role="admin">
      <div className="page-header">
        <div>
          <h1>Masterclasses & Course Management</h1>
          <p>Supervise tailor-published courses, approve new workshop curriculums, and track total student enrollments.</p>
        </div>
        <Link to="/admin/course-approval">
          <Button variant="primary">📋 Course Approval Queue</Button>
        </Link>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--primary-light)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Course ID</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Course Title</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Instructor / Boutique</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Category</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Duration</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Fee</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Enrolled</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)', fontSize: 13 }}>{c.id}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}><strong>{c.name}</strong></td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>{c.trainerName}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}><span className="tag">{c.category}</span></td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>{c.duration}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700 }}>₹{c.fee}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>{c.enrolled} Students</td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>
                    <span className={c.status === 'Approved' ? 'badge badge-active' : 'badge badge-urgent'}>{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
