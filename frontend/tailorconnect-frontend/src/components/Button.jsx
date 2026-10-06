import React from 'react'

/**
 * Button — TailorConnect Design System v2
 *
 * Variants: primary | secondary | accent | outline | ghost | danger
 * Sizes:    xs | sm | (default) | lg | xl
 */
export default function Button({
  children,
  variant = 'primary',
  size,
  block = false,
  type = 'button',
  className = '',
  loading = false,
  ...rest
}) {
  const sizeClass  = size ? `btn-${size}` : ''
  const blockClass = block ? 'btn-block' : ''
  const classes    = ['btn', `btn-${variant}`, sizeClass, blockClass, className]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} disabled={loading || rest.disabled} {...rest}>
      {loading && (
        <svg
          aria-hidden="true"
          style={{ width: 14, height: 14, animation: 'spin 0.7s linear infinite', flexShrink: 0 }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
      )}
      {children}
    </button>
  )
}
