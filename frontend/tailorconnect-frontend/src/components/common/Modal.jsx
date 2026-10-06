import React, { useEffect } from 'react'

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  actions = null
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleEscape)
    if (isOpen) document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    small: 'modal-sm',
    medium: 'modal-md',
    large: 'modal-lg'
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal ${sizeClasses[size]}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
        {actions && <div className="modal-actions">{actions}</div>}
      </div>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }
        .modal {
          background: var(--white);
          border-radius: var(--radius);
          max-height: 90vh;
          overflow-y: auto;
          animation: modalSlideIn 0.3s ease;
        }
        .modal-sm { width: 400px; }
        .modal-md { width: 600px; }
        .modal-lg { width: 800px; }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px 16px 24px;
          border-bottom: 1px solid var(--border);
        }
        .modal-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }
        .modal-close {
          background: none;
          border: none;
          font-size: 28px;
          color: var(--text-light);
          cursor: pointer;
          padding: 0 4px;
          transition: var(--transition);
        }
        .modal-close:hover {
          color: var(--text);
        }
        .modal-body {
          padding: 24px;
        }
        .modal-actions {
          padding: 16px 24px 24px 24px;
          border-top: 1px solid var(--border);
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        @keyframes modalSlideIn {
          from {
            transform: translateY(-20px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        @media (max-width: 768px) {
          .modal-sm, .modal-md, .modal-lg {
            width: 100%;
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default Modal
