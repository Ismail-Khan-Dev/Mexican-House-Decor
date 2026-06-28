import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { orderService, type Order } from '../services/api'
import { BlurReveal } from '../components/BlurReveal'
import { Package, ArrowLeft } from 'lucide-react'

const statusColors: Record<string, string> = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#10b981',
  cancelled: '#ef4444',
}

export function OrdersPage() {
  const { isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getMyOrders()
        setOrders(response.data.data || [])
      } catch (err) {
        console.error('Failed to fetch orders:', err)
      } finally {
        setLoading(false)
      }
    }
    if (isAuthenticated) fetchOrders()
    else setLoading(false)
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div style={{ paddingTop: '120px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '0 5vw 120px', textAlign: 'center' }}>
          <BlurReveal>
            <h2 className="text-h3" style={{ color: 'var(--deep-espresso)', marginBottom: '12px' }}>
              Sign in to view orders
            </h2>
            <Link to="/login" data-cursor-hover className="text-button"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: 'var(--deep-espresso)', color: 'var(--white)', borderRadius: '6px', textDecoration: 'none' }}>
              Sign In
            </Link>
          </BlurReveal>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 5vw 120px' }}>
        <BlurReveal>
          <h1 className="text-h2" style={{ color: 'var(--deep-espresso)', marginBottom: '32px' }}>
            My Orders
          </h1>
        </BlurReveal>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid var(--adobe-clay)', borderTopColor: 'var(--terracotta)', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Package size={40} style={{ color: 'var(--warm-gray)', marginBottom: '12px' }} />
            <p className="text-body" style={{ color: 'var(--warm-gray)', marginBottom: '20px' }}>
              No orders yet.
            </p>
            <Link
              to="/shop"
              data-cursor-hover
              className="text-button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: 'var(--deep-espresso)',
                color: 'var(--white)',
                borderRadius: '6px',
                textDecoration: 'none',
              }}
            >
              <ArrowLeft size={16} />
              Start Shopping
            </Link>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((order) => (
              <div
                key={order._id}
                style={{
                  padding: '20px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--white)',
                  border: '1px solid var(--adobe-clay)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <span className="text-body-sm" style={{ fontWeight: 600, color: 'var(--deep-espresso)' }}>
                      {order.orderNumber}
                    </span>
                    <span className="text-label" style={{ color: 'var(--warm-gray)', marginLeft: '12px', fontSize: '12px' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span
                    className="text-label"
                    style={{
                      padding: '4px 10px',
                      borderRadius: '100px',
                      backgroundColor: `${statusColors[order.status] || '#999'}20`,
                      color: statusColors[order.status] || '#999',
                      fontWeight: 600,
                      fontSize: '11px',
                      textTransform: 'capitalize',
                    }}
                  >
                    {order.status}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                  {order.items.slice(0, 3).map((item: any, idx: number) => (
                    <span key={idx} className="text-body-sm" style={{ color: 'var(--warm-gray)', fontSize: '13px' }}>
                      {item.productName} x{item.quantity} — ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-body-sm" style={{ color: 'var(--warm-gray)', fontSize: '12px' }}>
                      +{order.items.length - 3} more items
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="text-body" style={{ fontWeight: 600, color: 'var(--deep-espresso)' }}>
                    ${order.total.toFixed(2)}
                  </span>
                  <Link
                    to={`/orders/${order._id}`}
                    className="text-body-sm"
                    style={{ color: 'var(--terracotta)', fontWeight: 500, textDecoration: 'underline' }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
