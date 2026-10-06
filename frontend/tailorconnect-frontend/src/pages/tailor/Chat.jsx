import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/Button'

export default function TailorChat() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const preselectedCustomer = searchParams.get('recipient')
  const preselectedOrder = searchParams.get('orderId')

  const [contacts, setContacts] = useState([])
  const [activeContact, setActiveContact] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [attachedImage, setAttachedImage] = useState(null)

  const loadData = () => {
    let list = [
      {
        id: 'user-cust-1',
        name: 'Priya Sharma',
        orderId: preselectedOrder || 'ORD-101',
        dress: 'Silk Bridal Blouse (Aari Needlework)',
        phone: '9876543210',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80'
      },
      {
        id: 'user-cust-2',
        name: 'Ananya Ramesh',
        orderId: 'ORD-104',
        dress: 'Can-Can Layered Party Lehenga',
        phone: '9876543220',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'
      }
    ]

    setContacts(list)

    if (preselectedCustomer) {
      const match = list.find(c => c.name.toLowerCase().includes(preselectedCustomer.toLowerCase()))
      if (match) setActiveContact(match)
      else setActiveContact(list[0])
    } else if (!activeContact && list.length > 0) {
      setActiveContact(list[0])
    }
  }

  useEffect(() => {
    loadData()
  }, [user, preselectedCustomer])

  useEffect(() => {
    if (activeContact) {
      setMessages([
        {
          id: 1,
          senderRole: 'tailor',
          text: `Hello ${activeContact.name}! We have started fabric cutting for your ${activeContact.dress}.`,
          timestamp: '10:30 AM',
          orderRef: activeContact.orderId
        },
        {
          id: 2,
          senderRole: 'customer',
          text: 'Thank you! Looking forward to seeing the Aari needlework updates.',
          timestamp: '10:35 AM'
        }
      ])
    }
  }, [activeContact])

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
    if ((!text.trim() && !attachedImage) || !activeContact) return

    const newMsg = {
      id: Date.now(),
      senderRole: 'tailor',
      text,
      image: attachedImage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      orderRef: activeContact.orderId
    }

    setMessages(prev => [...prev, newMsg])
    setText('')
    setAttachedImage(null)
  }

  return (
    <DashboardLayout role="tailor">
      <div className="page-header">
        <div>
          <h1>Customer Communications & Fitting Notes</h1>
          <p>Real-time chat with clients for order updates, measurement verifications, and progress photos.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2.4fr)', gap: 20, height: 620 }} className="card">
        {/* CUSTOMER CONVERSATION LIST */}
        <div style={{ borderRight: '1px solid var(--border)', paddingRight: 16, overflowY: 'auto' }}>
          <h3 style={{ fontSize: 15, marginBottom: 12 }}>Active Clients ({contacts.length})</h3>

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
                      #{c.orderId} • {c.dress}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* THREAD */}
        {activeContact ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ paddingBottom: 12, borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 16, margin: 0 }}>{activeContact.name}</h3>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{activeContact.dress}</span>
              </div>
              <span className="sidebar-role-badge" style={{ fontSize: 11 }}>
                Order #{activeContact.orderId}
              </span>
            </div>

            <div style={{ flex: 1, padding: '16px 0', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {messages.map((m) => {
                const isMe = m.senderRole === 'tailor'

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

            {attachedImage && (
              <div style={{ padding: '6px 10px', background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 6, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12 }}>📎 Progress photo attached</span>
                <button type="button" onClick={() => setAttachedImage(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--danger)' }}>✕</button>
              </div>
            )}

            <form onSubmit={handleSend} style={{ display: 'flex', gap: 10, paddingTop: 10, borderTop: '1px solid var(--border-light)' }}>
              <label style={{ cursor: 'pointer', padding: '8px 12px', background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 16 }}>
                📎
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageFile} />
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Send fitting update, photo, or question to customer..."
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
            Select a customer to view conversation.
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
