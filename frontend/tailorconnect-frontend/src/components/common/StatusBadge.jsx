import React from 'react'

const StatusBadge = ({ status, size = 'medium' }) => {
  const getStatusConfig = () => {
    const configs = {
      // Order statuses
      'Requested': { color: '#f57c00', bg: '#fff3e0' },
      'Quotation': { color: '#1976d2', bg: '#e3f2fd' },
      'Tailor Confirmed': { color: '#2e7d32', bg: '#e8f5e9' },
      'Measurement Verified': { color: '#00838f', bg: '#e0f7fa' },
      'Cutting': { color: '#6a1b9a', bg: '#f3e5f5' },
      'Stitching': { color: '#ad1457', bg: '#fce4ec' },
      'Aari/Embroidery': { color: '#e65100', bg: '#fff3e0' },
      'Quality Check': { color: '#283593', bg: '#e8eaf6' },
      'Ready': { color: '#2e7d32', bg: '#e8f5e9' },
      'Delivery': { color: '#00695c', bg: '#e0f2f1' },
      'Completed': { color: '#1b5e20', bg: '#e8f5e9' },
      'Delayed': { color: '#c62828', bg: '#ffebee' },
      'Urgent': { color: '#d50000', bg: '#ffebee' },
      'Normal': { color: '#1565c0', bg: '#e3f2fd' },
      // Tailor statuses
      'Pending': { color: '#f57c00', bg: '#fff3e0' },
      'Verified': { color: '#2e7d32', bg: '#e8f5e9' },
      'Rejected': { color: '#c62828', bg: '#ffebee' },
      // Course statuses
      'Draft': { color: '#757575', bg: '#f5f5f5' },
      'Published': { color: '#2e7d32', bg: '#e8f5e9' },
      'Pending Approval': { color: '#f57c00', bg: '#fff3e0' },
      // Payment statuses
      'Paid': { color: '#2e7d32', bg: '#e8f5e9' },
      'Failed': { color: '#c62828', bg: '#ffebee' },
      'Refunded': { color: '#1565c0', bg: '#e3f2fd' },
      // Generic
      'Active': { color: '#2e7d32', bg: '#e8f5e9' },
      'Inactive': { color: '#757575', bg: '#f5f5f5' },
    }
    return configs[status] || { color: '#757575', bg: '#f5f5f5' }
  }

  const config = getStatusConfig()

  const sizeClasses = {
    small: 'badge-sm',
    medium: 'badge-md',
    large: 'badge-lg'
  }

  return (
    <span className={`status-badge ${sizeClasses[size]}`} style={{ color: config.color, background: config.bg }}>
      {status}
      <style>{`
        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 12px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 12px;
          letter-spacing: 0.3px;
        }
        .badge-sm {
          font-size: 10px;
          padding: 1px 8px;
        }
        .badge-md {
          font-size: 12px;
          padding: 2px 12px;
        }
        .badge-lg {
          font-size: 14px;
          padding: 4px 16px;
        }
      `}</style>
    </span>
  )
}

export default StatusBadge
