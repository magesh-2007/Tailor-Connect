import React from 'react'
import Rating from '../common/Rating'
import Button from '../common/Button'
import StatusBadge from '../common/StatusBadge'

const TailorCard = ({ tailor, onViewProfile, onChat, onSelect }) => {
  const { 
    name, 
    image, 
    rating, 
    totalReviews, 
    experience, 
    specialization, 
    priceRange,
    availability,
    verified,
    urgentAvailable
  } = tailor

  return (
    <div className="tailor-card">
      <div className="tailor-card-image">
        <img src={image || 'https://via.placeholder.com/200'} alt={name} />
        {verified && <span className="verified-badge">✓ Verified</span>}
        {urgentAvailable && <span className="urgent-badge">⚡ Urgent</span>}
      </div>
      <div className="tailor-card-content">
        <h3 className="tailor-card-name">{name}</h3>
        <Rating rating={rating} showCount totalReviews={totalReviews} size="small" />
        <p className="tailor-card-experience">{experience} years experience</p>
        <p className="tailor-card-specialization">{specialization?.join(', ')}</p>
        <p className="tailor-card-price">Price: {priceRange}</p>
        <StatusBadge status={availability ? 'Available' : 'Unavailable'} />
      </div>
      <div className="tailor-card-actions">
        <Button variant="outline" size="small" onClick={onViewProfile}>View Profile</Button>
        <Button variant="secondary" size="small" onClick={onChat}>💬 Chat</Button>
        {onSelect && <Button variant="primary" size="small" onClick={onSelect}>Select</Button>}
      </div>
      <style>{`
        .tailor-card {
          background: var(--white);
          border-radius: var(--radius);
          border: 1px solid var(--border);
          overflow: hidden;
          transition: var(--transition);
          display: flex;
          flex-direction: column;
        }
        .tailor-card:hover {
          box-shadow: var(--shadow-hover);
          transform: translateY(-2px);
        }
        .tailor-card-image {
          position: relative;
          height: 160px;
          overflow: hidden;
          background: var(--primary-light);
        }
        .tailor-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .verified-badge {
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
        .urgent-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background: #d32f2f;
          color: white;
          padding: 2px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }
        .tailor-card-content {
          padding: 16px;
          flex: 1;
        }
        .tailor-card-name {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }
        .tailor-card-experience,
        .tailor-card-specialization,
        .tailor-card-price {
          font-size: 13px;
          color: var(--text-light);
          margin: 4px 0;
        }
        .tailor-card-actions {
          display: flex;
          gap: 8px;
          padding: 12px 16px;
          border-top: 1px solid var(--border);
          flex-wrap: wrap;
        }
        .tailor-card-actions .btn {
          flex: 1;
          min-width: 60px;
        }
      `}</style>
    </div>
  )
}

export default TailorCard
