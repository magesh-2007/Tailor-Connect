import React from 'react'

const Rating = ({ rating, maxRating = 5, size = 'medium', showCount = false, totalReviews = 0 }) => {
  const filledStars = Math.round(rating)
  const emptyStars = maxRating - filledStars

  const sizeClasses = {
    small: 'star-sm',
    medium: 'star-md',
    large: 'star-lg'
  }

  return (
    <div className="rating-container">
      <div className="stars">
        {[...Array(filledStars)].map((_, i) => (
          <span key={`filled-${i}`} className={`star filled ${sizeClasses[size]}`}>★</span>
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className={`star empty ${sizeClasses[size]}`}>★</span>
        ))}
      </div>
      {showCount && totalReviews > 0 && (
        <span className="review-count">({totalReviews} reviews)</span>
      )}
      <style>{`
        .rating-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .stars {
          display: flex;
          gap: 2px;
        }
        .star {
          color: #e0e0e0;
        }
        .star.filled {
          color: #ffb300;
        }
        .star-sm { font-size: 14px; }
        .star-md { font-size: 18px; }
        .star-lg { font-size: 24px; }
        .review-count {
          font-size: 14px;
          color: var(--text-light);
        }
      `}</style>
    </div>
  )
}

export default Rating
