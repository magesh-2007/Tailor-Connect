import React from 'react'

const Card = ({ 
  children, 
  title, 
  subtitle,
  className = '',
  hoverable = false,
  padding = 'medium'
}) => {
  const paddingClasses = {
    small: 'card-padding-sm',
    medium: 'card-padding-md',
    large: 'card-padding-lg',
    none: 'card-padding-none'
  }

  return (
    <div className={`card ${hoverable ? 'card-hoverable' : ''} ${paddingClasses[padding]} ${className}`}>
      {title && <h3 className="card-title">{title}</h3>}
      {subtitle && <p className="card-subtitle">{subtitle}</p>}
      <div className="card-body">{children}</div>
      <style>{`
        .card {
          background: var(--white);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          transition: var(--transition);
          border: 1px solid var(--border);
        }
        .card-hoverable:hover {
          box-shadow: var(--shadow-hover);
          transform: translateY(-2px);
        }
        .card-padding-sm { padding: 12px; }
        .card-padding-md { padding: 20px; }
        .card-padding-lg { padding: 28px; }
        .card-padding-none { padding: 0; }
        .card-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: var(--text);
        }
        .card-subtitle {
          font-size: 14px;
          color: var(--text-light);
          margin: 0 0 16px 0;
        }
        .card-body {
          color: var(--text);
        }
      `}</style>
    </div>
  )
}

export default Card
