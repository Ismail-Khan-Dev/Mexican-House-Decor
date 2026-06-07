import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Package, ShoppingCart, Users, LogOut, ChevronLeft,
} from 'lucide-react'

const sidebarLinks = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Users', href: '/admin/users', icon: Users },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  if (!user || user.role !== 'admin') {
    return (
      <div style={{ paddingTop: '120px', textAlign: 'center', minHeight: '100vh' }}>
        <h2 className="text-h3" style={{ color: 'var(--deep-espresso)' }}>Access Denied</h2>
        <p className="text-body" style={{ color: 'var(--warm-gray)', marginTop: '8px' }}>
          Admin access required.
        </p>
        <Link to="/" className="text-button" style={{ color: 'var(--terracotta)', marginTop: '16px', display: 'inline-block' }}>
          Go Home
        </Link>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', paddingTop: '72px' }}>
      <aside
        style={{
          width: collapsed ? '64px' : '240px',
          backgroundColor: 'var(--deep-espresso)',
          color: 'var(--white)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 200ms',
          position: 'fixed',
          top: '72px',
          left: 0,
          bottom: 0,
          zIndex: 50,
        }}
      >
        <div style={{ padding: collapsed ? '16px 0' : '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {!collapsed && <span className="text-label" style={{ letterSpacing: '0.05em' }}>ADMIN</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{ background: 'none', border: 'none', color: 'var(--white)', cursor: 'pointer', padding: '4px', transform: collapsed ? 'rotate(180deg)' : '' }}
          >
            <ChevronLeft size={16} />
          </button>
        </div>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', padding: collapsed ? '0 8px' : '0 12px' }}>
          {sidebarLinks.map((link) => {
            const isActive = link.href === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(link.href)
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                to={link.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: collapsed ? '12px' : '10px 14px',
                  borderRadius: '6px',
                  backgroundColor: isActive ? 'rgba(250,245,239,0.15)' : 'transparent',
                  color: isActive ? 'var(--white)' : 'rgba(250,245,239,0.6)',
                  textDecoration: 'none',
                  transition: 'all 150ms',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(250,245,239,0.1)' }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = isActive ? 'rgba(250,245,239,0.15)' : 'transparent'
                }}
              >
                <Icon size={18} />
                {!collapsed && <span className="text-body-sm">{link.label}</span>}
              </Link>
            )
          })}
        </nav>
        <div style={{ padding: collapsed ? '12px 0' : '12px 16px', borderTop: '1px solid rgba(250,245,239,0.1)' }}>
          <button
            onClick={() => { logout(); navigate('/') }}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none',
              color: 'rgba(250,245,239,0.6)', cursor: 'pointer', padding: collapsed ? '12px' : '10px 14px',
              width: '100%', borderRadius: '6px', justifyContent: collapsed ? 'center' : 'flex-start',
            }}
          >
            <LogOut size={18} />
            {!collapsed && <span className="text-body-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      <main
        style={{
          flex: 1,
          marginLeft: collapsed ? '64px' : '240px',
          padding: '32px',
          backgroundColor: '#f8f6f3',
          minHeight: 'calc(100vh - 72px)',
          transition: 'margin-left 200ms',
        }}
      >
        {children}
      </main>
    </div>
  )
}
