import { useState, useEffect } from 'react'
import axios from 'axios'
import { UserCheck, UserX } from 'lucide-react'
import { toast } from 'sonner'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const res = await axios.get(`${API}/admin/users?page=${page}&limit=20`, { headers: { Authorization: `Bearer ${token}` } })
      setUsers(res.data.data || [])
      setTotalPages(res.data.pagination?.pages || 1)
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [page])

  const toggleStatus = async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${API}/admin/users/${id}/toggle-status`, {}, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('User status updated')
      fetchUsers()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update')
    }
  }

  return (
    <div>
      <h1 className="text-h3" style={{ color: 'var(--deep-espresso)', marginBottom: '24px' }}>Users</h1>

      <div style={{ backgroundColor: 'var(--white)', borderRadius: '8px', border: '1px solid var(--adobe-clay)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#faf5ef', textAlign: 'left' }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Joined</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--warm-gray)' }}>Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--warm-gray)' }}>No users found.</td></tr>
            ) : users.map((u) => (
              <tr key={u._id} style={{ borderBottom: '1px solid var(--adobe-clay)' }}>
                <td style={tdStyle}>
                  <span className="text-body-sm" style={{ fontWeight: 500, color: 'var(--deep-espresso)' }}>
                    {u.firstName} {u.lastName}
                  </span>
                </td>
                <td style={tdStyle}><span style={{ color: 'var(--warm-gray)', fontSize: '13px' }}>{u.email}</span></td>
                <td style={tdStyle}>
                  <span style={{ padding: '2px 8px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, backgroundColor: u.role === 'admin' ? '#8b5cf620' : '#faf5ef', color: u.role === 'admin' ? '#8b5cf6' : 'var(--warm-gray)', textTransform: 'capitalize' }}>
                    {u.role}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span style={{ padding: '2px 8px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, backgroundColor: u.isActive ? '#10b98120' : '#ef444420', color: u.isActive ? '#10b981' : '#ef4444' }}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ ...tdStyle, color: 'var(--warm-gray)', fontSize: '13px' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  {u.role !== 'admin' && (
                    <button onClick={() => toggleStatus(u._id)} data-cursor-hover
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: u.isActive ? '#ef4444' : '#10b981' }}
                      title={u.isActive ? 'Deactivate' : 'Activate'}>
                      {u.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                    </button>
                  )}
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
