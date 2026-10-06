import React from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import ProgressBar from '../../components/ProgressBar'
import Button from '../../components/Button'

export default function StudentProgress() {
  const milestones = [
    { title: 'Sewing Machine Setup & Bobbin Thread Tension', status: 'Completed', date: 'Aug 10, 2026' },
    { title: 'Accurate Body Measurement Tape Geometry', status: 'Completed', date: 'Aug 16, 2026' },
    { title: 'Princess Cut Bodice Drafting & Dart Apex', status: 'Completed', date: 'Aug 22, 2026' },
    { title: 'Aari Chain Stitch & Zari Winding Practical', status: 'Completed', date: 'Aug 28, 2026' },
    { title: 'Stone Fixing & Neckline Border Embellishment', status: 'In Progress', date: 'Target: Sept 04, 2026' },
    { title: 'Full Garment Assembly & Lining Reinforcement', status: 'Upcoming', date: 'Target: Sept 10, 2026' },
    { title: 'Final Viva Practical Project Submission', status: 'Upcoming', date: 'Target: Sept 15, 2026' }
  ]

  return (
    <DashboardLayout role="student">
      <div className="page-header">
        <div>
          <h1>Learning Progress & Syllabus Milestones</h1>
          <p>Detailed performance analytics, completion percentage, and curriculum checkpoint tracker.</p>
        </div>
        <Link to="/student/lessons">
          <Button variant="primary">▶ Continue Learning</Button>
        </Link>
      </div>

      {/* OVERALL SUMMARY */}
      <div className="card" style={{ marginBottom: 24, padding: 22 }}>
        <div className="flex-between" style={{ marginBottom: 12 }}>
          <h2 style={{ fontSize: 17, color: 'var(--primary-dark)', margin: 0 }}>Overall Curriculum Completion</h2>
          <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>65% Complete</span>
        </div>
        <ProgressBar value={65} />
      </div>

      {/* MILESTONE CHECKPOINTS */}
      <div className="card" style={{ padding: 22 }}>
        <h3 style={{ fontSize: 16, color: 'var(--primary-dark)', margin: '0 0 16px 0' }}>Practical Syllabus Milestones</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {milestones.map((m, idx) => (
            <div 
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: 8,
                background: m.status === 'Completed' ? 'var(--bg-page)' : m.status === 'In Progress' ? 'var(--primary-light)' : '#FAFAFA',
                border: m.status === 'In Progress' ? '1px solid var(--primary)' : '1px solid var(--border-light)'
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: m.status === 'Completed' ? 'var(--success)' : m.status === 'In Progress' ? 'var(--primary)' : 'var(--border-light)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700
                }}>
                  {m.status === 'Completed' ? '✓' : idx + 1}
                </span>
                <div>
                  <strong style={{ fontSize: 13.5, color: 'var(--primary-dark)' }}>{m.title}</strong>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{m.date}</div>
                </div>
              </div>

              <span className={m.status === 'Completed' ? 'badge badge-active' : m.status === 'In Progress' ? 'badge badge-urgent' : 'tag'}>
                {m.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
