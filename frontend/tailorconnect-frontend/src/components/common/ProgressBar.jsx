import React from 'react'

const ProgressBar = ({ 
  progress, 
  label, 
  showPercentage = true,
  color = 'var(--primary)',
  height = '8px'
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress))

  return (
    <div className="progress-wrapper">
      {label && <div className="progress-label">{label}</div>}
      <div className="progress-track" style={{ height }}>
        <div 
          className="progress-fill" 
          style={{ 
            width: `${clampedProgress}%`,
            background: color,
            height
          }}
        />
      </div>
      {showPercentage && (
        <div className="progress-percentage">{Math.round(clampedProgress)}%</div>
      )}
      <style>{`
        .progress-wrapper {
          width: 100%;
        }
        .progress-label {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 4px;
          color: var(--text);
        }
        .progress-track {
          background: var(--border);
          border-radius: 10px;
          overflow: hidden;
          position: relative;
        }
        .progress-fill {
          border-radius: 10px;
          transition: width 0.6s ease;
        }
        .progress-percentage {
          font-size: 12px;
          color: var(--text-light);
          margin-top: 4px;
          text-align: right;
        }
      `}</style>
    </div>
  )
}

export default ProgressBar
