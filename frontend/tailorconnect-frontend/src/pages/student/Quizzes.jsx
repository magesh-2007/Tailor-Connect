import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import Button from '../../components/Button'
import ProgressBar from '../../components/ProgressBar'

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'When stitching a high-density Aari embroidery blouse, what type of needle is traditionally used for metallic Zari thread?',
    options: [
      'Standard No. 14 Domestic Machine Needle',
      'Wooden handle Aari Hook Needle (No. 24 thin)',
      'Large Yarn Tapestry Needle',
      'Universal Ballpoint Needle'
    ],
    correctAnswer: 1,
    explanation: 'A specialized thin Aari hook needle (No. 24) is used to pull the fine gold zari thread from beneath the fabric frame without snagging pure silk fibers.'
  },
  {
    id: 2,
    question: 'Why is a 1.5-inch to 2-inch side seam margin provided in custom-tailored bridal blouses?',
    options: [
      'To make the garment heavier',
      'To allow future body size alterations and tightness adjustments',
      'To hold decorative latkan tassels',
      'To prevent the lining from shrinking'
    ],
    correctAnswer: 1,
    explanation: 'Bespoke tailoring always includes a 1.5-inch inner side margin with extra rows of stitching to allow future adjustments without re-cutting.'
  },
  {
    id: 3,
    question: 'What is the primary purpose of inserting double interlock bias piping on necklines?',
    options: [
      'It adds stiffness only',
      'It prevents raw fabric edges from fraying and creates a clean contrast border',
      'It eliminates the need for inner lining',
      'It allows machine embroidery'
    ],
    correctAnswer: 1,
    explanation: 'True bias cut piping stretches around curves smoothly, securing raw raw-silk edges while adding a crisp decorative border.'
  },
  {
    id: 4,
    question: 'At which stage should chest and waist dart tapering be pressed with steam?',
    options: [
      'Only after the entire blouse is delivered',
      'Immediately after stitching the darts and before joining shoulder/side seams',
      'Before cutting the fabric',
      'Never press silk darts'
    ],
    correctAnswer: 1,
    explanation: 'Pressing darts immediately shapes the 3D contour of the bust and ensures clean, flat seam joinery.'
  }
]

export default function StudentQuizzes() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const currentQ = QUIZ_QUESTIONS[currentIdx]
  const progressPercent = Math.round(((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100)

  const handleSelectOption = (optIdx) => {
    if (quizSubmitted) return
    setSelectedOptions({
      ...selectedOptions,
      [currentQ.id]: optIdx
    })
  }

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1)
    }
  }

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1)
    }
  }

  const handleSubmitQuiz = () => {
    let correctCount = 0
    QUIZ_QUESTIONS.forEach(q => {
      if (selectedOptions[q.id] === q.correctAnswer) {
        correctCount += 1
      }
    })
    const finalScore = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100)
    setScore(finalScore)
    setQuizSubmitted(true)
  }

  const handleRetake = () => {
    setSelectedOptions({})
    setQuizSubmitted(false)
    setCurrentIdx(0)
    setScore(0)
  }

  const isPassed = score >= 75

  return (
    <DashboardLayout role="student">
      <div className="page-header">
        <div>
          <h1>Aari Embroidery & Tailoring Assessment Quiz</h1>
          <p>Test your understanding of pattern geometry, needlework tools, and tailoring standards. Score 75%+ to unlock your certificate.</p>
        </div>
        <Link to="/student/lessons">
          <Button variant="outline">← Return to Lessons</Button>
        </Link>
      </div>

      <div className="card" style={{ maxWidth: 780, margin: '0 auto', padding: 28 }}>
        {!quizSubmitted ? (
          <div>
            {/* QUIZ HEADER */}
            <div className="flex-between" style={{ marginBottom: 14 }}>
              <div>
                <span className="sidebar-role-badge" style={{ fontSize: 11 }}>
                  Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
                </span>
              </div>
              <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                Passing Score: <strong>75%</strong>
              </span>
            </div>

            <ProgressBar value={progressPercent} height={6} />

            <div style={{ marginTop: 24, marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, color: 'var(--text-main)', lineHeight: 1.45 }}>
                {currentQ.id}. {currentQ.question}
              </h2>
            </div>

            {/* OPTIONS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedOptions[currentQ.id] === optIdx

                return (
                  <div
                    key={optIdx}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 6,
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: isSelected ? 'var(--bg-hover)' : 'var(--bg-card)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      fontSize: 14,
                      transition: 'var(--transition)'
                    }}
                    onClick={() => handleSelectOption(optIdx)}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        border: isSelected ? '6px solid var(--primary)' : '2px solid var(--border)',
                        background: '#FFFFFF'
                      }}
                    />
                    <span>{opt}</span>
                  </div>
                )
              })}
            </div>

            {/* QUIZ CONTROLS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button variant="outline" size="sm" onClick={handlePrev} disabled={currentIdx === 0}>
                ← Previous
              </Button>

              {currentIdx < QUIZ_QUESTIONS.length - 1 ? (
                <Button variant="primary" size="sm" onClick={handleNext} disabled={selectedOptions[currentQ.id] === undefined}>
                  Next Question →
                </Button>
              ) : (
                <Button variant="primary" size="sm" onClick={handleSubmitQuiz} disabled={Object.keys(selectedOptions).length < QUIZ_QUESTIONS.length}>
                  Submit Quiz Answers ✓
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* QUIZ RESULTS VIEW */
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: isPassed ? 'var(--success-bg)' : 'var(--danger-bg)',
                color: isPassed ? 'var(--success)' : 'var(--danger)',
                fontSize: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}
            >
              {isPassed ? '✓' : '✕'}
            </div>

            <h2 style={{ fontSize: 22, color: 'var(--text-main)', marginBottom: 6 }}>
              {isPassed ? 'Congratulations! Assessment Passed!' : 'Assessment Incomplete'}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
              You scored <strong>{score}%</strong> ({score / 25} of 4 questions correct).
            </p>

            {isPassed ? (
              <div style={{ background: 'var(--bg-page)', padding: 18, borderRadius: 8, border: '1px solid var(--border)', marginBottom: 24, textAlign: 'left' }}>
                <strong style={{ fontSize: 14, color: 'var(--success)', display: 'block', marginBottom: 4 }}>
                  🎓 Certificate Requirement Met!
                </strong>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  Your score meets the accreditation threshold. Your official completion certificate has been generated and signed by master instructor <strong>Lakshmi Devi</strong>.
                </span>
              </div>
            ) : (
              <div style={{ background: 'var(--danger-bg)', padding: 16, borderRadius: 8, border: '1px solid var(--danger-border)', marginBottom: 24, textAlign: 'left' }}>
                <strong style={{ fontSize: 14, color: 'var(--danger)', display: 'block', marginBottom: 4 }}>
                  Minimum 75% required for certification.
                </strong>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  Review the video lessons and notes before retaking the quiz.
                </span>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              {isPassed ? (
                <Link to="/student/certificates">
                  <Button variant="primary" size="lg">
                    View & Download Certificate →
                  </Button>
                </Link>
              ) : (
                <Button variant="primary" size="lg" onClick={handleRetake}>
                  Retake Quiz ↺
                </Button>
              )}
              <Link to="/student/dashboard">
                <Button variant="outline" size="lg">
                  Student Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
