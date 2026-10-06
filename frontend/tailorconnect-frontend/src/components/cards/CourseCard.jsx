import React from 'react'
import Rating from '../common/Rating'
import ProgressBar from '../common/ProgressBar'
import Button from '../common/Button'

const CourseCard = ({ course, onView, onEnroll, enrolled = false, progress = 0 }) => {
  const { 
    title, 
    image, 
    instructor, 
    rating, 
    totalReviews, 
    level, 
    duration,
    lessons,
    category,
    price
  } = course

  return (
    <div className="course-card">
      <div className="course-card-image">
        <img src={image || 'https://via.placeholder.com/300x180'} alt={title} />
        <span className="course-level">{level}</span>
        {enrolled && <span className="enrolled-badge">✓ Enrolled</span>}
      </div>
      <div className="course-card-content">
        <h3 className="course-card-title">{title}</h3>
        <p className="course-card-instructor">By {instructor}</p>
        <Rating rating={rating} showCount totalReviews={totalReviews} size="small" />
        <div className="course-card-meta">
          <span>📚 {lessons} lessons</span>
          <span>⏱️ {duration}</span>
        </div>
        <p className="course-card-category">{category}</p>
        {enrolled && progress > 0 && (
          <ProgressBar progress={progress} label="Progress" size="small" />
        )}
        {!enrolled && <p className="course-card-price">{price || 'Free'}</p>}
      </div>
      <div className="course-card-actions">
        <Button variant="outline" size="small" onClick={onView}>View Details</Button>
        {enrolled ? (
          <Button variant="secondary" size="small" onClick={onView}>Continue</Button>
        ) : (
          <Button variant="primary" size="small" onClick={onEnroll}>Enroll Now</Button>
        )}
      </div>
      <style>{`
        .course-card {
          background: var(--white);
          border-radius: var(--radius);
          border: 1px solid var(--border);
          overflow: hidden;
          transition: var(--transition);
          display: flex;
          flex-direction: column;
        }
        .course-card:hover {
          box-shadow: var(--shadow-hover);
          transform: translateY(-2px);
        }
        .course-card-image {
          position: relative;
          height: 160px;
          overflow: hidden;
          background: var(--primary-light);
        }
        .course-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .course-level {
          position: absolute;
          bottom: 8px;
          left: 8px;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 2px 12px;
          border-radius: 20px;
          font-size: 11px;
        }
        .enrolled-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: var(--success);
          color: white;
          padding: 2px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }
        .course-card-content {
          padding: 16px;
          flex: 1;
        }
        .course-card-title {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }
        .course-card-instructor {
          font-size: 13px;
          color: var(--text-light);
          margin: 0 0 8px 0;
        }
        .course-card-meta {
          display: flex;
          gap: 12px;
          font-size: 13px;
          color: var(--text-light);
          margin: 8px 0;
        }
        .course-card-category {
          font-size: 12px;
          color: var(--primary);
          background: var(--primary-light);
          display: inline-block;
          padding: 1px 12px;
          border-radius: 12px;
        }
        .course-card-price {
          font-size: 16px;
          font-weight: 700;
          color: var(--primary);
          margin-top: 8px;
        }
        .course-card-actions {
          display: flex;
          gap: 8px;
          padding: 12px 16px;
          border-top: 1px solid var(--border);
        }
        .course-card-actions .btn {
          flex: 1;
        }
      `}</style>
    </div>
  )
}

export default CourseCard
