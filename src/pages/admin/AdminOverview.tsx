import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Package, ShoppingCart, Users, DollarSign, AlertTriangle } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export function AdminOverview() {
  const [stats, setStats] = useState<any>(null)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [lowStock, setLowStock] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }
        const res = await axios.get(`${API}/admin/stats`, { headers })
        const d = res.data.data
        setStats(d.stats)
        setRecentOrders(d.recentOrders || [])
        setLowStock(d.lowStockProducts || [])
      } catch (err) {
        console.error('Failed to load stats', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid var(--adobe-clay)', borderTopColor: 'var(--terracotta)', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
    </div>
  }

  const cards = [
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, color: '#3b82f6' },
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: '#10b981' },
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: '#8b5cf6' },
    { label: 'Revenue', value: `$${(stats?.revenue || 0).toLocaleString()}`, icon: DollarSign, color: '#f59e0b' },
  ]

  return (
    <div>
      <h1 className="text-h3" style={{ color: 'var(--deep-espresso)', marginBottom: '24px' }}>Dashboard Overview</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }} className="stats-grid">
        {cards.map((card) => (
          <div key={card.label} style={{ padding: '20px', backgroundColor: 'var(--white)', borderRadius: '8px', border: '1px solid var(--adobe-clay)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p className="text-body-sm" style={{ color: 'var(--warm-gray)', margin: 0 }}>{card.label}</p>
                <p className="text-h3" style={{ color: 'var(--deep-espresso)', margin: '8px 0 0', fontWeight: 700 }}>{card.value}</p>
              </div>
              <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: `${card.color}15` }}>
                <card.icon size={20} color={card.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="dashboard-grid">
        <div style={{ backgroundColor: 'var(--white)', borderRadius: '8px', border: '1px solid var(--adobe-clay)', padding: '20px' }}>
          <h3 className="text-body" style={{ fontWeight: 600, color: 'var(--deep-espresso)', marginBottom: '16px' }}>Recent Orders</h3>
          {recentOrders.length === 0 ? (
            <p className="text-body-sm" style={{ color: 'var(--warm-gray)' }}>No orders yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recentOrders.map((order: any) => (
                <div key={order._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--adobe-clay)' }}>
                  <div>
                    <p className="text-body-sm" style={{ fontWeight: 500, color: 'var(--deep-espresso)', margin: 0 }}>{order.orderNumber}</p>
                    <p className="text-label" style={{ color: 'var(--warm-gray)', fontSize: '11px', margin: 0 }}>
                      {order.userId?.firstName} {order.userId?.lastName}
                    </p>
                  </div>
                  <span style={{
                    padding: '2px 8px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, textTransform: 'capitalize',
                    backgroundColor: order.status === 'delivered' ? '#10b98120' : order.status === 'cancelled' ? '#ef444420' : '#f59e0b20',
                    color: order.status === 'delivered' ? '#10b981' : order.status === 'cancelled' ? '#ef4444' : '#f59e0b',
                  }}>{order.status}</span>
                </div>
              ))}
            </div>
          )}
          <Link to="/admin/orders" className="text-body-sm" style={{ color: 'var(--terracotta)', marginTop: '12px', display: 'inline-block' }}>
            View all orders →
          </Link>
        </div>

        <div style={{ backgroundColor: 'var(--white)', borderRadius: '8px', border: '1px solid var(--adobe-clay)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <AlertTriangle size={16} color="#f59e0b" />
            <h3 className="text-body" style={{ fontWeight: 600, color: 'var(--deep-espresso)', margin: 0 }}>Low Stock Alert</h3>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-body-sm" style={{ color: 'var(--warm-gray)' }}>All products well-stocked.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lowStock.map((product: any) => (
                <div key={product._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--adobe-clay)' }}>
                  <p className="text-body-sm" style={{ color: 'var(--deep-espresso)', margin: 0 }}>{product.name}</p>
                  <span style={{ padding: '2px 8px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, backgroundColor: product.stock === 0 ? '#ef444420' : '#f59e0b20', color: product.stock === 0 ? '#ef4444' : '#f59e0b' }}>
                    {product.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
          <Link to="/admin/products" className="text-body-sm" style={{ color: 'var(--terracotta)', marginTop: '12px', display: 'inline-block' }}>
            Manage products →
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
