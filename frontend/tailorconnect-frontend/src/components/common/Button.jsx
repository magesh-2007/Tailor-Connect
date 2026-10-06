import React from 'react'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = ''
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    danger: 'btn-danger',
    success: 'btn-success',
    warning: 'btn-warning'
  }

  const sizes = {
    small: 'btn-sm',
    medium: 'btn-md',
    large: 'btn-lg'
  }

  return (
    <button
      type={type}
      className={`btn ${variants[variant]} ${sizes[size]} ${fullWidth ? 'btn-full' : ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <span className="btn-loader">⏳</span>
      ) : children}
      <style>{`
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          border-radius: var(--radius-sm);
          font-weight: 600;
          transition: var(--transition);
          cursor: pointer;
          font-size: 14px;
          padding: 10px 20px;
        }
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .btn-primary {
          background: var(--primary);
          color: white;
        }
        .btn-primary:hover:not(:disabled) {
          background: var(--primary-dark);
          transform: translateY(-1px);
          box-shadow: var(--shadow-hover);
        }
        .btn-secondary {
          background: var(--primary-light);
          color: var(--primary);
        }
        .btn-secondary:hover:not(:disabled) {
          background: #f8d7e0;
        }
        .btn-outline {
          background: transparent;
          color: var(--primary);
          border: 2px solid var(--primary);
        }
        .btn-outline:hover:not(:disabled) {
          background: var(--primary);
          color: white;
        }
        .btn-danger {
          background: #d32f2f;
          color: white;
        }
        .btn-danger:hover:not(:disabled) {
          background: #b71c1c;
        }
        .btn-success {
          background: #2e7d32;
          color: white;
        }
        .btn-success:hover:not(:disabled) {
          background: #1b5e20;
        }
        .btn-warning {
          background: #f57c00;
          color: white;
        }
        .btn-warning:hover:not(:disabled) {
          background: #e65100;
        }
        .btn-sm {
          padding: 6px 14px;
          font-size: 12px;
        }
        .btn-md {
          padding: 10px 20px;
          font-size: 14px;
        }
        .btn-lg {
          padding: 14px 28px;
          font-size: 16px;
        }
        .btn-full {
          width: 100%;
        }
        .btn-loader {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  )
}

export default Button
