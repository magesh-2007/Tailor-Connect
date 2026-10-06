import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    setCustomers([
      { id: 'user-cust-1', name: 'Priya Sharma', email: 'customer@tailorconnect.com', phone: '9876543210', location: 'Chennai (Anna Nagar)', ordersCount: 2, totalSpent: '₹3,600', status: 'Active', joinedDate: '2026-01-10' },
      { id: 'user-cust-2', name: 'Anitha Raj', email: 'anitha@example.com', phone: '9876543214', location: 'Coimbatore (RS Puram)', ordersCount: 1, totalSpent: '₹1,450', status: 'Active', joinedDate: '2026-02-01' },
      { id: 'user-cust-3', name: 'Divya Kumar', email: 'divya@example.com', phone: '9876543215', location: 'Trichy (Cantonment)', ordersCount: 1, totalSpent: '₹2,200', status: 'Active', joinedDate: '2026-02-15' },
      { id: 'user-cust-4', name: 'Kavitha Sundar', email: 'kavitha@example.com', phone: '9876543219', location: 'Madurai', ordersCount: 3, totalSpent: '₹4,800', status: 'Active', joinedDate: '2026-03-05' }
    ])
  }, [])

  const filtered = customers.filter(c => 
    !search || 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout role="admin">
      <div className="page-header">
        <div>
          <h1>Customer Accounts Directory</h1>
          <p>Supervise registered customers, active dress orders, total spend, and contact records.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20, padding: 16 }}>
        <input 
          className="form-control"
          placeholder="Search by customer name, email, phone or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--primary-light)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Customer ID</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Name & Contact</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Location</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Orders Placed</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Total Spent</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Joined Date</th>
                <th style={{ padding: '14px 16px', fontSize: 13, color: 'var(--primary-dark)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)', fontSize: 13 }}>{c.id}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>
                    <strong>{c.name}</strong>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>✉️ {c.email} • 📞 {c.phone}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>{c.location}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700 }}>{c.ordersCount} Orders</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>{c.totalSpent}</td>
                  <td style={{ padding: '14px 16px', fontSize: 12.5 }}>{c.joinedDate}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>
                    <span className="badge badge-active">{c.status}</span>
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
