import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import api from '../../services/api'

/* ── Month name helper ──────────────────────────────────────────────────────── */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const monthName = (m) => MONTHS[(m - 1) % 12] || `M${m}`

/* ── Mini bar chart ─────────────────────────────────────────────────────────── */
function BarChart({ data = [], valueKey = 'count', labelKey = 'label', color = 'var(--primary)', height = 120 }) {
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height, paddingTop: 8 }}>
      {data.map((d, i) => {
        const pct = Math.max(4, Math.round(((d[valueKey] || 0) / max) * 100))
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{d[valueKey] || 0}</span>
            <div style={{
              width: '100%', height: `${pct}%`, minHeight: 4,
              background: color, borderRadius: '3px 3px 0 0',
              transition: 'height 0.5s ease',
            }} />
            <span style={{ fontSize: 9, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{d[labelKey]}</span>
          </div>
        )
      })}
    </div>
  )
}

/* ── Stat card ──────────────────────────────────────────────────────────────── */
function Stat({ label, value, icon, color = 'var(--primary)', sub }) {
  return (
    <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
      {icon && <span style={{ position: 'absolute', top: 12, right: 14, fontSize: 22, opacity: 0.2 }}>{icon}</span>}
      <h3>{label}</h3>
      <div className="stat-value" style={{ color }}>{value ?? '—'}</div>
      {sub && <span className="stat-subtitle">{sub}</span>}
    </div>
  )
}

export default function Reports() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/admin/reports')
        setData(res.data?.data || {})
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load reports. Make sure the backend is running.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  /* Prepare chart data from API */
  const userGrowthChart = (data?.userGrowth || []).map(d => ({
    label: monthName(d._id?.month),
    count: d.count,
  }))
  const revenueChart = (data?.orderRevenue || []).map(d => ({
    label: monthName(d._id?.month),
    count: d.revenue,
  }))

  const summary = data?.summary || {}

  return (
    <DashboardLayout role="admin">
      <div className="page-header">
        <div>
          <h1>📈 Reports &amp; Analytics</h1>
          <p>Live platform analytics — real data pulled directly from MongoDB.</p>
        </div>
      </div>

      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '12px 16px', borderRadius: 8, marginBottom: 20 }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 36, marginBottom: 14 }}>⏳</div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading analytics from MongoDB…</p>
        </div>
      ) : (
        <>
          {/* ── Summary KPIs ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
            <Stat label="Total Revenue"  value={`₹${(summary.totalRevenue || 0).toLocaleString()}`}  icon="💰" color="#16A34A" sub="Payments collected" />
            <Stat label="Total Orders"   value={summary.totalOrders ?? '—'}    icon="📦" color="var(--primary)" sub="All time orders" />
            <Stat label="Total Users"    value={summary.totalUsers ?? '—'}     icon="👥" color="#7C3AED" sub="Registered accounts" />
            <Stat label="Total Courses"  value={summary.totalCourses ?? '—'}   icon="📚" color="#1D4ED8" sub="Learning catalogue" />
            <Stat label="Total Reviews"  value={data?.totalReviews ?? '—'}     icon="⭐" color="#F59E0B" sub="Customer feedback" />
            <Stat label="Avg Rating"     value={data?.avgRating ? `${data.avgRating.toFixed(1)} / 5` : '—'} icon="🌟" color="#F59E0B" sub="Platform rating" />
          </div>

          {/* ── Charts Row ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, marginBottom: 28 }}>
            {/* User Growth */}
            <div className="card" style={{ padding: 22 }}>
              <h3 style={{ fontSize: 15, margin: '0 0 4px' }}>👥 User Growth (Last 6 Months)</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 14px' }}>New registrations per month</p>
              {userGrowthChart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: 13 }}>No data in the last 6 months.</div>
              ) : (
                <BarChart data={userGrowthChart} valueKey="count" labelKey="label" color="var(--primary)" height={100} />
              )}
            </div>

            {/* Revenue */}
            <div className="card" style={{ padding: 22 }}>
              <h3 style={{ fontSize: 15, margin: '0 0 4px' }}>💰 Revenue (Last 6 Months)</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 14px' }}>Monthly payment collections (₹)</p>
              {revenueChart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: 13 }}>No payment data in the last 6 months.</div>
              ) : (
                <BarChart data={revenueChart} valueKey="count" labelKey="label" color="#16A34A" height={100} />
              )}
            </div>
          </div>

          {/* ── Top Tailors ── */}
          <div className="card" style={{ padding: 22, marginBottom: 28 }}>
            <h3 style={{ fontSize: 15, margin: '0 0 16px' }}>🏆 Top Tailors by Orders</h3>
            {(!data?.topTailors || data.topTailors.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: 13 }}>No tailor order data yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {data.topTailors.map((t, i) => (
                  <div key={t._id || i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: i === 0 ? '#F59E0B' : i === 1 ? '#9CA3AF' : i === 2 ? '#C2410C' : 'var(--bg-subtle)',
                      color: i < 3 ? '#FFFFFF' : 'var(--text-main)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 12, flexShrink: 0,
                    }}>#{i + 1}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.name || 'Tailor'}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{t.email}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--primary)' }}>{t.orderCount} orders</div>
                      <div style={{ fontSize: 12, color: '#16A34A', fontWeight: 600 }}>₹{(t.revenue || 0).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Course Status Breakdown ── */}
          <div className="card" style={{ padding: 22, marginBottom: 28 }}>
            <h3 style={{ fontSize: 15, margin: '0 0 16px' }}>📚 Course Status Breakdown</h3>
            {(!data?.courseStats || data.courseStats.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: 13 }}>No course data yet.</div>
            ) : (
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {data.courseStats.map(cs => (
                  <div key={cs._id} style={{
                    background: 'var(--bg-subtle)', borderRadius: 10, padding: '14px 20px',
                    border: '1px solid var(--border-light)', minWidth: 120, textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--primary)' }}>{cs.count}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginTop: 4 }}>
                      {cs._id || 'Unknown'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
