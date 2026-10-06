import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import Button from '../../components/Button'

export default function TailorCustomers() {
  const [customers, setCustomers] = useState([])

  const loadData = () => {
    const defaultClients = [
      {
        id: 'user-cust-1',
        name: 'Priya Sharma',
        phone: '9876543210',
        email: 'customer@tailorconnect.com',
        location: 'Anna Nagar, Chennai',
        totalOrders: 2,
        totalSpent: '₹3,600',
        lastOrderDate: '2026-08-20',
        preferredCategory: 'Silk Bridal Blouses'
      },
      {
        id: 'user-cust-2',
        name: 'Anitha Raj',
        phone: '9876543214',
        email: 'anitha@example.com',
        location: 'RS Puram, Coimbatore',
        totalOrders: 1,
        totalSpent: '₹1,450',
        lastOrderDate: '2026-07-15',
        preferredCategory: 'Designer Kurtis & Palazzos'
      },
      {
        id: 'user-cust-3',
        name: 'Divya Kumar',
        phone: '9876543215',
        email: 'divya@example.com',
        location: 'Cantonment, Trichy',
        totalOrders: 1,
        totalSpent: '₹2,200',
        lastOrderDate: '2026-07-05',
        preferredCategory: 'Bridal Blouses & Veils'
      }
    ]
    setCustomers(defaultClients)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <DashboardLayout role="tailor">
      <div className="page-header">
        <div>
          <h1>Client Directory & Order History</h1>
          <p>Maintain customer fitting profiles, contact records, and quick chat links with your studio's clientele.</p>
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--primary-light)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Client Name</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Contact Details</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Location</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Total Orders</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Total Spent</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Specialty Interest</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <strong style={{ fontSize: 14, color: 'var(--primary-dark)' }}>{c.name}</strong>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>
                    <div>📞 {c.phone}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>✉️ {c.email}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>
                    {c.location}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700 }}>
                    {c.totalOrders} Orders
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>
                    {c.totalSpent}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 12.5 }}>
                    <span className="tag">{c.preferredCategory}</span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <Link to="/tailor/chat">
                      <Button size="sm" variant="secondary">💬 Chat</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
