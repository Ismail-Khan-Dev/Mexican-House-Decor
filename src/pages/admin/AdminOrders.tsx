import { useState, useEffect } from 'react'
import { orderService, type Order } from '../../services/api'
import { toast } from 'sonner'
import { Search, Package } from 'lucide-react'

const statusColors: Record<string, string> = {
  pending: '#f59e0b', confirmed: '#3b82f6', shipped: '#8b5cf6', delivered: '#10b981', cancelled: '#ef4444',
}

const orderStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await orderService.getAllOrders({ page, limit: 15 })
      const allOrders = res.data.data || []
      const filtered = search ? allOrders.filter((o: any) => o.orderNumber?.toLowerCase().includes(search.toLowerCase())) : allOrders
      setOrders(filtered)
      setTotalPages(res.data.pagination?.pages || 1)
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [page])

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    try {
      await orderService.updateStatus(id, status)
      toast.success(`Order status updated to ${status}`)
      fetchOrders()
    } catch {
      toast.error('Failed to update')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="text-h3" style={{ color: 'var(--deep-espresso)' }}>Orders</h1>
        <div style={{ position: 'relative', maxWidth: '280px', width: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--warm-gray)' }} />
          <input placeholder="Search by order #..." value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '6px', border: '1px solid var(--adobe-clay)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--white)', borderRadius: '8px', border: '1px solid var(--adobe-clay)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#faf5ef', textAlign: 'left' }}>
              <th style={thStyle}>Order #</th>
              <th style={thStyle}>Customer</th>
              <th style={thStyle}>Items</th>
              <th style={thStyle}>Total</th>
              <th style={thStyle}>Payment</th>
              <th style={thStyle}>Status</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--warm-gray)' }}>Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                <Package size={32} style={{ color: 'var(--warm-gray)', marginBottom: '8px' }} />
                <p style={{ color: 'var(--warm-gray)', margin: 0 }}>No orders found.</p>
              </td></tr>
            ) : orders.map((order: any) => (
              <tr key={order._id} style={{ borderBottom: '1px solid var(--adobe-clay)' }}>
                <td style={tdStyle}><span className="text-body-sm" style={{ fontWeight: 600, color: 'var(--deep-espresso)' }}>{order.orderNumber}</span></td>
                <td style={tdStyle}>
                  <span className="text-body-sm" style={{ color: 'var(--deep-espresso)' }}>
                    {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span className="text-label" style={{ color: 'var(--warm-gray)' }}>
                    {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                  </span>
                </td>
                <td style={tdStyle}><span style={{ fontWeight: 600 }}>${order.total?.toFixed(2)}</span></td>
                <td style={tdStyle}>
                  <span style={{ padding: '2px 8px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, textTransform: 'capitalize',
                    backgroundColor: order.paymentStatus === 'completed' ? '#10b98120' : order.paymentStatus === 'failed' ? '#ef444420' : '#f59e0b20',
                    color: order.paymentStatus === 'completed' ? '#10b981' : order.paymentStatus === 'failed' ? '#ef4444' : '#f59e0b',
                  }}>{order.paymentStatus}</span>
                </td>
                <td style={tdStyle}>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    disabled={updating === order._id}
                    style={{
                      padding: '4px 8px', borderRadius: '4px', border: `1px solid ${statusColors[order.status] || '#ccc'}`,
                      color: statusColors[order.status] || '#666', fontWeight: 600, fontSize: '12px',
                      backgroundColor: `${statusColors[order.status] || '#ccc'}10`, cursor: 'pointer', outline: 'none',
                    }}
                  >
                    {orderStatuses.map((s) => (
                      <option key={s} value={s} style={{ color: statusColors[s], fontWeight: 600 }}>{s}</option>
                    ))}
                  </select>
                </td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <span className="text-label" style={{ color: 'var(--warm-gray)', fontSize: '12px' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--adobe-clay)', backgroundColor: p === page ? 'var(--deep-espresso)' : 'var(--white)', color: p === page ? 'var(--white)' : 'var(--deep-espresso)', cursor: 'pointer' }}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const thStyle: React.CSSProperties = { padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.05em' }
const tdStyle: React.CSSProperties = { padding: '12px 16px', fontSize: '14px' }
