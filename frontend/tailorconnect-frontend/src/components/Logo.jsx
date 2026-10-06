import React from 'react'

/**
 * TailorConnect Logo Component
 * Brand: Deep Teal (#0F5C5E) + Champagne Gold (#C9A66B)
 *
 * Props:
 *   size      — logo mark diameter (px), default 36
 *   showText  — show brand name, default true
 *   light     — white text for dark backgrounds, default false
 *   className — extra CSS class
 */
export default function Logo({ size = 36, showText = true, light = false, className = '' }) {
  const textColor   = light ? '#FFFFFF' : '#0F5C5E'
  const accentColor = '#C9A66B'

  return (
    <div
      className={`logo-container ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}
    >
      {/* SVG Logo Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
        aria-label="TailorConnect logo"
      >
        <circle cx="24" cy="24" r="24" fill="#0F5C5E" />
        {/* Needle */}
        <line x1="24" y1="10" x2="24" y2="33" stroke="white" strokeWidth="2" strokeLinecap="round" />
        {/* Eye of needle */}
        <ellipse cx="24" cy="9" rx="3" ry="1.8" stroke={accentColor} strokeWidth="1.5" fill="none" />
        <ellipse cx="24" cy="12" rx="1.2" ry="1" stroke="white" strokeWidth="1.2" fill="none" />
        {/* Thread wave */}
        <path d="M17 27 Q20.5 22 24 27 Q27.5 32 31 27" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        {/* Thread tail */}
        <path d="M24 33 C22 37 19 39 20.5 42" stroke={accentColor} strokeWidth="1.4" strokeDasharray="2 1.8" strokeLinecap="round" fill="none" />
        {/* Accent dot */}
        <circle cx="33" cy="15" r="2.2" fill={accentColor} opacity="0.9" />
      </svg>

      {showText && (
        <span style={{
          fontFamily: "var(--font-heading, 'Outfit', system-ui, sans-serif)",
          fontWeight: 700,
          fontSize: Math.max(15, size * 0.5),
          color: textColor,
          letterSpacing: '-0.3px',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}>
          Tailor
          <span style={{ color: accentColor }}>Connect</span>
        </span>
      )}
    </div>
  )
}
