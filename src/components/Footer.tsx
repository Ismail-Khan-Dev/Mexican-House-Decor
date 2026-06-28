import { Link } from 'react-router-dom'
import { Instagram, PinIcon } from 'lucide-react'

const footerColumns = [
  {
    title: 'Shop',
    links: ['Textiles', 'Ceramics', 'Furniture', 'Lighting', 'Decor', 'Gift Cards'],
  },
  {
    title: 'Learn',
    links: ['Journal', 'Lookbooks', 'Artisan Stories', 'Care Guides', 'About Us'],
  },
  {
    title: 'Support',
    links: ['Shipping & Returns', 'FAQ', 'Contact', 'Trade Program', 'Wholesale'],
  },
  {
    title: 'Company',
    links: ['Careers', 'Press', 'Sustainability', 'Privacy Policy', 'Terms'],
  },
]

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--deep-espresso)',
        padding: '80px 5vw 40px',
      }}
    >
      <div className="content-max-width">
        {/* Top row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <span
            className="text-label"
            style={{ color: 'var(--white)', opacity: 0.6 }}
          >
            MEXICAN HOUSE DECOR
          </span>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              style={{ color: 'var(--white)', opacity: 0.5, transition: 'opacity 200ms' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.5' }}
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              style={{ color: 'var(--white)', opacity: 0.5, transition: 'opacity 200ms' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.5' }}
            >
              <PinIcon size={20} />
            </a>
          </div>
        </div>

        {/* Middle row - columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '48px',
            marginTop: '48px',
          }}
          className="footer-columns"
        >
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h4
                className="text-label"
                style={{
                  color: 'var(--white)',
                  opacity: 0.6,
                  marginBottom: '16px',
                }}
              >
                {column.title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {column.links.map((link) => (
                  <li key={link} style={{ lineHeight: 2.2 }}>
                    <Link
                      to="#"
                      className="text-body-sm"
                      data-cursor-hover
                      style={{
                        color: 'var(--white)',
                        opacity: 0.5,
                        textDecoration: 'none',
                        transition: 'opacity 200ms',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.5' }}
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div
          style={{
            marginTop: '64px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <span
            className="text-label"
            style={{ color: 'var(--white)', opacity: 0.4 }}
          >
            &copy; 2025 Mexican House Decor. All rights reserved.
          </span>
          <span
            className="text-label"
            style={{ color: 'var(--white)', opacity: 0.4 }}
          >
            Crafted in Mexico
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-columns {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .footer-columns {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}
