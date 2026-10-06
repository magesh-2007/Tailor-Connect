import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import Button from '../../components/Button'
import StatusBadge from '../../components/StatusBadge'
import Modal from '../../components/Modal'

const INITIAL_ASSIGNMENTS = [
  {
    id: 1,
    title: 'Draft Peacock Motif Aari Pattern on Silk Swatch',
    course: 'Aari Embroidery Masterclass',
    instructor: 'Lakshmi Devi',
    dueDate: '2026-09-06',
    status: 'Pending',
    description: 'Use the downloadable stencil to trace a floral peacock motif on a 10x10 silk frame and execute chain stitch with gold zari cord.',
    submittedImage: null,
    grade: null,
    feedback: null
  },
  {
    id: 2,
    title: 'Sew 4-Dart Bodice Trial Fitting on Muslin',
    course: 'Basic Tailoring & Pattern Making',
    instructor: 'Lakshmi Devi',
    dueDate: '2026-08-30',
    status: 'Graded',
    description: 'Draft the front and back bodice pattern using provided size 36 measurements, stitch the 4 darts, and press seams flat.',
    submittedImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&auto=format&fit=crop&q=80',
    grade: '95 / 100 (Grade A+)',
    feedback: 'Excellent armhole symmetry and crisp dart tapering. Good thread tension control.'
  },
  {
    id: 3,
    title: 'Piping & Concealed Hook Attachment Test',
    course: 'Blouse Stitching & Perfect Fitting',
    instructor: 'Lakshmi Devi',
    dueDate: '2026-09-12',
    status: 'Pending',
    description: 'Create a 1/8th inch bias double piping with contrast cord and attach 5 concealed hooks with eye loops.',
    submittedImage: null,
    grade: null,
    feedback: null
  }
]

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS)
  const [uploadModal, setUploadModal] = useState(false)
  const [selectedAssn, setSelectedAssn] = useState(null)
  const [filePreview, setFilePreview] = useState('')
  const [studentNotes, setStudentNotes] = useState('')
  const [notification, setNotification] = useState('')

  const openUploadModal = (assn) => {
    setSelectedAssn(assn)
    setFilePreview('')
    setStudentNotes('')
    setUploadModal(true)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setFilePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitAssignment = (e) => {
    e.preventDefault()
    if (!selectedAssn) return

    const updated = assignments.map(a => {
      if (a.id === selectedAssn.id) {
        return {
          ...a,
          status: 'Submitted',
          submittedImage: filePreview || 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&auto=format&fit=crop&q=80',
          grade: 'Under Review',
          feedback: 'Instructor Lakshmi Devi has received your practical submission.'
        }
      }
      return a
    })

    setAssignments(updated)
    setNotification(`Practical stitch assignment #${selectedAssn.id} submitted for review!`)
    setUploadModal(false)
    setTimeout(() => setNotification(''), 3000)
  }

  return (
    <DashboardLayout role="student">
      <div className="page-header">
        <div>
          <h1>Practical Needlework Assignments</h1>
          <p>Submit photos of your practice stitch swatches, receive instructor critique, and earn grading points toward certification.</p>
        </div>
        <Link to="/student/lessons">
          <Button variant="outline">← Return to Lessons</Button>
        </Link>
      </div>

      {notification && (
        <div style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success-border)', padding: '10px 16px', borderRadius: 6, marginBottom: 20 }}>
          ✅ {notification}
        </div>
      )}

      {/* ASSIGNMENTS LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {assignments.map((assn) => {
          const isPending = assn.status === 'Pending'
          const isGraded = assn.status === 'Graded'
          const isSubmitted = assn.status === 'Submitted'

          return (
            <div key={assn.id} className="card" style={{ padding: 22 }}>
              <div className="flex-between" style={{ marginBottom: 10, alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 17, color: 'var(--text-main)', margin: 0 }}>
                      Task #{assn.id}: {assn.title}
                    </h3>
                    <StatusBadge status={assn.status} />
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                    Course: <strong>{assn.course}</strong> • Instructor: <strong>{assn.instructor}</strong> • Due: <strong>{assn.dueDate}</strong>
                  </div>
                </div>

                {isGraded && (
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>Verified Grade</span>
                    <strong style={{ color: 'var(--success)', fontSize: 15 }}>{assn.grade}</strong>
                  </div>
                )}
              </div>

              <p style={{ fontSize: 13, color: 'var(--text-main)', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                {assn.description}
              </p>

              {/* SUBMISSION / FEEDBACK CONTAINER */}
              {(isGraded || isSubmitted) && (
                <div style={{ background: 'var(--bg-page)', padding: 14, borderRadius: 6, border: '1px solid var(--border)', marginBottom: 14, display: 'flex', gap: 16, alignItems: 'center' }}>
                  {assn.submittedImage && (
                    <img src={assn.submittedImage} alt="Submitted Swatch" style={{ width: 68, height: 68, borderRadius: 4, objectFit: 'cover', border: '1px solid var(--border)' }} />
                  )}
                  <div>
                    <strong style={{ fontSize: 13, display: 'block', color: 'var(--text-main)' }}>Instructor Feedback:</strong>
                    <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>"{assn.feedback}"</span>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                {isPending && (
                  <Button size="sm" variant="primary" onClick={() => openUploadModal(assn)}>
                    📷 Upload Practice Photo & Submit
                  </Button>
                )}
                <Link to="/student/lessons">
                  <Button size="sm" variant="outline">
                    View Related Lesson
                  </Button>
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* UPLOAD MODAL */}
      {uploadModal && selectedAssn && (
        <Modal
          title={`Submit Assignment: ${selectedAssn.title}`}
          onClose={() => setUploadModal(false)}
          maxWidth={540}
        >
          <form onSubmit={handleSubmitAssignment}>
            <div className="form-group">
              <label className="form-label">Upload Swatch / Bodice Photo <span className="required">*</span></label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleFileUpload}
                required
              />
              <span className="form-hint">Take a clear, top-down photo showing needlework stitches or dart lines.</span>
            </div>

            {filePreview && (
              <div style={{ marginBottom: 16 }}>
                <img src={filePreview} alt="Preview" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6 }} />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Student Notes / Questions for Instructor</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Mention any difficulties with thread tension, curve alignment, or fabric handling..."
                value={studentNotes}
                onChange={(e) => setStudentNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button variant="outline" size="sm" onClick={() => setUploadModal(false)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm">
                Submit for Grading →
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  )
}
