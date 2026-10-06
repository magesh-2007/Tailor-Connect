import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'

const PRESET_COLORS = [
  { name: 'Teal',    value: '#0F5C5E' }, { name: 'Emerald',  value: '#059669' },
  { name: 'Forest',  value: '#15803D' }, { name: 'Violet',   value: '#7C3AED' },
  { name: 'Purple',  value: '#9333EA' }, { name: 'Rose',     value: '#E11D48' },
  { name: 'Orange',  value: '#EA580C' }, { name: 'Amber',    value: '#D97706' },
  { name: 'Gold',    value: '#C9A66B' }, { name: 'Sky',      value: '#0284C7' },
  { name: 'Indigo',  value: '#4338CA' }, { name: 'Pink',     value: '#DB2777' },
  { name: 'Cyan',    value: '#0891B2' }, { name: 'Lime',     value: '#65A30D' },
  { name: 'Red',     value: '#DC2626' }, { name: 'Slate',    value: '#475569' },
  { name: 'Maroon',  value: '#7F1D1D' }, { name: 'Navy',     value: '#1E3A5F' },
  { name: 'Magenta', value: '#C026D3' }, { name: 'Brown',    value: '#92400E' },
]

const FONT_FAMILIES = [
  { name: 'Outfit (Default)', value: "'Outfit', sans-serif" },
  { name: 'Inter',            value: "'Inter', sans-serif" },
  { name: 'Poppins',          value: "'Poppins', sans-serif" },
  { name: 'Nunito',           value: "'Nunito', sans-serif" },
  { name: 'Lato',             value: "'Lato', sans-serif" },
  { name: 'Roboto',           value: "'Roboto', sans-serif" },
  { name: 'Playfair Display', value: "'Playfair Display', serif" },
  { name: 'Merriweather',     value: "'Merriweather', serif" },
  { name: 'Source Sans 3',    value: "'Source Sans 3', sans-serif" },
  { name: 'DM Sans',          value: "'DM Sans', sans-serif" },
]

const FONT_SIZES = [
  { name: 'Small (13px)',   value: '13px' },
  { name: 'Normal (14px)',  value: '14px' },
  { name: 'Medium (15px)',  value: '15px' },
  { name: 'Large (16px)',   value: '16px' },
  { name: 'X-Large (18px)', value: '18px' },
]

const LANGUAGES = ['English', 'Tamil', 'Hindi', 'Telugu', 'Kannada', 'Malayalam']
const DENSITIES = [
  { name: 'Compact', value: 'compact' },
  { name: 'Normal', value: 'normal' },
  { name: 'Comfortable', value: 'comfortable' },
]

function ToggleSwitch({ checked, onChange, id }) {
  return (
    <label htmlFor={id} style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer', flexShrink: 0 }}>
      <input id={id} type="checkbox" checked={checked} onChange={onChange} style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }} />
      <span style={{ position: 'absolute', inset: 0, borderRadius: 999, transition: 'background 0.25s', background: checked ? '#0F5C5E' : '#D1D5DB' }} />
      <span style={{ position: 'absolute', top: 3, left: checked ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.25s' }} />
    </label>
  )
}

