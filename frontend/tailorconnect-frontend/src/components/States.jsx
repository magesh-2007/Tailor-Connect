import React from 'react'

export function LoadingState({ message = 'Loading...' }) {
  return <div className="loading-state">{message}</div>
}

export function ErrorState({ message = 'Something went wrong.' }) {
  return <div className="error-state">{message}</div>
}

export function EmptyState({ message = 'No data available.' }) {
  return <div className="empty-state">{message}</div>
}
