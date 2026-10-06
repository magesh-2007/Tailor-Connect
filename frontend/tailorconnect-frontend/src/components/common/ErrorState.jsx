import React from 'react'
import Button from './Button'

const ErrorState = ({ 
  title = 'Something went wrong', 
  message = 'An error occurred while loading this content',
  onRetry = null 
}) => {
  return (
    <div className="error-state">
      <div className="error-icon">⚠️</div>
      <h3 className="error-title">{title}</h3>
      <p className="error-message">{message}</p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          Try Again
        </Button>
      )}
      <style>{`
        .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }
        .error-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        .error-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 8px 0;
        }
        .error-message {
          font-size: 14px;
          color: var(--text-light);
          margin: 0 0 20px 0;
          max-width: 400px;
        }
      `}</style>
    </div>
  )
}

export default ErrorState