function Section({ icon, title, subtitle, children }) {
  return (
    <div className="card" style={{ padding: 24, marginBottom: 20 }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0F5C5E', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{icon}</span>{title}
        </h3>
        {subtitle && <p style={{ margin: '4px 0 0', fontSize: 13, color: '#9CA3AF' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function SettingRow({ label, desc, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
      <div style={{ flex: 1, paddingRight: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1F2937' }}>{label}</div>
        {desc && <div style={{ fontSize: 12.5, color: '#9CA3AF', marginTop: 2 }}>{desc}</div>}
      </div>
      {children}
    </div>
  )
}

const STORAGE_KEY = 'tc_tailor_settings'
const defaultSettings = {
  notifEmail: true, notifSMS: true, notifInApp: true, notifNewOrders: true,
  notifPayments: true, notifReminders: true, notifMarketing: false, notifSound: true,
  themeColor: '#0F5C5E', customColor: '', darkMode: false,
  fontFamily: "'Outfit', sans-serif", fontSize: '14px',
  density: 'normal', language: 'English', compactSidebar: false, showAvatars: true, animationsOn: true,
  publicProfile: true, showOnlineStatus: true, dataAnalytics: true,
  autoAcceptRecurring: false, smsOnNewOrder: true,
  bankName: '', accountNumber: '', ifscCode: '', upiVpa: '',
}

export default function TailorSettings() {
  const [s, setS] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings
    } catch { return defaultSettings }
  })
  const [saved, setSaved] = useState(false)
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [pwErr, setPwErr] = useState('')
  const [pwOk, setPwOk] = useState(false)
  const [bankSaved, setBankSaved] = useState(false)

  useEffect(() => {
    const color = s.customColor || s.themeColor
    const root = document.documentElement
    const darken = (hex, pct) => {
      const n = parseInt(hex.slice(1), 16)
      const r = Math.max(0, Math.min(255, (n >> 16) - Math.round(2.55 * pct)))
      const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) - Math.round(2.55 * pct)))
      const b = Math.max(0, Math.min(255, (n & 0xff) - Math.round(2.55 * pct)))
      return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
    }
    const hex2rgba = (hex, a) => {
      const n = parseInt(hex.slice(1), 16)
      return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 0xff) + ',' + (n & 0xff) + ',' + a + ')'
    }
    root.style.setProperty('--primary', color)
    root.style.setProperty('--primary-hover', darken(color, 8))
    root.style.setProperty('--primary-light', darken(color, -8))
    root.style.setProperty('--primary-dark', darken(color, 12))
    root.style.setProperty('--primary-subtle', hex2rgba(color, 0.12))
    root.style.setProperty('--bg-sidebar', color)
    root.style.setProperty('--bg-sidebar-hover', darken(color, -8))
    root.style.setProperty('--bg-sidebar-active', darken(color, 12))
    root.style.setProperty('--border-focus', color)
    root.style.setProperty('--text-navy', color)
    const fontName = s.fontFamily.replace(/'/g, '').split(',')[0].trim()
    const linkId = 'tc-dynamic-font'
    let link = document.getElementById(linkId)
    if (!link) { link = document.createElement('link'); link.id = linkId; link.rel = 'stylesheet'; document.head.appendChild(link) }
    link.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(fontName) + ':wght@400;500;600;700;800&display=swap'
    root.style.setProperty('--font-body', s.fontFamily)
    document.body.style.fontFamily = s.fontFamily
    document.body.style.fontSize = s.fontSize
    if (s.darkMode) {
      root.style.setProperty('--bg-page', '#111827'); root.style.setProperty('--bg-card', '#1F2937')
      root.style.setProperty('--bg-surface', '#1F2937'); root.style.setProperty('--text-primary', '#F9FAFB')
      root.style.setProperty('--text-main', '#F9FAFB'); root.style.setProperty('--border', '#374151')
    } else {
      root.style.setProperty('--bg-page', '#FCFBF7'); root.style.setProperty('--bg-card', '#FFFFFF')
      root.style.setProperty('--bg-surface', '#FFFFFF'); root.style.setProperty('--text-primary', '#263238')
      root.style.setProperty('--text-main', '#263238'); root.style.setProperty('--border', '#E3E8E6')
    }
  }, [s.themeColor, s.customColor, s.fontFamily, s.fontSize, s.darkMode])

  const update = (key, val) => setS(prev => ({ ...prev, [key]: val }))
  const handleSave = () => { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); setSaved(true); setTimeout(() => setSaved(false), 2500) }
  const handleReset = () => {
    setS(defaultSettings); localStorage.removeItem(STORAGE_KEY)
    document.documentElement.style.setProperty('--primary', defaultSettings.themeColor)
    document.body.style.fontFamily = defaultSettings.fontFamily
    document.body.style.fontSize = defaultSettings.fontSize
  }
  const handlePasswordChange = (e) => {
    e.preventDefault(); setPwErr('')
    if (pwForm.next.length < 8) { setPwErr('Password must be at least 8 characters.'); return }
    if (pwForm.next !== pwForm.confirm) { setPwErr('Passwords do not match.'); return }
    setPwOk(true); setPwForm({ current: '', next: '', confirm: '' }); setTimeout(() => setPwOk(false), 3000)
  }
  const handleSaveBank = (e) => {
    e.preventDefault(); localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
    setBankSaved(true); setTimeout(() => setBankSaved(false), 2500)
  }
  const activeColor = s.customColor || s.themeColor

  return (
    <DashboardLayout role="tailor">
      <div className="page-header">
        <div>
          <h1>Settings &amp; Preferences</h1>
          <p>Personalise your TailorConnect studio — notifications, theme, fonts, payout &amp; more.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleReset} style={{ padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: '1.5px solid #E5E7EB', background: '#fff', cursor: 'pointer', color: '#6B7280' }}>Reset All</button>
          <button onClick={handleSave} style={{ padding: '9px 22px', borderRadius: 8, fontSize: 13.5, fontWeight: 700, border: 'none', background: activeColor, color: '#fff', cursor: 'pointer' }}>
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>

      <Section icon="🔔" title="Notifications" subtitle="Choose exactly what you want to be alerted about.">
        <SettingRow label="Email Notifications" desc="Order confirmations, payments, and customer updates via email.">
          <ToggleSwitch id="notifEmail" checked={s.notifEmail} onChange={e => update('notifEmail', e.target.checked)} />
        </SettingRow>
        <SettingRow label="SMS Alerts" desc="Text messages when a new order request, payment, or urgent update arrives.">
          <ToggleSwitch id="notifSMS" checked={s.notifSMS} onChange={e => update('notifSMS', e.target.checked)} />
        </SettingRow>
        <SettingRow label="In-App Notifications" desc="Real-time banners and badge counts inside the portal.">
          <ToggleSwitch id="notifInApp" checked={s.notifInApp} onChange={e => update('notifInApp', e.target.checked)} />
        </SettingRow>
        <SettingRow label="New Order Requests" desc="Notify whenever a customer places a new dress order or broadcasts a request.">
          <ToggleSwitch id="notifNewOrders" checked={s.notifNewOrders} onChange={e => update('notifNewOrders', e.target.checked)} />
        </SettingRow>
        <SettingRow label="Payment Alerts" desc="Get notified when a payment is received or a payout is processed.">
          <ToggleSwitch id="notifPayments" checked={s.notifPayments} onChange={e => update('notifPayments', e.target.checked)} />
        </SettingRow>
        <SettingRow label="Appointment Reminders" desc="Reminders before scheduled customer fitting sessions.">
          <ToggleSwitch id="notifReminders" checked={s.notifReminders} onChange={e => update('notifReminders', e.target.checked)} />
        </SettingRow>
        <SettingRow label="Marketing &amp; Tips" desc="Style tips, platform updates, and new feature announcements.">
          <ToggleSwitch id="notifMarketing" checked={s.notifMarketing} onChange={e => update('notifMarketing', e.target.checked)} />
        </SettingRow>
        <SettingRow label="Notification Sound" desc="Play a sound when a new in-app notification arrives.">
          <ToggleSwitch id="notifSound" checked={s.notifSound} onChange={e => update('notifSound', e.target.checked)} />
        </SettingRow>
      </Section>

      <Section icon="🎨" title="Theme &amp; Colour" subtitle="Pick any colour — it applies instantly across the entire portal.">
        <div style={{ height: 6, borderRadius: 999, background: activeColor, marginBottom: 20, transition: 'background 0.3s' }} />
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10 }}>Preset Colours</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {PRESET_COLORS.map(c => (
              <button key={c.value} title={c.name} onClick={() => { update('themeColor', c.value); update('customColor', '') }} style={{
                width: 36, height: 36, borderRadius: '50%', background: c.value, border: 'none', cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
                outline: s.themeColor === c.value && !s.customColor ? '3px solid ' + c.value : 'none',
                outlineOffset: 3,
                boxShadow: s.themeColor === c.value && !s.customColor ? '0 0 0 2px #fff, 0 0 0 4px ' + c.value : '0 2px 4px rgba(0,0,0,0.18)',
                transform: s.themeColor === c.value && !s.customColor ? 'scale(1.15)' : 'scale(1)',
              }} />
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Custom Colour</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="color" value={s.customColor || s.themeColor} onChange={e => update('customColor', e.target.value)} style={{ width: 48, height: 36, borderRadius: 8, border: '1.5px solid #E5E7EB', cursor: 'pointer', padding: 2 }} />
              <input type="text" value={s.customColor || s.themeColor} onChange={e => { const v = e.target.value; if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) update('customColor', v) }} placeholder="#000000" style={{ width: 100, padding: '7px 10px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: 13, fontWeight: 600, fontFamily: 'monospace' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Preview</span>
              <span style={{ display: 'inline-block', width: 80, height: 32, borderRadius: 8, background: activeColor, transition: 'background 0.2s' }} />
            </div>
          </div>
        </div>
        <SettingRow label="Dark Mode" desc="Switch the entire portal to a dark background theme.">
          <ToggleSwitch id="darkMode" checked={s.darkMode} onChange={e => update('darkMode', e.target.checked)} />
        </SettingRow>
      </Section>

      <Section icon="🖋️" title="Font &amp; Typography" subtitle="Change the font style and size across the entire portal.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 8 }}>Font Family</label>
            <select className="form-control" value={s.fontFamily} onChange={e => update('fontFamily', e.target.value)} style={{ fontFamily: s.fontFamily }}>
              {FONT_FAMILIES.map(f => <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.name}</option>)}
            </select>
            <div style={{ marginTop: 10, padding: '12px 16px', borderRadius: 10, background: '#F9FAFB', border: '1px solid #E5E7EB', fontFamily: s.fontFamily, fontSize: s.fontSize }}>
              <strong>Preview:</strong> The skilled tailor crafted a beautiful blouse.
            </div>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 8 }}>Font Size</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FONT_SIZES.map(f => (
                <label key={f.value} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 12px', borderRadius: 8, border: '1.5px solid ' + (s.fontSize === f.value ? activeColor : '#E5E7EB'), background: s.fontSize === f.value ? activeColor + '11' : '#fff', transition: 'all 0.18s' }}>
                  <input type="radio" name="fontSize" value={f.value} checked={s.fontSize === f.value} onChange={() => update('fontSize', f.value)} style={{ accentColor: activeColor }} />
                  <span style={{ fontSize: f.value, fontFamily: s.fontFamily, fontWeight: 500 }}>{f.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section icon="🖥️" title="Display &amp; Layout" subtitle="Control how content is arranged and presented.">
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 8 }}>Display Density</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {DENSITIES.map(d => (
              <button key={d.value} onClick={() => update('density', d.value)} style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1.5px solid ' + (s.density === d.value ? activeColor : '#E5E7EB'), background: s.density === d.value ? activeColor + '11' : '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', color: s.density === d.value ? activeColor : '#6B7280', transition: 'all 0.18s' }}>
                {d.name}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 8 }}>Language</label>
          <select className="form-control" value={s.language} onChange={e => update('language', e.target.value)} style={{ maxWidth: 220 }}>
            {LANGUAGES.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        <SettingRow label="Compact Sidebar" desc="Show only icons in the sidebar to save screen space.">
          <ToggleSwitch id="compactSidebar" checked={s.compactSidebar} onChange={e => update('compactSidebar', e.target.checked)} />
        </SettingRow>
        <SettingRow label="Show Profile Avatars" desc="Display customer and tailor avatars in tables and cards.">
          <ToggleSwitch id="showAvatars" checked={s.showAvatars} onChange={e => update('showAvatars', e.target.checked)} />
        </SettingRow>
        <SettingRow label="Animations &amp; Transitions" desc="Smooth hover effects, page transitions, and micro-animations.">
          <ToggleSwitch id="animationsOn" checked={s.animationsOn} onChange={e => update('animationsOn', e.target.checked)} />
        </SettingRow>
      </Section>

      <Section icon="🔒" title="Privacy &amp; Security" subtitle="Control your visibility and how your data is used.">
        <SettingRow label="Public Profile" desc="Allow customers to discover your shop in search and browse results.">
          <ToggleSwitch id="publicProfile" checked={s.publicProfile} onChange={e => update('publicProfile', e.target.checked)} />
        </SettingRow>
        <SettingRow label="Show Online Status" desc="Let customers see when you are active and available.">
          <ToggleSwitch id="showOnlineStatus" checked={s.showOnlineStatus} onChange={e => update('showOnlineStatus', e.target.checked)} />
        </SettingRow>
        <SettingRow label="Share Usage Analytics" desc="Help us improve by sharing anonymised usage data.">
          <ToggleSwitch id="dataAnalytics" checked={s.dataAnalytics} onChange={e => update('dataAnalytics', e.target.checked)} />
        </SettingRow>
        <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #F3F4F6' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1F2937', marginBottom: 14 }}>Change Password</div>
          {pwErr && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '10px 14px', borderRadius: 8, marginBottom: 12, fontSize: 13 }}>{pwErr}</div>}
          {pwOk  && <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '10px 14px', borderRadius: 8, marginBottom: 12, fontSize: 13 }}>Password updated successfully!</div>}
          <form onSubmit={handlePasswordChange}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 14 }}>
              {[{ label: 'Current Password', key: 'current' }, { label: 'New Password', key: 'next' }, { label: 'Confirm New Password', key: 'confirm' }].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 5 }}>{f.label}</label>
                  <input className="form-control" type="password" placeholder="..." value={pwForm[f.key]} onChange={e => setPwForm({ ...pwForm, [f.key]: e.target.value })} required />
                </div>
              ))}
            </div>
            <button type="submit" style={{ padding: '9px 22px', borderRadius: 8, fontSize: 13.5, fontWeight: 700, border: 'none', background: activeColor, color: '#fff', cursor: 'pointer' }}>Update Password</button>
          </form>
        </div>
      </Section>

      <Section icon="✂️" title="Studio Operations" subtitle="Manage order acceptance and alert preferences for your tailoring studio.">
        <SettingRow label="Instant SMS on New Custom Orders" desc="Receive a text when a customer broadcasts a new dress request.">
          <ToggleSwitch id="smsOnNewOrder" checked={s.smsOnNewOrder} onChange={e => update('smsOnNewOrder', e.target.checked)} />
        </SettingRow>
        <SettingRow label="Auto-Accept Recurring Clients" desc="Automatically accept routine alterations from verified past clients.">
          <ToggleSwitch id="autoAcceptRecurring" checked={s.autoAcceptRecurring} onChange={e => update('autoAcceptRecurring', e.target.checked)} />
        </SettingRow>
      </Section>

      <Section icon="🏦" title="Payout &amp; Bank Details" subtitle="Update your bank account for receiving payments from TailorConnect.">
        {bankSaved && <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>Bank details saved successfully!</div>}
        <form onSubmit={handleSaveBank}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 5 }}>Bank Name *</label>
              <input className="form-control" value={s.bankName} onChange={e => update('bankName', e.target.value)} placeholder="e.g. HDFC Bank Ltd" required />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 5 }}>Account Number *</label>
              <input className="form-control" value={s.accountNumber} onChange={e => update('accountNumber', e.target.value)} placeholder="e.g. 50100239918231" required />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 5 }}>IFSC Code *</label>
              <input className="form-control" value={s.ifscCode} onChange={e => update('ifscCode', e.target.value)} placeholder="e.g. HDFC0000124" required />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 5 }}>UPI ID (Optional)</label>
              <input className="form-control" value={s.upiVpa} onChange={e => update('upiVpa', e.target.value)} placeholder="e.g. shop@upi" />
            </div>
          </div>
          <button type="submit" style={{ padding: '9px 22px', borderRadius: 8, fontSize: 13.5, fontWeight: 700, border: 'none', background: activeColor, color: '#fff', cursor: 'pointer' }}>Save Bank Details</button>
        </form>
      </Section>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '16px 0', borderTop: '1px solid #E5E7EB' }}>
        <button onClick={handleReset} style={{ padding: '10px 22px', borderRadius: 8, fontSize: 13.5, fontWeight: 600, border: '1.5px solid #E5E7EB', background: '#fff', cursor: 'pointer', color: '#6B7280' }}>Reset to Defaults</button>
        <button onClick={handleSave} style={{ padding: '10px 26px', borderRadius: 8, fontSize: 14, fontWeight: 700, border: 'none', background: activeColor, color: '#fff', cursor: 'pointer', boxShadow: '0 4px 12px ' + activeColor + '55' }}>
          {saved ? 'All Saved!' : 'Save All Settings'}
        </button>
      </div>
    </DashboardLayout>
  )
}
