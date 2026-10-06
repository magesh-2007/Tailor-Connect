import React from 'react'

const EmptyState = ({ 
  icon = '📭', 
  title = 'Nothing here yet', 
  description = 'No items to display',
  action = null 
}) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-description">{description}</p>
      {action && <div className="empty-action">{action}</div>}
      <style>{`
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }
        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        .empty-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 8px 0;
        }
        .empty-description {
          font-size: 14px;
          color: var(--text-light);
          margin: 0 0 20px 0;
          max-width: 400px;
        }
        .empty-action {
          margin-top: 8px;
        }
      `}</style>
    </div>
  )
}

export default EmptyState
