import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/Button'

export default function StudentCertificates() {
  const { user } = useAuth()
  const [selectedCert, setSelectedCert] = useState(null)
  const [shareMsg, setShareMsg] = useState('')
  const [linkCopied, setLinkCopied] = useState(false)
  const certRef = useRef(null)

  const certificates = [
    {
      id: 'TC-CERT-2026-881',
      courseName: 'Aari Embroidery & Maggam Work Masterclass',
      studentName: user?.name || 'Meena Sundaram',
      instructorName: 'Lakshmi Devi',
      shopName: 'Lakshmi Stitches & Bridal Studio',
      issuedOn: '2026-08-28',
      duration: '20 Days (45 Practical Hours)',
      grade: 'Grade A+ (96% Assessment Score)',
      verificationUrl: 'https://tailorconnect.com/verify/TC-CERT-2026-881'
    },
    {
      id: 'TC-CERT-2026-412',
      courseName: 'Fabric Drafting & Precision Pattern Cutting',
      studentName: user?.name || 'Meena Sundaram',
      instructorName: 'Mrs. Radha Raman',
      shopName: 'Vintage Needle Heritage Tailors',
      issuedOn: '2026-07-15',
      duration: '15 Days (30 Practical Hours)',
      grade: 'Grade A (92% Assessment Score)',
      verificationUrl: 'https://tailorconnect.com/verify/TC-CERT-2026-412'
    }
  ]

  // ── PDF Download using browser print ─────────────────────────────────────
  const handleDownloadPDF = (cert) => {
    const printWindow = window.open('', '_blank', 'width=900,height=700')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate - ${cert.id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');
          body { font-family: 'Outfit', sans-serif; margin: 0; padding: 40px; background: #fff; color: #1F2937; }
          .cert-border { border: 8px double #0F5C5E; border-radius: 16px; padding: 48px; max-width: 760px; margin: 0 auto; position: relative; }
          .cert-inner { border: 2px solid #C9A66B; border-radius: 10px; padding: 40px; }
          .cert-header { text-align: center; margin-bottom: 32px; }
          .cert-academy { font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; color: #0F5C5E; font-weight: 700; margin-bottom: 8px; }
          .cert-title { font-size: 32px; font-weight: 800; color: #0F5C5E; margin: 8px 0; }
          .cert-subtitle { font-size: 14px; color: #6B7280; margin-bottom: 24px; }
          .divider { height: 2px; background: linear-gradient(90deg, transparent, #C9A66B, transparent); margin: 24px 0; }
          .cert-recipient { font-size: 28px; font-weight: 700; color: #0F5C5E; text-align: center; border-bottom: 2px solid #0F5C5E; display: inline-block; padding-bottom: 8px; min-width: 300px; }
          .cert-center { text-align: center; }
          .cert-course { font-size: 20px; font-weight: 700; color: #1F2937; margin: 16px 0; }
          .cert-details { font-size: 13px; color: #6B7280; margin-bottom: 32px; }
          .cert-footer { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-top: 32px; padding-top: 24px; border-top: 1px solid #E5E7EB; }
          .sig-block { text-align: center; }
          .sig-name { font-family: cursive; font-size: 20px; color: #0F5C5E; margin-bottom: 4px; }
          .sig-label { font-size: 11px; font-weight: 700; color: #374151; }
          .sig-sub { font-size: 10px; color: #9CA3AF; }
          .qr-box { width: 72px; height: 72px; border: 1px solid #E5E7EB; border-radius: 6px; margin: 0 auto 4px; display: flex; align-items: center; justify-content: center; font-size: 9px; color: #9CA3AF; }
          .watermark { position: absolute; opacity: 0.04; font-size: 120px; font-weight: 900; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); color: #0F5C5E; pointer-events: none; }
        </style>
      </head>
      <body>
        <div class="cert-border">
          <div class="watermark">TC</div>
          <div class="cert-inner">
            <div class="cert-header">
              <div class="cert-academy">TailorConnect Academy of Bespoke Stitching & Needlework</div>
              <div class="cert-title">Certificate of Masterclass Completion</div>
              <div class="cert-subtitle">This is to officially certify that</div>
            </div>
            <div class="divider"></div>
            <div class="cert-center" style="margin:24px 0">
              <div class="cert-recipient">${cert.studentName}</div>
            </div>
            <div class="cert-center cert-subtitle" style="margin:12px 0">
              has successfully completed all required modules, pattern drafting lessons, practical stitch submissions, and final examination for the accredited course
            </div>
            <div class="cert-center cert-course">"${cert.courseName}"</div>
            <div class="cert-center cert-details">
              Duration: <strong>${cert.duration}</strong> &nbsp;•&nbsp; Performance: <strong>${cert.grade}</strong> &nbsp;•&nbsp; Issued: <strong>${cert.issuedOn}</strong>
            </div>
            <div class="divider"></div>
            <div class="cert-footer">
              <div class="sig-block">
                <div class="sig-name">${cert.instructorName}</div>
                <div class="sig-label">Master Instructor</div>
                <div class="sig-sub">${cert.shopName}</div>
              </div>
              <div class="sig-block">
                <div class="qr-box">[QR]<br/>SEAL</div>
                <div class="sig-sub">ID: ${cert.id}</div>
              </div>
              <div class="sig-block">
                <div class="sig-name">Admin Academic Board</div>
                <div class="sig-label">TailorConnect Verification</div>
                <div class="sig-sub">Date: ${cert.issuedOn}</div>
              </div>
            </div>
          </div>
        </div>
        <script>window.onload = function() { window.print(); window.close(); }</script>
      </body>
      </html>
    `)
    printWindow.document.close()
  }

  // ── Copy verification link ────────────────────────────────────────────────
  const handleCopyLink = (cert) => {
    navigator.clipboard.writeText(cert.verificationUrl).then(() => {
      setLinkCopied(cert.id)
      setTimeout(() => setLinkCopied(false), 2500)
    }).catch(() => {
      // fallback
      const el = document.createElement('textarea')
      el.value = cert.verificationUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setLinkCopied(cert.id)
      setTimeout(() => setLinkCopied(false), 2500)
    })
  }

  // ── WhatsApp Share ────────────────────────────────────────────────────────
  const handleWhatsApp = (cert) => {
    const msg = encodeURIComponent(
      `I just earned a certificate from TailorConnect Academy!\n\nCourse: ${cert.courseName}\nRecipient: ${cert.studentName}\nGrade: ${cert.grade}\n\nVerify here: ${cert.verificationUrl}`
    )
    window.open(`https://wa.me/?text=${msg}`, '_blank')
  }

  // ── SMS Share ─────────────────────────────────────────────────────────────
  const handleSMS = (cert) => {
    const msg = encodeURIComponent(
      `TailorConnect Certificate | ${cert.courseName} | ${cert.studentName} | ${cert.grade} | Verify: ${cert.verificationUrl}`
    )
    window.open(`sms:?body=${msg}`, '_self')
  }

  // ── Email Share ───────────────────────────────────────────────────────────
  const handleEmail = (cert) => {
    const subject = encodeURIComponent(`TailorConnect Certificate — ${cert.courseName}`)
    const body = encodeURIComponent(
      `Dear Recipient,\n\nI am pleased to share my TailorConnect Academy certificate:\n\nCourse: ${cert.courseName}\nRecipient: ${cert.studentName}\nInstructor: ${cert.instructorName} (${cert.shopName})\nGrade: ${cert.grade}\nDuration: ${cert.duration}\nIssued On: ${cert.issuedOn}\n\nVerification Link: ${cert.verificationUrl}\n\nCertificate ID: ${cert.id}\n\nWith regards,\n${cert.studentName}`
    )
    window.open(`mailto:?subject=${subject}&body=${body}`, '_self')
  }

  return (
    <DashboardLayout role="student">
      <div className="page-header">
        <div>
          <h1>Verified Tailoring Certificates & Credentials</h1>
          <p>Official course completion credentials accredited by certified master artisans and the TailorConnect Academy board.</p>
        </div>
        <Link to="/student/courses">
          <Button variant="outline">Browse More Courses</Button>
        </Link>
      </div>

      {linkCopied && (
        <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '10px 18px', borderRadius: 8, marginBottom: 16, fontSize: 13, fontWeight: 600 }}>
          ✅ Verification link copied to clipboard!
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24, marginBottom: 30 }}>
        {certificates.map((cert) => (
          <div key={cert.id} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span className="sidebar-role-badge" style={{ fontSize: 11 }}>Accredited Certificate</span>
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{cert.id}</span>
              </div>

              <h3 style={{ fontSize: 17, color: 'var(--text-main)', marginBottom: 8 }}>{cert.courseName}</h3>

              <div style={{ background: 'var(--bg-subtle)', padding: 12, borderRadius: 6, border: '1px solid var(--border-light)', fontSize: 12.5, marginBottom: 16 }}>
                <div style={{ marginBottom: 4 }}>Recipient: <strong>{cert.studentName}</strong></div>
                <div style={{ marginBottom: 4 }}>Master Instructor: <strong>{cert.instructorName}</strong> ({cert.shopName})</div>
                <div style={{ marginBottom: 4 }}>Performance: <strong style={{ color: 'var(--success)' }}>{cert.grade}</strong></div>
                <div>Issued On: <strong>{cert.issuedOn}</strong></div>
              </div>

              {/* Verification link */}
              <div style={{ background: '#F0FDF9', border: '1px solid #BBF7D0', borderRadius: 8, padding: '8px 12px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: '#065F46', fontWeight: 600 }}>🔗 Verify:</span>
                <a href={cert.verificationUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#0284C7', wordBreak: 'break-all', flex: 1 }}>{cert.verificationUrl}</a>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="primary" size="sm" style={{ flex: 1 }} onClick={() => setSelectedCert(cert)}>
                  🏆 View
                </Button>
                <Button variant="outline" size="sm" style={{ flex: 1 }} onClick={() => handleDownloadPDF(cert)}>
                  📥 PDF
                </Button>
                <button onClick={() => handleCopyLink(cert)} style={{ flex: 1, padding: '7px 10px', borderRadius: 7, border: '1.5px solid #E5E7EB', background: linkCopied === cert.id ? '#ECFDF5' : '#fff', color: linkCopied === cert.id ? '#065F46' : '#374151', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                  {linkCopied === cert.id ? '✅ Copied!' : '🔗 Copy Link'}
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => handleWhatsApp(cert)} style={{ flex: 1, padding: '7px 10px', borderRadius: 7, border: 'none', background: '#25D366', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  <span>📱</span> WhatsApp
                </button>
                <button onClick={() => handleSMS(cert)} style={{ flex: 1, padding: '7px 10px', borderRadius: 7, border: 'none', background: '#3B82F6', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  <span>💬</span> SMS
                </button>
                <button onClick={() => handleEmail(cert)} style={{ flex: 1, padding: '7px 10px', borderRadius: 7, border: 'none', background: '#EA580C', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  <span>✉️</span> Email
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CERTIFICATE MODAL */}
      {selectedCert && (
        <div className="modal-backdrop" onClick={() => setSelectedCert(null)}>
          <div
            className="modal-dialog"
            style={{ maxWidth: 780, padding: 0, background: '#FFFFFF', border: '6px double #0F5C5E', borderRadius: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '40px 48px', textAlign: 'center', position: 'relative' }}>
              <button type="button" className="modal-close-btn" style={{ position: 'absolute', top: 16, right: 16 }} onClick={() => setSelectedCert(null)}>✕</button>

              {/* Gold inner border */}
              <div style={{ border: '2px solid #C9A66B', borderRadius: 10, padding: '32px', position: 'relative' }}>
                {/* Watermark */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(-30deg)', fontSize: 100, fontWeight: 900, color: '#0F5C5E', opacity: 0.04, pointerEvents: 'none' }}>TC</div>

                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--primary)', fontWeight: 700, marginBottom: 6 }}>
                  TailorConnect Academy of Bespoke Stitching & Needlework
                </div>

                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, color: 'var(--text-main)', margin: '0 0 14px 0' }}>
                  Certificate of Masterclass Completion
                </h1>

                <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #C9A66B, transparent)', margin: '16px 0' }} />

                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>This is to officially verify that</p>

                <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--primary-dark)', borderBottom: '2px solid var(--border)', display: 'inline-block', paddingBottom: 6, marginBottom: 16, minWidth: 280 }}>
                  {selectedCert.studentName}
                </div>

                <p style={{ fontSize: 13.5, color: 'var(--text-main)', maxWidth: 560, margin: '0 auto 20px auto', lineHeight: 1.6 }}>
                  has successfully completed all required modules, pattern drafting lessons, practical stitch submissions, and final examination for the accredited course
                </p>

                <div style={{ fontSize: 19, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>
                  "{selectedCert.courseName}"
                </div>

                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
                  Duration: <strong>{selectedCert.duration}</strong> &nbsp;•&nbsp; Performance: <strong>{selectedCert.grade}</strong>
                </div>

                <div style={{ height: 1, background: '#E5E7EB', margin: '16px 0' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, alignItems: 'flex-end', paddingTop: 16 }}>
                  <div>
                    <div style={{ fontFamily: 'cursive', fontSize: 18, color: 'var(--primary-dark)', marginBottom: 4 }}>{selectedCert.instructorName}</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>Master Instructor</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{selectedCert.shopName}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 64, height: 64, border: '1px solid var(--border)', borderRadius: 6, margin: '0 auto 6px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--text-muted)' }}>
                      [QR SEAL]
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>ID: {selectedCert.id}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'cursive', fontSize: 18, color: 'var(--text-main)', marginBottom: 4 }}>Admin Academic Board</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>TailorConnect Verification</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Date: {selectedCert.issuedOn}</div>
                  </div>
                </div>
              </div>

              {/* Action buttons in modal */}
              <div style={{ marginTop: 24, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button variant="primary" onClick={() => handleDownloadPDF(selectedCert)}>📥 Download PDF</Button>
                <button onClick={() => handleCopyLink(selectedCert)} style={{ padding: '9px 16px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  🔗 Copy Link
                </button>
                <button onClick={() => handleWhatsApp(selectedCert)} style={{ padding: '9px 16px', borderRadius: 8, border: 'none', background: '#25D366', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>📱 WhatsApp</button>
                <button onClick={() => handleSMS(selectedCert)} style={{ padding: '9px 16px', borderRadius: 8, border: 'none', background: '#3B82F6', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>💬 SMS</button>
                <button onClick={() => handleEmail(selectedCert)} style={{ padding: '9px 16px', borderRadius: 8, border: 'none', background: '#EA580C', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>✉️ Email</button>
                <Button variant="outline" onClick={() => setSelectedCert(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
