import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Button from '../../components/Button'

export default function StudentChat() {
  const [activeInstructor, setActiveInstructor] = useState('Lakshmi Devi (Aari Master)')
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Lakshmi Devi', text: 'Hello Meena! How is your floral neckline pattern practice going?', time: '10:30 AM', isMe: false },
    { id: 2, sender: 'You', text: 'Hi Ma’am! The needle tension is much better now. I drafted the Princess cut bodice yesterday.', time: '10:32 AM', isMe: true },
    { id: 3, sender: 'Lakshmi Devi', text: 'Great work! Remember to keep a 1.5-inch side margin when you cut the silk fabric.', time: '10:35 AM', isMe: false }
  ])
  const [inputMsg, setInputMsg] = useState('')

  const handleSend = (e) => {
    e.preventDefault()
    if (!inputMsg.trim()) return

    const newMsg = {
      id: Date.now(),
      sender: 'You',
      text: inputMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    }

    setMessages([...messages, newMsg])
    setInputMsg('')
  }

  return (
    <DashboardLayout role="student">
      <div className="page-header">
        <div>
          <h1>Master Tailor Instructor Mentorship Chat</h1>
          <p>Direct live messaging with course instructors for needlework doubt clearance and fitting guidance.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, height: 560 }}>
        {/* INSTRUCTOR / PEER CHAT LIST */}
        <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 14, color: 'var(--primary-dark)', margin: '0 0 12px 0' }}>Course Instructors</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { name: 'Lakshmi Devi (Aari Master)', status: 'Online 🟢', course: 'Aari & Bridal Blouse' },
              { name: 'Mrs. Anand (Pattern Lab)', status: 'Active 2h ago', course: 'Fabric Drafting' }
            ].map(inst => (
              <div 
                key={inst.name}
                style={{
                  padding: 10,
                  borderRadius: 6,
                  background: activeInstructor === inst.name ? 'var(--primary-light)' : 'var(--bg-page)',
                  border: activeInstructor === inst.name ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveInstructor(inst.name)}
              >
                <strong style={{ fontSize: 13, display: 'block', color: 'var(--primary-dark)' }}>{inst.name}</strong>
                <div className="flex-between" style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  <span>{inst.course}</span>
                  <span>{inst.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHAT WINDOW */}
        <div className="card" style={{ padding: 18, display: 'flex', flexDirection: 'column' }}>
          <div className="flex-between" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: 10, marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 15, color: 'var(--primary-dark)', margin: 0 }}>{activeInstructor}</h3>
              <span className="muted" style={{ fontSize: 11.5 }}>Course Master Tailor Mentorship</span>
            </div>
            <span className="tag">🟢 Active Discussion</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 6, marginBottom: 14 }}>
            {messages.map(m => (
              <div 
                key={m.id}
                style={{
                  alignSelf: m.isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: m.isMe ? 'var(--primary)' : 'var(--bg-page)',
                  color: m.isMe ? '#FFFFFF' : 'var(--text-main)',
                  border: m.isMe ? 'none' : '1px solid var(--border-light)',
                  fontSize: 13
                }}
              >
                <div>{m.text}</div>
                <div style={{ fontSize: 10.5, marginTop: 4, textAlign: 'right', opacity: 0.8 }}>
                  {m.time}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} style={{ display: 'flex', gap: 10 }}>
            <input 
              className="form-control"
              placeholder="Type your question for master tailor..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
            />
            <Button variant="primary" type="submit">Send</Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
