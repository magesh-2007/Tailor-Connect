import React from 'react'

/**
 * StatusBadge — Semantic status indicator using the new TailorConnect design system.
 * Colors follow the global palette: Navy · Gold · Green · Red · Slate
 *
 * No pink. All colors are semantically appropriate.
 */

const STATUS_MAP = {
  // ── Order Production Lifecycle ──
  'Request Received':  { color: '#536A8A', bg: '#EFF6FF', border: '#BFDBFE' },
  'Request':           { color: '#536A8A', bg: '#EFF6FF', border: '#BFDBFE' },
  'Quotation Received':{ color: '#A67C32', bg: '#FFFBEB', border: '#FDE68A' },
  'Quotation':         { color: '#A67C32', bg: '#FFFBEB', border: '#FDE68A' },
  'Tailor Confirmed':  { color: '#3F6B4F', bg: '#ECFDF5', border: '#A7F3D0' },
  'Measurement':       { color: '#536A8A', bg: '#EFF6FF', border: '#BFDBFE' },
  'Fabric':            { color: '#1F2937', bg: '#E8EDF3', border: '#C7D0DE' },
  'Cutting':           { color: '#1F2937', bg: '#E8EDF3', border: '#C7D0DE' },
  'Stitching':         { color: '#C9A66B', bg: '#F5EDD9', border: '#EDE0C4' },
  'Aari / Embroidery': { color: '#C9A66B', bg: '#F5EDD9', border: '#EDE0C4' },
  'Finishing':         { color: '#536A8A', bg: '#EFF6FF', border: '#BFDBFE' },
  'Quality Check':     { color: '#536A8A', bg: '#EFF6FF', border: '#BFDBFE' },
  'Ready':             { color: '#3F6B4F', bg: '#ECFDF5', border: '#A7F3D0' },
  'Delivery':          { color: '#3F6B4F', bg: '#ECFDF5', border: '#A7F3D0' },
  'Delivered':         { color: '#065F46', bg: '#ECFDF5', border: '#A7F3D0' },
  'Completed':         { color: '#065F46', bg: '#ECFDF5', border: '#A7F3D0' },
  'In Progress':       { color: '#536A8A', bg: '#EFF6FF', border: '#BFDBFE' },
  'Cancelled':         { color: '#991B1B', bg: '#FEF2F2', border: '#FECACA' },
  'Delayed':           { color: '#991B1B', bg: '#FEF2F2', border: '#FECACA' },
  'Delivery Risk':     { color: '#B45353', bg: '#FEF2F2', border: '#FECACA' },

  // ── Quotation Statuses ──
  'pending':   { color: '#A67C32', bg: '#FFFBEB', border: '#FDE68A' },
  'sent':      { color: '#536A8A', bg: '#EFF6FF', border: '#BFDBFE' },
  'accepted':  { color: '#3F6B4F', bg: '#ECFDF5', border: '#A7F3D0' },
  'rejected':  { color: '#991B1B', bg: '#FEF2F2', border: '#FECACA' },

  // ── Capacity ──
  'Available':        { color: '#3F6B4F', bg: '#ECFDF5', border: '#A7F3D0' },
  'Available Today':  { color: '#3F6B4F', bg: '#ECFDF5', border: '#A7F3D0' },
  'Limited Capacity': { color: '#A67C32', bg: '#FFFBEB', border: '#FDE68A' },
  'Capacity Full':    { color: '#991B1B', bg: '#FEF2F2', border: '#FECACA' },

  // ── Verification & Moderation ──
  'Verified':            { color: '#3F6B4F', bg: '#ECFDF5', border: '#A7F3D0' },
  'Pending Verification':{ color: '#A67C32', bg: '#FFFBEB', border: '#FDE68A' },
  'Approved':            { color: '#3F6B4F', bg: '#ECFDF5', border: '#A7F3D0' },
  'Under Review':        { color: '#536A8A', bg: '#EFF6FF', border: '#BFDBFE' },
  'Open':                { color: '#A67C32', bg: '#FFFBEB', border: '#FDE68A' },
  'Resolved':            { color: '#3F6B4F', bg: '#ECFDF5', border: '#A7F3D0' },
  'Closed':              { color: '#6B7280', bg: '#F3F4F6', border: '#D1D5DB' },

  // ── Payment Statuses ──
  'Paid':     { color: '#065F46', bg: '#ECFDF5', border: '#A7F3D0' },
  'Pending':  { color: '#A67C32', bg: '#FFFBEB', border: '#FDE68A' },
  'Failed':   { color: '#991B1B', bg: '#FEF2F2', border: '#FECACA' },
  'Refunded': { color: '#536A8A', bg: '#EFF6FF', border: '#BFDBFE' },

  // ── General & Priorities ──
  'Urgent':    { color: '#991B1B', bg: '#FEF2F2', border: '#FECACA' },
  'Normal':    { color: '#6B7280', bg: '#F3F4F6', border: '#D1D5DB' },
  'Active':    { color: '#3F6B4F', bg: '#ECFDF5', border: '#A7F3D0' },
  'Published': { color: '#3F6B4F', bg: '#ECFDF5', border: '#A7F3D0' },
  'Draft':     { color: '#6B7280', bg: '#F3F4F6', border: '#D1D5DB' },
  'Inactive':  { color: '#6B7280', bg: '#F3F4F6', border: '#D1D5DB' },
  'Scheduled': { color: '#C9A66B', bg: '#F5EDD9', border: '#EDE0C4' },

  // ── Course / Student Statuses ──
  'Enrolled':   { color: '#536A8A', bg: '#EFF6FF', border: '#BFDBFE' },
  'Ongoing':    { color: '#C9A66B', bg: '#F5EDD9', border: '#EDE0C4' },
  'Passed':       { color: '#065F46', bg: '#ECFDF5', border: '#A7F3D0' },
  'Course Failed':{ color: '#991B1B', bg: '#FEF2F2', border: '#FECACA' },
  'Submitted':  { color: '#536A8A', bg: '#EFF6FF', border: '#BFDBFE' },
  'Graded':     { color: '#3F6B4F', bg: '#ECFDF5', border: '#A7F3D0' },
}

export default function StatusBadge({ status = 'Active', className = '' }) {
  const config = STATUS_MAP[status] || {
    color: '#6B7280',
    bg: '#F3F4F6',
    border: '#D1D5DB',
  }

  return (
    <span
      className={`status-badge ${className}`}
      style={{
        color: config.color,
        backgroundColor: config.bg,
        borderColor: config.border,
        borderWidth: 1,
        borderStyle: 'solid',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          backgroundColor: config.color,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      {status}
    </span>
  )
}
