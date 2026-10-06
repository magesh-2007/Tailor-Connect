import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { getOrders } from '../../services/orderService'
import { LoadingState } from '../../components/States'
import Table from '../../components/Table'
import StatusBadge from '../../components/StatusBadge'

export default function PaymentMonitoring() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders().then((data) => {
      setOrders(data)
      setLoading(false)
    })
  }, [])

  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0)

  const columns = [
    { key: 'id', header: 'Order ID' },
    { key: 'customer', header: 'Customer' },
    { key: 'amount', header: 'Amount', render: (row) => `₹${row.amount}` },
    { key: 'status', header: 'Payment Status', render: (row) => <StatusBadge status={row.status === 'delivered' ? 'paid' : 'pending'} /> },
  ]

  return (
    <DashboardLayout role="admin">
      <div className="page-header"><div><h1>Payment Monitoring</h1><p>Track platform-wide payments.</p></div></div>
      <div className="stat-grid" style={{ maxWidth: 300 }}>
        <div className="stat-card"><h3>Total Revenue</h3><div className="stat-value">₹{totalRevenue}</div></div>
      </div>
      {loading ? <LoadingState /> : <Table columns={columns} data={orders} />}
    </DashboardLayout>
  )
}
