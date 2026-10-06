import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const T = {
  navy:       '#1F2937',
  navyHover:  '#111827',
  gold:       '#C9A66B',
  goldLight:  '#F5EDD9',
  cream:      '#F8F5EF',
  white:      '#FFFFFF',
  border:     '#E5E1D8',
  textMain:   '#1F2937',
  textSub:    '#6B7280',
  textMuted:  '#9CA3AF',
  danger:     '#DC2626',
  dangerBg:   '#FEF2F2',
  dangerBdr:  '#FECACA',
  success:    '#15803D',
  successBg:  '#F0FDF4',
  successBdr: '#BBF7D0',
  radiusSm:   '7px',
  radius:     '10px',
  font:       "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
}

export default function ForgotPassword() {
  const [step,            setStep]            = useState(1)
  const [identifier,      setIdentifier]      = useState('')
  const [otp,             setOtp]             = useState(['','','','','',''])
  const [timer,           setTimer]           = useState(60)
  const [newPassword,     setNewPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error,           setError]           = useState('')
  const [loading,         setLoading]         = useState(false)
  const [focusedField,    setFocused]         = useState(null)

  useEffect(() => {
    let interval = null
    if (step === 2 && timer > 0)
      interval = setInterval(() => setTimer(t => t - 1), 1000)
    return () => clearInterval(interval)
  }, [step, timer])

  const handleRequestOtp = (e) => {
    e.preventDefault()
    if (!identifier.trim()) { setError('Please enter your registered email or phone number.'); return }
    setError(''); setLoading(true)
    setTimeout(() => { setLoading(false); setStep(2); setTimer(60) }, 800)
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1)
    const next = [...otp]; next[index] = value; setOtp(next)
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus()
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0)
      document.getElementById(`otp-${index - 1}`)?.focus()
  }

  const handleVerifyOtp = (e) => {
    e.preventDefault()
    if (otp.join('').length !== 6) { setError('Please enter the complete 6-digit code.'); return }
    setError(''); setLoading(true)
    setTimeout(() => { setLoading(false); setStep(3) }, 800)
  }

  const handleResetPassword = (e) => {
    e.preventDefault()
    if (!newPassword || newPassword.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (newPassword !== confirmPassword)          { setError('Passwords do not match.'); return }
    setError(''); setLoading(true)
    setTimeout(() => { setLoading(false); setStep(4) }, 1000)
  }

  const inputStyle = (f) => ({
    width: '100%', height: 46, padding: '0 14px',
    fontSize: 14, fontFamily: T.font, color: T.textMain, background: T.white,
    border: `1.5px solid ${focusedField === f ? T.gold : T.border}`,
    borderRadius: T.radiusSm, outline: 'none',
    boxShadow: focusedField === f ? `0 0 0 3px ${T.goldLight}` : 'none',
    transition: 'border-color 0.18s, box-shadow 0.18s', boxSizing: 'border-box',
  })

  const labelStyle = {
    display: 'block', fontSize: 13, fontWeight: 600,
    color: T.textMain, fontFamily: T.font, marginBottom: 6,
  }

  const STEPS = [
    { n: 1, label: 'Identify' },
    { n: 2, label: 'Verify' },
    { n: 3, label: 'Reset' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
        .tc-fp-btn {
          height: 46px; width: 100%; border: none;
          border-radius: ${T.radiusSm};
          background: ${T.navy}; color: #fff;
          font-size: 14px; font-weight: 600; font-family: ${T.font};
          cursor: pointer;
          transition: background 0.18s, box-shadow 0.18s, transform 0.12s;
        }
        .tc-fp-btn:hover:not(:disabled) {
          background: ${T.navyHover};
          box-shadow: 0 4px 14px rgba(31,41,55,0.22);
          transform: translateY(-1px);
        }
        .tc-fp-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .tc-fp-btn-outline {
          height: 46px; flex: 1; border: 1.5px solid ${T.border};
          border-radius: ${T.radiusSm};
          background: ${T.white}; color: ${T.textMain};
          font-size: 14px; font-weight: 500; font-family: ${T.font};
          cursor: pointer;
          transition: border-color 0.18s, background 0.18s;
        }
        .tc-fp-btn-outline:hover { border-color: #9CA3AF; background: #fafafa; }
        @keyframes tc-fp-fade { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }
        .tc-fp-animate { animation: tc-fp-fade 0.35s ease both; }
      `}</style>

      <div style={{
        minHeight: '100vh', background: T.cream,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 20px', fontFamily: T.font, boxSizing: 'border-box',
      }}>
        <div className="tc-fp-animate" style={{
          width: '100%', maxWidth: 460,
          background: T.white,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          boxShadow: '0 4px 24px rgba(31,41,55,0.08)',
          overflow: 'hidden',
        }}>
          {/* Header bar */}
          <div style={{ background: T.navy, padding: '24px 32px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <img src="/logo.jpg" alt="TailorConnect" style={{
                width: 34, height: 34, borderRadius: '50%', objectFit: 'cover',
                border: `2px solid ${T.gold}`,
              }}/>
              <span style={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.white }}>
                Tailor<span style={{ color: T.gold }}>Connect</span>
              </span>
            </div>
            <h1 style={{ fontFamily: T.font, fontWeight: 700, fontSize: 20, color: T.white, margin: '0 0 4px', letterSpacing: '-0.3px' }}>
              Password Recovery
            </h1>
            <p style={{ fontFamily: T.font, fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: 0 }}>
              Reset your TailorConnect account credentials securely.
            </p>
          </div>

          <div style={{ padding: '28px 32px 32px' }}>
            {/* Step progress */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 28 }}>
              {STEPS.map((s, idx) => (
                <React.Fragment key={s.n}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, fontFamily: T.font,
                      background: step > s.n ? T.gold : step === s.n ? T.navy : T.cream,
                      color: step >= s.n ? T.white : T.textMuted,
                      border: step === s.n ? `2px solid ${T.navy}` : `1.5px solid ${step > s.n ? T.gold : T.border}`,
                      transition: 'all 0.3s',
                    }}>
                      {step > s.n ? '✓' : s.n}
                    </div>
                    <span style={{ fontSize: 10, fontFamily: T.font, color: step >= s.n ? T.textMain : T.textMuted, fontWeight: step === s.n ? 600 : 400, letterSpacing: '0.04em' }}>
                      {s.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div style={{ width: 48, height: 1.5, background: step > s.n ? T.gold : T.border, transition: 'background 0.3s', marginBottom: 18 }}/>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div role="alert" style={{
                background: T.dangerBg, border: `1px solid ${T.dangerBdr}`,
                borderLeft: `3px solid ${T.danger}`,
                borderRadius: T.radiusSm, padding: '10px 14px',
                marginBottom: 20, fontSize: 13.5, color: T.danger, fontFamily: T.font,
              }}>⚠️ {error}</div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <form onSubmit={handleRequestOtp}>
                <div style={{ marginBottom: 20 }}>
                  <label htmlFor="forgot-id" style={labelStyle}>
                    Registered Email or Phone <span style={{ color: T.danger }}>*</span>
                  </label>
                  <input
                    id="forgot-id"
                    type="text"
                    placeholder="Enter your email or phone number"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    onFocus={() => setFocused('id')}
                    onBlur={() => setFocused(null)}
                    required
                    style={inputStyle('id')}
                  />
                  <span style={{ fontSize: 12, color: T.textMuted, marginTop: 5, display: 'block', fontFamily: T.font }}>
                    A 6-digit verification code will be sent to your registered contact.
                  </span>
                </div>
                <button type="submit" className="tc-fp-btn" disabled={loading}>
                  {loading ? 'Sending…' : 'Send Verification Code →'}
                </button>
              </form>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp}>
                <div style={{ textAlign: 'center', marginBottom: 22 }}>
                  <p style={{ fontSize: 13.5, color: T.textSub, margin: '0 0 4px', fontFamily: T.font }}>Enter the 6-digit code sent to:</p>
                  <strong style={{ fontSize: 14, color: T.navy, fontFamily: T.font }}>{identifier}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(idx, e)}
                      autoFocus={idx === 0}
                      style={{
                        width: 44, height: 52,
                        textAlign: 'center', fontSize: 20, fontWeight: 700,
                        fontFamily: T.font, color: T.textMain,
                        borderRadius: T.radiusSm,
                        border: `1.5px solid ${digit ? T.gold : T.border}`,
                        background: digit ? T.goldLight : T.white,
                        outline: 'none', transition: 'border-color 0.18s, background 0.18s',
                      }}
                    />
                  ))}
                </div>
                <div style={{ textAlign: 'center', marginBottom: 20, fontSize: 13, color: T.textSub, fontFamily: T.font }}>
                  {timer > 0
                    ? <span>Resend code in <strong style={{ color: T.navy }}>0:{timer < 10 ? `0${timer}` : timer}</strong></span>
                    : <button type="button" onClick={() => { setTimer(60); setOtp(['','','','','','']); setError('') }}
                        style={{ background: 'none', border: 'none', color: T.gold, fontWeight: 700, cursor: 'pointer', fontFamily: T.font, fontSize: 13, padding: 0 }}>
                        Resend Code
                      </button>}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" className="tc-fp-btn-outline" onClick={() => setStep(1)}>
                    ← Change
                  </button>
                  <button type="submit" className="tc-fp-btn" disabled={loading} style={{ flex: 1 }}>
                    {loading ? 'Verifying…' : 'Verify Code →'}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <form onSubmit={handleResetPassword}>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>New Password <span style={{ color: T.danger }}>*</span></label>
                  <input type="password" placeholder="At least 6 characters" required
                    value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    onFocus={() => setFocused('np')} onBlur={() => setFocused(null)}
                    style={inputStyle('np')}/>
                </div>
                <div style={{ marginBottom: 22 }}>
                  <label style={labelStyle}>Confirm Password <span style={{ color: T.danger }}>*</span></label>
                  <input type="password" placeholder="Repeat new password" required
                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocused('cp')} onBlur={() => setFocused(null)}
                    style={inputStyle('cp')}/>
                </div>
                <button type="submit" className="tc-fp-btn" disabled={loading}>
                  {loading ? 'Updating…' : 'Save New Password'}
                </button>
              </form>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: T.successBg, color: T.success,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, margin: '0 auto 18px',
                  border: `2px solid ${T.successBdr}`,
                }}>✓</div>
                <h3 style={{ fontFamily: T.font, fontSize: 18, color: T.textMain, margin: '0 0 8px', fontWeight: 700 }}>
                  Password Reset!
                </h3>
                <p style={{ fontFamily: T.font, fontSize: 13.5, color: T.textSub, margin: '0 0 24px', lineHeight: 1.6 }}>
                  Your password has been updated. You can now sign in with your new credentials.
                </p>
                <Link to="/login" style={{
                  display: 'block', height: 46, lineHeight: '46px',
                  borderRadius: T.radiusSm, background: T.navy, color: T.white,
                  fontFamily: T.font, fontSize: 14, fontWeight: 600, textDecoration: 'none',
                  transition: 'background 0.18s',
                }}>
                  Return to Sign In →
                </Link>
              </div>
            )}

            {/* Footer */}
            <div style={{ marginTop: 26, paddingTop: 18, borderTop: `1px solid ${T.border}`, textAlign: 'center', fontSize: 13, fontFamily: T.font }}>
              <Link to="/login" style={{ color: T.gold, fontWeight: 600, textDecoration: 'none' }}>
                ← Return to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
