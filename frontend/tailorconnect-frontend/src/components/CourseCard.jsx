import React from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'
import ProgressBar from './ProgressBar'

export default function CourseCard({ course }) {
  const title = course.name || course.title || 'Tailoring Course'
  const trainer = course.trainerName || course.instructor || 'Master Tailor'
  const duration = course.durationDays ? `${course.durationDays} Days` : (course.duration || '4 weeks')
  const price = typeof course.price === 'number' ? `₹${course.price}` : course.price

  return (
    <div className="card">
      <img src={course.image} alt={title} className="image-card-img" loading="lazy" />
      <div className="card-body">
        <h4 style={{ margin: '0 0 4px 0', fontSize: 16 }}>{title}</h4>
        <p className="muted" style={{ margin: '0 0 8px 0', fontSize: 12.5 }}>
          {trainer} • {duration}
        </p>
        <div className="flex-between" style={{ margin: '8px 0' }}>
          <span className="tag">{course.category || 'Embroidery'}</span>
          <strong style={{ color: 'var(--primary-dark)', fontSize: 14 }}>{price}</strong>
        </div>
        {typeof course.progress === 'number' && <ProgressBar value={course.progress} />}
        <Link to={`/student/courses/${course.id}`}>
          <Button variant="primary" block style={{ marginTop: 10 }}>
            {course.progress > 0 ? 'Continue Lessons →' : 'View Course & Enroll'}
          </Button>
        </Link>
      </div>
    </div>
  )
}
