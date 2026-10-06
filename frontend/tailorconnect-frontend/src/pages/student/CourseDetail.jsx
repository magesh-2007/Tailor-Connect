import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import * as storage from '../../services/storageService'
import ProgressBar from '../../components/ProgressBar'
import Button from '../../components/Button'
import { LoadingState, ErrorState } from '../../components/States'

const DEFAULT_LESSONS = [
  { id: 1, title: 'Lesson 1: Introduction to Needle Types & Tool Setup', duration: '20 min', video: 'Aari Needle Numbers 14 & 24 Handling' },
  { id: 2, title: 'Lesson 2: Zari Thread Winding & Basic Chain Stitch', duration: '35 min', video: 'Smooth Chain Stitch on Raw Silk Fabric' },
  { id: 3, title: 'Lesson 3: Stone Chain, Pearl Stringing & Sugar Beads', duration: '45 min', video: 'Fixing Stone Chains with Fabric Glue and Anchor Locking' },
  { id: 4, title: 'Lesson 4: Traditional Peacock Motif & Neckline Border Finish', duration: '50 min', video: 'Bridal Back Neck Layout and Final Knotting' }
]

export default function CourseDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeLesson, setActiveLesson] = useState(null)
  const [completedLessonIds, setCompletedLessonIds] = useState([1])
  const [certificateEarned, setCertificateEarned] = useState(null)
  const [registerSuccess, setRegisterSuccess] = useState('')

  const loadData = () => {
    const c = storage.getOfferById(id)
    if (c) {
      setCourse(c)
      const existingCerts = storage.getCertificatesForStudent(user?.id)
      const earned = existingCerts.find((cert) => cert.courseId === c.id)
      if (earned) {
        setCertificateEarned(earned)
        setCompletedLessonIds([1, 2, 3, 4])
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
    const handleDataChange = () => loadData()
    window.addEventListener('tc_data_changed', handleDataChange)
    return () => window.removeEventListener('tc_data_changed', handleDataChange)
  }, [id, user])

  if (loading) return <DashboardLayout role="student"><LoadingState /></DashboardLayout>
  if (!course) return <DashboardLayout role="student"><ErrorState message="Course not found." /></DashboardLayout>

  const isEnrolled = course.registeredUserIds?.includes(user?.id)
  const progressPercent = Math.round((completedLessonIds.length / DEFAULT_LESSONS.length) * 100)

  const handleEnroll = () => {
    if (!user) return
    const res = storage.registerForCourse(course.id, user)
    if (res.success) {
      setRegisterSuccess('Successfully registered! You can now access all learning lessons.')
      loadData()
    }
  }

  const handleCompleteLesson = (lessonId) => {
    if (!completedLessonIds.includes(lessonId)) {
      const next = [...completedLessonIds, lessonId]
      setCompletedLessonIds(next)

      // If all lessons finished, complete course and issue certificate
      if (next.length === DEFAULT_LESSONS.length) {
        const res = storage.completeCourseForStudent(course.id, user)
        if (res.success) {
          setCertificateEarned(res.certificate)
        }
      }
    }
  }

  return (
    <DashboardLayout role="student">
      <div className="page-header">
        <div>
          <h1>{course.name}</h1>
          <p>Taught by <strong>{course.trainerName}</strong> ({course.shopName}) • ⏱️ {course.durationDays} Days</p>
        </div>
        <Link to="/student/courses">
          <Button variant="outline">← Back to Courses</Button>
        </Link>
      </div>

      {registerSuccess && (
        <div style={{ background: '#E8F5E9', border: '1px solid #C8E6C9', color: '#2E7D32', padding: '12px 16px', borderRadius: 8, marginBottom: 16 }}>
          ✅ {registerSuccess}
        </div>
      )}

      {/* CERTIFICATE EARNED BANNER (SECTION 35) */}
      {certificateEarned && (
        <div style={{ background: '#E8F5E9', border: '2px solid #81C784', borderRadius: 12, padding: 20, marginBottom: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 6 }}>🏆 🎉</div>
          <h2 style={{ color: '#2E7D32', margin: '0 0 6px 0' }}>Course Completed Successfully!</h2>
          <p style={{ margin: '0 0 12px 0', fontSize: 14 }}>
            Congratulations <strong>{user?.name}</strong>! Your official certificate of completion (ID: <strong>{certificateEarned.id}</strong>) is ready for download.
          </p>
          <Link to="/student/certificates">
            <Button>View & Download Official PDF Certificate 📜</Button>
          </Link>
        </div>
      )}

      {/* COURSE HERO BANNER & PROGRESS */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ position: 'relative' }}>
          <img src={course.image} alt={course.name} className="image-card-img" style={{ height: 220 }} />
          <span className="tag" style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(255,255,255,0.92)' }}>
            {course.category} • {course.mode}
          </span>
        </div>

        <div className="card-body">
          <div className="flex-between" style={{ marginBottom: 8 }}>
            <h3 style={{ margin: 0 }}>Course Learning Progress</h3>
            <span style={{ fontWeight: 800, color: 'var(--primary-dark)' }}>{progressPercent}% Completed</span>
          </div>
          <ProgressBar value={progressPercent} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 16, fontSize: 13 }}>
            <div><strong>Location:</strong> {course.location}</div>
            <div><strong>Schedule:</strong> {course.availableDays} ({course.availableTime})</div>
            <div><strong>Price / Fee:</strong> ₹{course.price}</div>
            <div><strong>Batch Size:</strong> {course.registeredStudents || 0} / {course.maxCapacity} Students</div>
          </div>

          {!isEnrolled && (
            <div style={{ marginTop: 18, borderTop: '1px solid var(--border-light)', paddingTop: 16 }}>
              <Button size="lg" block onClick={handleEnroll}>
                Enroll in This Course (₹{course.price})
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* SYLLABUS & LESSONS */}
      <div className="section-title">📚 Course Lessons & Practical Modules</div>
      <div className="card" style={{ marginBottom: 24 }}>
        {DEFAULT_LESSONS.map((lesson) => {
          const isDone = completedLessonIds.includes(lesson.id)
          return (
            <div
              key={lesson.id}
              className="flex-between"
              style={{
                padding: '14px 18px',
                borderBottom: '1px solid var(--border-light)',
                cursor: 'pointer',
                background: activeLesson?.id === lesson.id ? 'var(--primary-light)' : 'transparent'
              }}
              onClick={() => setActiveLesson(lesson)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 18 }}>{isDone ? '✅' : '▶️'}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{lesson.title}</div>
                  <div className="muted" style={{ fontSize: 12 }}>Topic: {lesson.video}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="muted" style={{ fontSize: 12.5 }}>⏱️ {lesson.duration}</span>
                {isEnrolled && !isDone && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCompleteLesson(lesson.id)
                    }}
                  >
                    Mark Done
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* INTERACTIVE LESSON VIEWER */}
      {activeLesson && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-body">
            <h3 style={{ marginTop: 0 }}>Now Playing: {activeLesson.title}</h3>
            <p className="muted" style={{ margin: '0 0 14px 0' }}>Module: {activeLesson.video} • Master Trainer: {course.trainerName}</p>

            <div style={{
              background: 'linear-gradient(135deg, #111111, #333333)',
              height: 280,
              borderRadius: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              gap: 10
            }}>
              <div style={{ fontSize: 42 }}>🧵 ▶️</div>
              <div style={{ fontWeight: 600 }}>TailorConnect Video Masterclass Player</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Streaming high-definition Aari needlework demonstration</div>
            </div>

            <div className="flex-between" style={{ marginTop: 16 }}>
              <span className="muted">Lesson duration: {activeLesson.duration}</span>
              <Button
                variant={completedLessonIds.includes(activeLesson.id) ? 'secondary' : 'primary'}
                onClick={() => handleCompleteLesson(activeLesson.id)}
              >
                {completedLessonIds.includes(activeLesson.id) ? '✓ Completed' : 'Mark Lesson as Complete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* WHAT WILL BE TAUGHT & RECEIVED */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        <div className="card">
          <div className="card-body">
            <h4 style={{ marginTop: 0, color: 'var(--primary-dark)' }}>🧵 What Will Be Taught</h4>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6 }}>{course.whatWillBeTaught || 'Needle handling, chain stitch, stone fixing, and pattern cutting.'}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h4 style={{ marginTop: 0, color: 'var(--primary-dark)' }}>🏆 What You Will Receive</h4>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6 }}>{course.whatWillBeReceived || 'Verified Certificate of Completion, Stencil patterns, and tool kit.'}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
