import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import Button from '../../components/Button'
import ProgressBar from '../../components/ProgressBar'

const LESSON_MODULES = [
  { id: 1, title: '1. Machine Setup, Tension & Threading Essentials', duration: '14 min', completed: true, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 2, title: '2. Standard Body Measurements & Drafting Geometry', duration: '18 min', completed: true, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 3, title: '3. Precision Bodice Cutting on Muslin Fabric', duration: '22 min', completed: true, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 4, title: '4. Sewing 4-Dart Front Bodice & Armhole Curves', duration: '26 min', completed: false, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 5, title: '5. Deep U-Neck Piping & Potli Button Finishing', duration: '20 min', completed: false, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 6, title: '6. Elbow Sleeve Attachment & Underarm Alignment', duration: '19 min', completed: false, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 7, title: '7. Final Fitting Adjustments & Side Margin Seams', duration: '15 min', completed: false, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
]

export default function StudentLessons() {
  const [modules, setModules] = useState(LESSON_MODULES)
  const [activeLessonId, setActiveLessonId] = useState(4)
  const [tab, setTab] = useState('notes') // 'notes' | 'downloads'
  const [notification, setNotification] = useState('')

  const activeLesson = modules.find(m => m.id === activeLessonId) || modules[0]
  const completedCount = modules.filter(m => m.completed).length
  const progressPercent = Math.round((completedCount / modules.length) * 100)

  const handleMarkComplete = (id) => {
    const updated = modules.map(m => m.id === id ? { ...m, completed: true } : m)
    setModules(updated)
    setNotification(`Lesson "${activeLesson.title}" marked as complete!`)
    
    // Auto advance to next lesson if available
    const nextIdx = modules.findIndex(m => m.id === id) + 1
    if (nextIdx < modules.length) {
      setActiveLessonId(modules[nextIdx].id)
    }
    setTimeout(() => setNotification(''), 3000)
  }

  return (
    <DashboardLayout role="student">
      <div className="page-header">
        <div>
          <h1>Aari Embroidery & Blouse Stitching Masterclass</h1>
          <p>Instructor: <strong>Lakshmi Devi</strong> • Curriculum Progress: <strong>{completedCount}/{modules.length} Completed ({progressPercent}%)</strong></p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/student/assignments">
            <Button variant="outline">📝 Practical Assignments</Button>
          </Link>
          <Link to="/student/quizzes">
            <Button variant="secondary">❓ Course Quiz</Button>
          </Link>
        </div>
      </div>

      {notification && (
        <div style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success-border)', padding: '10px 16px', borderRadius: 6, marginBottom: 20 }}>
          ✅ {notification}
        </div>
      )}

      {/* LESSON PLAYER & PLAYLIST GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 24, marginBottom: 30 }}>
        {/* MAIN VIDEO & LECTURE NOTES */}
        <div>
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
            {/* SIMULATED VIDEO PLAYER */}
            <div style={{ position: 'relative', background: '#1A181A', width: '100%', height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
              <div style={{ textAlign: 'center', padding: 20 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 12px auto', cursor: 'pointer' }}>
                  ▶
                </div>
                <h3 style={{ color: '#FFFFFF', fontSize: 17, margin: '0 0 6px 0' }}>{activeLesson.title}</h3>
                <span style={{ fontSize: 13, color: '#D1C7CB' }}>Duration: {activeLesson.duration} • HD 1080p Masterclass</span>
              </div>
            </div>

            <div style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)' }}>
              <div>
                <h2 style={{ fontSize: 18, margin: 0 }}>{activeLesson.title}</h2>
                <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Module {activeLesson.id} of {modules.length}</span>
              </div>
              <Button
                variant={activeLesson.completed ? 'secondary' : 'primary'}
                onClick={() => handleMarkComplete(activeLesson.id)}
              >
                {activeLesson.completed ? '✓ Completed' : 'Mark Lesson Complete'}
              </Button>
            </div>
          </div>

          {/* LESSON TRANSCRIPT & PATTERN DOWNLOADS */}
          <div className="card">
            <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid var(--border-light)', paddingBottom: 12, marginBottom: 16 }}>
              <button
                type="button"
                className={`btn btn-sm ${tab === 'notes' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setTab('notes')}
              >
                📖 Lesson Notes & Steps
              </button>
              <button
                type="button"
                className={`btn btn-sm ${tab === 'downloads' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setTab('downloads')}
              >
                📥 Pattern PDF Downloads
              </button>
            </div>

            {tab === 'notes' ? (
              <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-main)' }}>
                <h4 style={{ marginBottom: 6 }}>Key Takeaways for this Technique:</h4>
                <ul style={{ paddingLeft: 20, marginBottom: 14 }}>
                  <li>Maintain thread tension at dial level 4 for smooth double-stitch feed.</li>
                  <li>Ensure the armhole notch lines up with the side seam to prevent shoulder puckering.</li>
                  <li>Press open all seam allowances with a warm iron before attaching neck piping.</li>
                </ul>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Once you finish sewing this step on your practice fabric, take a clear photo and submit it on the <strong>Assignments</strong> tab for instructor grading.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ padding: 12, background: 'var(--bg-subtle)', borderRadius: 6, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>Standard Bodice Pattern (Size 36)</strong>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>PDF • 1.4 MB • Printable 1:1 Scale</div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => alert('Downloading Bodice Pattern PDF...')}>Download</Button>
                </div>
                <div style={{ padding: 12, background: 'var(--bg-subtle)', borderRadius: 6, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>Peacock Motif Aari Trace Stencil</strong>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>PDF • 850 KB • Carbon Tracing Ready</div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => alert('Downloading Stencil PDF...')}>Download</Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SIDE PLAYLIST */}
        <div className="card" style={{ padding: 18 }}>
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, margin: '0 0 6px 0' }}>Course Syllabus Playlist</h3>
            <ProgressBar value={progressPercent} height={6} showLabel />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {modules.map((m) => {
              const isCurrent = m.id === activeLessonId

              return (
                <div
                  key={m.id}
                  style={{
                    padding: 12,
                    borderRadius: 6,
                    border: isCurrent ? '1.5px solid var(--primary)' : '1px solid var(--border-light)',
                    background: isCurrent ? 'var(--bg-hover)' : m.completed ? 'var(--bg-card)' : 'var(--bg-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onClick={() => setActiveLessonId(m.id)}
                >
                  <div style={{ fontSize: 13 }}>
                    <div style={{ fontWeight: isCurrent ? 700 : 500, color: isCurrent ? 'var(--primary-dark)' : 'var(--text-main)', marginBottom: 2 }}>
                      {m.title}
                    </div>
                    <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{m.duration}</span>
                  </div>

                  <div>
                    {m.completed ? (
                      <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: 14 }}>✓</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>○</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid var(--border-light)' }}>
            <Link to="/student/quizzes">
              <Button variant="primary" size="sm" block>
                Take Course Completion Quiz →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
