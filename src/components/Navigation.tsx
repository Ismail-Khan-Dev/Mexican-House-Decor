import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Menu, X, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'

const navLinks = [
  { label: 'Inspiration', href: '/inspiration' },
  { label: 'Shop', href: '/shop' },
  { label: 'Journal', href: '/journal' },
  { label: 'Lookbooks', href: '/lookbooks' },
  { label: 'About', href: '/about' },
]

export function Navigation() {
  const { itemCount } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '72px',
          zIndex: 100,
          backgroundColor: scrolled ? 'rgba(250, 245, 239, 0.98)' : 'rgba(250, 245, 239, 0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: scrolled ? '0 1px 0 rgba(44, 24, 16, 0.06)' : 'none',
          transition: 'background-color 300ms ease, box-shadow 300ms ease',
        }}
      >
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 5vw',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            className="text-label"
            style={{
              color: 'var(--deep-espresso)',
              textDecoration: 'none',
              letterSpacing: '0.08em',
            }}
          >
            MEXICAN HOUSE DECOR
          </Link>

          {/* Desktop Nav */}
          <div
            className="hidden md:flex"
            style={{ alignItems: 'center', gap: '32px' }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-nav underline-hover"
                style={{
                  color: 'var(--deep-espresso)',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link
              to="/cart"
              data-cursor-hover
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                padding: '4px',
                color: 'var(--deep-espresso)',
                opacity: 0.7,
                transition: 'opacity 200ms',
                textDecoration: 'none',
                lineHeight: 0,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.7' }}
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-6px',
                    backgroundColor: 'var(--terracotta)',
                    color: 'var(--white)',
                    fontSize: '10px',
                    fontWeight: 600,
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                  }}
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
            <button
              data-cursor-hover
              style={{
                background: 'none',
                border: 'none',
                padding: '4px',
                color: 'var(--deep-espresso)',
                opacity: 0.7,
                transition: 'opacity 200ms',
              }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.opacity = '1' }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.opacity = '0.7' }}
            >
              <Search size={20} />
            </button>
            <button
              data-cursor-hover
              className="md:hidden"
              style={{
                background: 'none',
                border: 'none',
                padding: '4px',
                color: 'var(--deep-espresso)',
                opacity: 0.7,
                transition: 'opacity 200ms',
              }}
              onClick={() => setMobileOpen(true)}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.opacity = '1' }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.opacity = '0.7' }}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            backgroundColor: 'rgba(250, 245, 239, 0.98)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
          }}
        >
          <button
            data-cursor-hover
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '5vw',
              background: 'none',
              border: 'none',
              color: 'var(--deep-espresso)',
              padding: '4px',
            }}
          >
            <X size={24} />
          </button>
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-h3 font-display"
              style={{
                color: 'var(--deep-espresso)',
                textDecoration: 'none',
                opacity: 0,
                animation: `fadeInUp 0.6s ease ${index * 0.1}s forwards`,
              }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
            filter: blur(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0px);
          }
        }
      `}</style>
    </>
  )
}
