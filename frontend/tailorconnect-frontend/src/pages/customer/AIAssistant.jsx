import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'

/* ─── tiny helpers ─────────────────────────────────────────────── */
function Avatar({ role }) {
  return (
    <div style={{
      width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
      background: role === 'ai' ? '#0F5C5E' : '#F3EEFF',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 16, fontWeight: 700, color: role === 'ai' ? '#fff' : '#7C3AED',
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    }}>
      {role === 'ai' ? '✦' : '👤'}
    </div>
  )
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 5, padding: '4px 0' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: '50%', background: '#0F5C5E',
          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  )
}

function TailorCard({ tailor, onOrder }) {
  return (
    <div style={{
      background: '#fff', border: '1.5px solid #E3E8E6', borderRadius: 12,
      padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%', background: '#DDEBE7',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0,
      }}>
        {tailor.avatar ? <img src={tailor.avatar} alt={tailor.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} /> : '👗'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#0F5C5E' }}>{tailor.name}</div>
        <div style={{ fontSize: 12, color: '#667085' }}>🏪 {tailor.shopName}</div>
        <div style={{ fontSize: 12, color: '#9CA3AF' }}>📍 {tailor.location} &nbsp;·&nbsp; ⭐ {tailor.rating}</div>
        {tailor.specializations?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
            {tailor.specializations.slice(0, 3).map(s => (
              <span key={s} style={{ fontSize: 10.5, fontWeight: 600, background: '#DDEBE7', color: '#0F5C5E', padding: '2px 8px', borderRadius: 999 }}>{s}</span>
            ))}
          </div>
        )}
      </div>
      <Link to={`/customer/tailors/${tailor._id}`} style={{ textDecoration: 'none' }}>
        <button style={{ padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600, background: '#0F5C5E', color: '#fff', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          View →
        </button>
      </Link>
    </div>
  )
}

function Message({ msg, onUseDesign }) {
  const isAI = msg.role === 'ai'
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: isAI ? 'row' : 'row-reverse' }}>
      <Avatar role={msg.role} />
      <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', gap: 6, alignItems: isAI ? 'flex-start' : 'flex-end' }}>
        {msg.image && (
          <img src={msg.image} alt="uploaded" style={{ maxHeight: 180, borderRadius: 10, objectFit: 'contain', border: '1.5px solid #E3E8E6' }} />
        )}
        {msg.content && (
          <div style={{
            background: isAI ? '#F0FDF9' : '#0F5C5E',
            color: isAI ? '#1F2937' : '#fff',
            padding: '11px 14px', borderRadius: isAI ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
            fontSize: 14, lineHeight: 1.6,
            border: isAI ? '1px solid #DDEBE7' : 'none',
            whiteSpace: 'pre-wrap',
          }}>
            {msg.content}
          </div>
        )}

        {/* Tailor results */}
        {msg.tailors?.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 400 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0F5C5E' }}>🔍 Found {msg.tailors.length} tailor{msg.tailors.length > 1 ? 's' : ''}:</div>
            {msg.tailors.map(t => <TailorCard key={t._id} tailor={t} />)}
          </div>
        )}

        {/* No tailors found */}
        {msg.action === 'find_tailors' && msg.tailors?.length === 0 && (
          <div style={{ background: '#FEF9F0', border: '1px solid #F0D09A', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#7A5620' }}>
            ⚠️ No tailors found in the database matching that query. Try a different location or specialization.
          </div>
        )}

        {/* Design prompt result */}
        {msg.action === 'generate_design' && (
          <div style={{ background: '#F3EEFF', border: '1.5px solid #C4B5FD', borderRadius: 12, padding: 16, maxWidth: 380 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#7C3AED', marginBottom: 8 }}>🎨 Design Concept</div>
            <div style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.6, marginBottom: 12 }}>{msg.designPrompt}</div>
            {msg.noImageKey && (
              <div style={{ background: '#FEF9F0', border: '1px solid #F0D09A', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#7A5620', marginBottom: 10 }}>
                ⚠️ AI image generation is not configured. To enable it, an image generation API (like Stability AI or Google Imagen) key is required.
              </div>
            )}
            <button
              onClick={() => onUseDesign(msg.designPrompt)}
              style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 700, background: '#7C3AED', color: '#fff', border: 'none', cursor: 'pointer' }}
            >
              ✂️ Use This in a Tailoring Request
            </button>
          </div>
        )}

        {/* Setup required */}
        {msg.setupRequired && (
          <div style={{ background: '#FEF3F3', border: '1.5px solid #FECACA', borderRadius: 12, padding: 16, maxWidth: 380 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#991B1B', marginBottom: 8 }}>🔑 API Key Required</div>
            <div style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.6, marginBottom: 10 }}>
              To enable Stitch AI, you need a free Google Gemini API key.
            </div>
            <ol style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.9, paddingLeft: 18, margin: '0 0 12px' }}>
              <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: '#0F5C5E', fontWeight: 600 }}>aistudio.google.com</a></li>
              <li>Click <strong>"Create API Key"</strong></li>
              <li>Copy the key</li>
              <li>Open <code>backend/.env</code></li>
              <li>Set: <code>GEMINI_API_KEY=your_key_here</code></li>
              <li>Restart the backend server</li>
            </ol>
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">
              <button style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 700, background: '#0F5C5E', color: '#fff', border: 'none', cursor: 'pointer' }}>
                Get Free API Key →
              </button>
            </a>
          </div>
        )}

        <div style={{ fontSize: 11, color: '#9CA3AF' }}>
          {new Date(msg.ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}

const SUGGESTIONS = [
  'Bridal blouse design suggestions for silk saree',
  'Kovilpatti-la Aari work panra tailor find pannu',
  'Maggam work blouse colour combination for green saree',
  'Chennai-la bridal specialist tailor suggest pannu',
  'What fabric is best for summer lehenga?',
  'Sleeve design ideas for designer blouse',
]

export default function AIAssistant() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    {
      role: 'ai', ts: Date.now(),
      content: '👋 Vanakkam! I\'m Stitch AI, your TailorConnect fashion assistant.\n\nI can help you with:\n✂️ Dress & blouse design advice\n🔍 Find tailors by location & specialty\n🧵 Fabric & embroidery recommendations\n📸 Analyze your dress images\n🎨 Generate design concepts\n\nAsk me anything in Tamil or English!',
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const [aiStatus, setAiStatus] = useState(null)
  const [activeMode, setActiveMode] = useState('chat') // 'chat' | 'design' | 'find'

  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const fileRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    api.get('/ai/status').then(r => setAiStatus(r.data)).catch(() => setAiStatus({ configured: false }))
  }, [])

  const send = useCallback(async (text, file, mode) => {
    const msg = text || input
    if (!msg.trim() && !file && !imageFile) return

    const userMsg = {
      role: 'user', ts: Date.now(),
      content: msg,
      image: imagePreview || null,
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setImageFile(null)
    setImagePreview(null)
    setLoading(true)

    try {
      let res

      if ((file || imageFile) && msg) {
        // Vision: image + text
        const form = new FormData()
        form.append('image', file || imageFile)
        form.append('message', msg)
        res = await api.post('/ai/chat-image', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        // Text chat
        const history = messages
          .filter(m => m.role === 'user' || m.role === 'ai')
          .slice(-10)
          .map(m => ({ role: m.role === 'ai' ? 'model' : 'user', content: m.content || '' }))

        res = await api.post('/ai/chat', { message: msg, history })
      }

      const d = res.data
      const aiMsg = {
        role: 'ai', ts: Date.now(),
        content: d.reply || '',
        tailors: d.tailors || null,
        action: d.action || null,
        designPrompt: d.designPrompt || null,
        noImageKey: d.noImageKey || false,
        setupRequired: d.setupRequired || false,
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (err) {
      const d = err.response?.data
      setMessages(prev => [...prev, {
        role: 'ai', ts: Date.now(),
        content: d?.message || 'Something went wrong. Please try again.',
        setupRequired: d?.setupRequired || false,
      }])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [input, imageFile, imagePreview, messages])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const handleImagePick = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = ev => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
    inputRef.current?.focus()
  }

  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice input is not supported in this browser. Use Chrome.')
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SR()
    rec.lang = 'ta-IN'
    rec.interimResults = true
    rec.maxAlternatives = 1
    rec.onstart = () => setIsListening(true)
    rec.onend = () => setIsListening(false)
    rec.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('')
      setInput(t)
    }
    rec.onerror = () => setIsListening(false)
    recognitionRef.current = rec
    rec.start()
  }
  const stopVoice = () => { recognitionRef.current?.stop(); setIsListening(false) }

  const handleUseDesign = (prompt) => {
    navigate(`/customer/create-order?aiPrompt=${encodeURIComponent(prompt)}`)
  }

  const MODES = [
    { id: 'chat', label: '💬 Chat', desc: 'Ask anything' },
    { id: 'design', label: '🎨 Design', desc: 'Generate concepts' },
    { id: 'find', label: '🔍 Find Tailors', desc: 'AI tailor search' },
  ]

  const handleModePrompt = (mode) => {
    setActiveMode(mode)
    if (mode === 'design') setInput('Design a ')
    else if (mode === 'find') setInput('Find a tailor in ')
    inputRef.current?.focus()
  }

  return (
    <DashboardLayout role="customer">
      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .ai-input:focus { outline: none; border-color: #0F5C5E; box-shadow: 0 0 0 3px rgba(15,92,94,0.1); }
        .suggestion-chip:hover { background: #0F5C5E !important; color: #fff !important; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,#0F5C5E,#3F7D5A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '0 4px 14px rgba(15,92,94,0.3)' }}>✦</div>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0F5C5E' }}>Stitch AI</h1>
          <p style={{ margin: 0, fontSize: 13, color: '#9CA3AF' }}>Your TailorConnect AI Fashion Assistant</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: aiStatus?.configured ? '#22C55E' : '#F59E0B', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 12, color: '#9CA3AF' }}>{aiStatus?.configured ? 'AI Ready' : 'API Key Needed'}</span>
        </div>
      </div>

      {/* Mode selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {MODES.map(m => (
          <button key={m.id} onClick={() => handleModePrompt(m.id)}
            style={{ padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: '1.5px solid', transition: 'all 0.18s',
              background: activeMode === m.id ? '#0F5C5E' : '#fff',
              color: activeMode === m.id ? '#fff' : '#0F5C5E',
              borderColor: '#0F5C5E',
            }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Main chat area */}
      <div style={{ background: '#FAFBFC', border: '1.5px solid #E3E8E6', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 520 }}>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 12px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {messages.map((msg, i) => (
            <Message key={i} msg={msg} onUseDesign={handleUseDesign} />
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <Avatar role="ai" />
              <div style={{ background: '#F0FDF9', border: '1px solid #DDEBE7', borderRadius: '4px 14px 14px 14px', padding: '11px 16px' }}>
                <TypingDots />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Image preview bar */}
        {imagePreview && (
          <div style={{ padding: '8px 16px', background: '#F0FDF9', borderTop: '1px solid #DDEBE7', display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={imagePreview} alt="preview" style={{ height: 48, width: 48, objectFit: 'cover', borderRadius: 8, border: '1.5px solid #DDEBE7' }} />
            <span style={{ fontSize: 12.5, color: '#0F5C5E', fontWeight: 600 }}>Image attached — ask anything about it</span>
            <button onClick={() => { setImageFile(null); setImagePreview(null) }} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 16, color: '#9CA3AF' }}>✕</button>
          </div>
        )}

        {/* Input area */}
        <div style={{ padding: '12px 16px', borderTop: '1.5px solid #E3E8E6', background: '#fff', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              ref={inputRef}
              className="ai-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={activeMode === 'find' ? 'Find a tailor in Chennai for Aari work...' : activeMode === 'design' ? 'Design a bridal silk blouse with Aari work...' : 'Ask in Tamil or English... (Shift+Enter for new line)'}
              rows={2}
              style={{ width: '100%', resize: 'none', padding: '10px 44px 10px 14px', borderRadius: 12, border: '1.5px solid #E3E8E6', fontSize: 14, fontFamily: 'inherit', lineHeight: 1.5, background: '#FAFBFC', boxSizing: 'border-box', transition: 'all 0.2s' }}
            />
            {/* Voice button inside input */}
            <button onClick={isListening ? stopVoice : startVoice}
              title={isListening ? 'Stop' : 'Voice input (Tamil/English)'}
              style={{ position: 'absolute', right: 10, bottom: 10, width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, background: isListening ? '#FEE2E2' : 'transparent', transition: 'all 0.2s' }}>
              {isListening ? '⏹' : '🎤'}
            </button>
          </div>

          {/* Image attach */}
          <button onClick={() => fileRef.current?.click()} title="Attach dress image"
            style={{ width: 44, height: 44, borderRadius: 12, border: '1.5px solid #E3E8E6', background: imageFile ? '#DDEBE7' : '#fff', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            📎
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImagePick} />

          {/* Send */}
          <button onClick={() => send()} disabled={loading || (!input.trim() && !imageFile)}
            style={{ width: 44, height: 44, borderRadius: 12, border: 'none', background: loading || (!input.trim() && !imageFile) ? '#D1D5DB' : '#0F5C5E', color: '#fff', cursor: loading ? 'wait' : 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
            {loading ? '⏳' : '➤'}
          </button>
        </div>
      </div>

      {/* Suggestion chips */}
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 8 }}>💡 Try asking:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SUGGESTIONS.map(s => (
            <button key={s} className="suggestion-chip" onClick={() => { setInput(s); inputRef.current?.focus() }}
              style={{ padding: '6px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 500, border: '1.5px solid #E3E8E6', background: '#fff', color: '#374151', cursor: 'pointer', transition: 'all 0.18s' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* API key setup warning */}
      {aiStatus && !aiStatus.configured && (
        <div style={{ marginTop: 16, background: '#FFF8F0', border: '1.5px solid #F0D09A', borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ fontSize: 22 }}>🔑</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>Gemini API Key Not Configured</div>
            <div style={{ fontSize: 13, color: '#7A5620', lineHeight: 1.6 }}>
              To activate Stitch AI, get a <strong>free</strong> Google Gemini API key and add it to <code style={{ background: '#FFF3CD', padding: '1px 6px', borderRadius: 4 }}>backend/.env</code>:
              <br /><code style={{ background: '#FFF3CD', padding: '2px 8px', borderRadius: 4, display: 'inline-block', marginTop: 4 }}>GEMINI_API_KEY=your_key_here</code>
            </div>
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">
              <button style={{ marginTop: 10, padding: '7px 16px', borderRadius: 8, fontSize: 12.5, fontWeight: 700, background: '#C9A66B', color: '#fff', border: 'none', cursor: 'pointer' }}>
                Get Free Key at Google AI Studio →
              </button>
            </a>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
