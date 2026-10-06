import React from 'react'

const Loading = ({ message = 'Loading...', size = 'medium' }) => {
  const sizeClasses = {
    small: 'loader-sm',
    medium: 'loader-md',
    large: 'loader-lg'
  }

  return (
    <div className="loading-container">
      <div className={`loader ${sizeClasses[size]}`} />
      {message && <p className="loading-message">{message}</p>}
      <style>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          gap: 16px;
        }
        .loader {
          border: 3px solid var(--primary-light);
          border-top: 3px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .loader-sm { width: 24px; height: 24px; }
        .loader-md { width: 40px; height: 40px; }
        .loader-lg { width: 56px; height: 56px; }
        .loading-message {
          color: var(--text-light);
          font-size: 14px;
          margin: 0;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default Loading
