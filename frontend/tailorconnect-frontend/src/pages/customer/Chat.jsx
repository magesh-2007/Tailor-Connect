import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import * as storage from '../../services/storageService'
import Button from '../../components/Button'

export default function CustomerChat() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const preselectedTailor = searchParams.get('recipient')
  const preselectedOrder = searchParams.get('orderId')

  const [contacts, setContacts] = useState([])
  const [activeContact, setActiveContact] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [attachedImage, setAttachedImage] = useState(null)

  const loadData = () => {
    if (!user) return
    let orderContacts = storage.getChatContacts ? storage.getChatContacts(user) : []
    
    if (orderContacts.length === 0) {
      orderContacts = [
        {
          id: 'user-tailor-1',
          name: 'Lakshmi Devi',
          shopName: 'Lakshmi Stitches & Bridal Studio',
          orderId: preselectedOrder || 'ORD-101',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'
        },
        {
          id: 'user-tailor-2',
          name: 'Mrs. Radha Raman',
          shopName: 'Vintage Needle Heritage Tailors',
          orderId: 'ORD-104',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80'
        }
      ]
    }

    setContacts(orderContacts)

    if (preselectedTailor) {
      const match = orderContacts.find(c => c.name.toLowerCase().includes(preselectedTailor.toLowerCase()))
      if (match) setActiveContact(match)
      else setActiveContact(orderContacts[0])
    } else if (!activeContact && orderContacts.length > 0) {
      setActiveContact(orderContacts[0])
    }
  }

  useEffect(() => {
    loadData()
  }, [user, preselectedTailor])

  useEffect(() => {
    if (user && activeContact) {
      const msgs = storage.getMessagesBetween ? storage.getMessagesBetween(user.id, activeContact.id) : []
      if (msgs.length === 0) {
        setMessages([
          {
            id: 1,
            senderRole: 'tailor',
            text: `Hello ${user.name || 'Priya'}! We have received your silk blouse measurements for Order #${activeContact.orderId}. We are starting the Aari frame tracing today.`,
            timestamp: '10:30 AM',
            orderRef: activeContact.orderId
          },
          {
            id: 2,
            senderRole: 'customer',
            text: 'Thank you Lakshmi Devi! Please ensure the front neck depth stays at 7 inches as per the profile.',
            timestamp: '10:35 AM'
          },
          {
            id: 3,
            senderRole: 'tailor',
            text: 'Certainly! We have marked 7.0 inches with double piping margin. You will receive trial fitting photos tomorrow.',
            timestamp: '10:40 AM'
          }
        ])
      } else {
        setMessages(msgs)
      }
    }
  }, [user, activeContact])

  const handleImageFile = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setAttachedImage(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSend = (e) => {
    e.preventDefault()
    if ((!text.trim() && !attachedImage) || !activeContact || !user) return

    const newMsg = {
      id: Date.now(),
      senderRole: 'customer',
      text,
      image: attachedImage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      orderRef: activeContact.orderId
    }

    setMessages(prev => [...prev, newMsg])
    setText('')
    setAttachedImage(null)

    // Simulated instant reply from tailor
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          senderRole: 'tailor',
          text: 'Noted! We have updated the workshop cutting notes accordingly.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          orderRef: activeContact.orderId
        }
      ])
    }, 1500)
  }

  return (
    <DashboardLayout role="customer">
      <div className="page-header">
        <div>
          <h1>Tailor Direct Messaging</h1>
          <p>Direct real-time consultation with the master tailors crafting your customized dress orders.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2.4fr)', gap: 20, height: 620 }} className="card">
        {/* CONVERSATION LIST */}
        <div style={{ borderRight: '1px solid var(--border)', paddingRight: 16, overflowY: 'auto' }}>
          <h3 style={{ fontSize: 15, marginBottom: 12 }}>Tailor Studios ({contacts.length})</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {contacts.map((c) => {
              const isSelected = activeContact?.id === c.id

              return (
                <div
                  key={c.id}
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-light)',
                    background: isSelected ? 'var(--bg-hover)' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                  }}
                  onClick={() => setActiveContact(c)}
                >
                  <img
                    src={c.avatar}
                    alt={c.name}
                    style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: isSelected ? 'var(--primary-dark)' : 'var(--text-main)' }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.shopName}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* MESSAGE THREAD & INPUT */}
        {activeContact ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* THREAD HEADER */}
            <div style={{ paddingBottom: 12, borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 16, margin: 0 }}>{activeContact.name}</h3>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{activeContact.shopName}</span>
              </div>
              <span className="sidebar-role-badge" style={{ fontSize: 11 }}>
                Order #{activeContact.orderId || 'ORD-101'}
              </span>
            </div>

            {/* MESSAGE LIST */}
            <div style={{ flex: 1, padding: '16px 0', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {messages.map((m) => {
                const isMe = m.senderRole === 'customer'

                return (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      justifyContent: isMe ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '75%',
                        padding: '10px 14px',
                        borderRadius: 8,
                        background: isMe ? 'var(--primary)' : 'var(--bg-subtle)',
                        color: isMe ? '#FFFFFF' : 'var(--text-main)',
                        border: isMe ? 'none' : '1px solid var(--border)',
                        fontSize: 13
                      }}
                    >
                      {m.orderRef && (
                        <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4, color: isMe ? '#FCE4EC' : 'var(--primary)' }}>
                          Ref: #{m.orderRef}
                        </div>
                      )}
                      {m.image && (
                        <img src={m.image} alt="Attachment" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 4, marginBottom: 6 }} />
                      )}
                      <div>{m.text}</div>
                      <div style={{ fontSize: 10, textAlign: 'right', marginTop: 4, opacity: 0.8 }}>
                        {m.timestamp || 'Just now'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ATTACHMENT PREVIEW */}
            {attachedImage && (
              <div style={{ padding: '6px 10px', background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 6, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12 }}>📎 Photo attached</span>
                <button type="button" onClick={() => setAttachedImage(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--danger)' }}>✕</button>
              </div>
            )}

            {/* INPUT FORM */}
            <form onSubmit={handleSend} style={{ display: 'flex', gap: 10, paddingTop: 10, borderTop: '1px solid var(--border-light)' }}>
              <label style={{ cursor: 'pointer', padding: '8px 12px', background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 16 }}>
                📎
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageFile} />
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Type a message or fitting note to tailor..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              <Button type="submit" variant="primary">
                Send
              </Button>
            </form>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            Select a tailor studio to start chatting.
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
