import React from 'react'

export default function ProgressBar({ value = 0, max = 100, height = 8, color = 'var(--primary)', showLabel = false }) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)))

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4, color: 'var(--text-secondary)' }}>
          <span>Progress</span>
          <strong style={{ color: 'var(--text-main)' }}>{percentage}%</strong>
        </div>
      )}
      <div 
        style={{ 
          width: '100%', 
          height, 
          backgroundColor: 'var(--bg-subtle)', 
          border: '1px solid var(--border-light)',
          borderRadius: 9999, 
          overflow: 'hidden' 
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: 9999,
            transition: 'width 0.3s ease'
          }}
        />
      </div>
    </div>
  )
}
