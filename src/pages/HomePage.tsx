import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BlurReveal, SplitText } from '../components/BlurReveal'
import { ArrowRight, Heart } from 'lucide-react'
import { productService, type Product } from '../services/api'

/* ─────────────── data ─────────────── */

const lookbooks = [
  { img: '/images/lookbook-oaxaca.jpg', name: 'The Oaxaca House' },
  { img: '/images/lookbook-talavera.jpg', name: 'Talavera & Tile' },
  { img: '/images/lookbook-desert.jpg', name: 'Desert Hacienda' },
  { img: '/images/lookbook-moderno.jpg', name: 'Mexico City Modern' },
  { img: '/images/lookbook-coastal.jpg', name: 'Coastal Yucat\u00E1n' },
  { img: '/images/lookbook-highland.jpg', name: 'Highland Crafts' },
]

/* ─────────────── card entrance hook ─────────────── */

function useCardEntrance() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

/* ─────────────── masonry card ─────────────── */

function MasonryCard({
  product,
  index,
}: {
  product: Product
  index: number
}) {
  const { ref, visible } = useCardEntrance()
  // Vary aspect ratios based on index for visual interest
  const heights = ['tall', 'wide', 'square']
  const height = heights[index % 3] || 'square'
  const aspectRatio =
    height === 'tall' ? '3/4' : height === 'wide' ? '4/3' : '1/1'

  return (
    <div
      ref={ref}
      className="break-inside-avoid"
      style={{
        marginBottom: '24px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease ${index * 0.06}s, transform 0.6s cubic-bezier(0.76, 0, 0.24, 1) ${index * 0.06}s`,
      }}
    >
      <Link
        to="/shop"
        data-cursor-hover
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <div
          style={{
            overflow: 'hidden',
            borderRadius: '8px',
            position: 'relative',
          }}
        >
          <img
            src={product.thumbnail || product.images?.[0]?.url || '/images/placeholder.jpg'}
            alt={product.name}
            loading={index < 4 ? 'eager' : 'lazy'}
            style={{
              width: '100%',
              aspectRatio,
              objectFit: 'cover',
              display: 'block',
            }}
            className="hover-zoom"
          />
          <button
            data-cursor-hover
            onClick={(e) => e.preventDefault()}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(250, 245, 239, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--deep-espresso)',
              opacity: 0,
              transition: 'opacity 300ms ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
          >
            <Heart size={16} />
          </button>
        </div>
        <div style={{ marginTop: '12px' }}>
          <span
            className="text-label"
            style={{ color: 'var(--warm-gray)' }}
          >
            {product.category}
          </span>
          <p
            className="text-body-sm"
            style={{
              color: 'var(--deep-espresso)',
              fontWeight: 500,
              margin: 0,
              marginTop: '4px',
            }}
          >
            {product.name}
          </p>
        </div>
      </Link>
    </div>
  )
}

/* ─────────────── lookbook card ─────────────── */

function LookbookCard({
  book,
  index,
}: {
  book: (typeof lookbooks)[0]
  index: number
}) {
  const { ref, visible } = useCardEntrance()

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease ${index * 0.06}s, transform 0.6s cubic-bezier(0.76, 0, 0.24, 1) ${index * 0.06}s`,
      }}
    >
      <Link
        to="/lookbooks"
        data-cursor-hover
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '8px',
          }}
        >
          <img
            src={book.img}
            alt={book.name}
            loading="lazy"
            style={{
              width: '100%',
              aspectRatio: '4/5',
              objectFit: 'cover',
              display: 'block',
            }}
            className="hover-zoom-lg"
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '48px 24px 24px',
              background:
                'linear-gradient(to top, rgba(44, 24, 16, 0.6) 0%, transparent 100%)',
            }}
          >
            <h3
              className="text-h3"
              style={{ color: 'var(--white)', margin: 0 }}
            >
              {book.name}
            </h3>
            <span
              className="text-body-sm"
              style={{
                color: 'var(--white)',
                opacity: 0.8,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '8px',
              }}
            >
              Explore
              <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

/* ─────────────── homepage ─────────────── */

export function HomePage() {
  const [email, setEmail] = useState('')
  const [collectionItems, setCollectionItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  /**
   * Fetch featured products on mount
   */
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productService.getFeatured()
        setCollectionItems(response.data.data || [])
      } catch (error) {
        console.error('Failed to fetch featured products:', error)
        // Fallback - use empty array or show message
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  return (
    <div>
      {/* ═══════ HERO ═══════ */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '120px 5vw 64px',
        }}
      >
        <BlurReveal as="div" threshold={0.5}>
          <span
            className="text-label"
            style={{ color: 'var(--warm-gray)' }}
          >
            THE ART OF MEXICAN LIVING
          </span>
        </BlurReveal>

        <BlurReveal as="h1" className="text-display" threshold={0.3} delay={0.2}>
          <SplitText text={'Discover\nMexican Decor'} />
        </BlurReveal>

        <BlurReveal as="p" threshold={0.5} delay={0.5}>
          <span
            className="text-body"
            style={{
              color: 'var(--warm-gray)',
              maxWidth: '540px',
              display: 'block',
              margin: '32px auto 0',
            }}
          >
            A curated collection of handcrafted furniture, artisan textiles, and
            architectural elements for the modern hacienda.
          </span>
        </BlurReveal>

        <BlurReveal as="div" threshold={0.5} delay={0.7}>
          <Link
            to="/shop"
            data-cursor-hover
            className="text-button underline-hover"
            style={{
              color: 'var(--terracotta)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '40px',
            }}
          >
            Explore the Collection
            <ArrowRight
              size={16}
              style={{ transition: 'transform 300ms ease' }}
              className="arrow-icon"
            />
          </Link>
        </BlurReveal>

        {/* Hero image */}
        <BlurReveal as="div" threshold={0.1} delay={0.9}>
          <div
            style={{
              marginTop: '64px',
              width: '90vw',
              maxWidth: '1400px',
            }}
          >
            <img
              src="/images/hero-interior.jpg"
              alt="Warm Mexican interior with terracotta walls, handwoven rugs, and carved wood furniture"
              style={{
                width: '100%',
                aspectRatio: '16/9',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
          </div>
        </BlurReveal>
      </section>

      {/* ═══════ INTRO STATEMENT ═══════ */}
      <section className="section-padding">
        <div className="content-max-width" style={{ textAlign: 'center' }}>
          <BlurReveal as="p" threshold={0.3}>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(20px, 2.5vw, 28px)',
                lineHeight: 1.5,
                color: 'var(--deep-espresso)',
                maxWidth: '900px',
                display: 'inline-block',
              }}
            >
              We believe Mexican design is not a trend — it is a language of
              materials, colors, and centuries of craft. From Oaxacan textiles to
              Talavera ceramics, from hacienda arches to contemporary Mexico City
              ateliers, we curate the objects and stories that bring warmth and
              authenticity into your home.
            </span>
          </BlurReveal>
        </div>
      </section>

      {/* ═══════ CURATOR'S NOTE ═══════ */}
      <section
        className="section-padding"
        style={{ backgroundColor: 'var(--light-sand)' }}
      >
        <div
          className="content-max-width"
          style={{
            display: 'flex',
            gap: '5%',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: '1 1 35%', minWidth: '280px' }}>
            <BlurReveal as="h2" threshold={0.3}>
              <SplitText
                text={"The soul of a Mexican home lives in the details — the hand-thrown clay pot, the woven palm basket, the tile that has seen a hundred years."}
                className="text-h2"
              />
            </BlurReveal>
            <div
              style={{
                width: '60px',
                height: '2px',
                backgroundColor: 'var(--terracotta)',
                marginTop: '32px',
              }}
            />
          </div>
          <div
            style={{
              flex: '1 1 55%',
              minWidth: '280px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {[
              "Our editors travel across Mexico's design regions — from the pottery villages of Michoac\u00E1n to the textile cooperatives of Chiapas — to find makers whose work carries the depth of tradition and the freshness of contemporary vision.",
              'Every piece in our collection is chosen not just for its beauty, but for the story it tells and the hand that made it. We work directly with artisans and small studios, ensuring fair compensation and preserving techniques passed through generations.',
              'Whether you are furnishing a new home or searching for that one perfect object, our journal and lookbooks offer guidance rooted in respect for Mexican design heritage.',
            ].map((text, i) => (
              <BlurReveal key={i} as="p" threshold={0.3} delay={i * 0.15}>
                <span className="text-body" style={{ color: 'var(--deep-espresso)' }}>
                  {text}
                </span>
              </BlurReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ THE COLLECTION (Masonry) ═══════ */}
      <section className="section-padding">
        <div className="content-max-width">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '48px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <BlurReveal as="h2" threshold={0.3}>
              <span className="text-h2" style={{ color: 'var(--deep-espresso)' }}>
                The Collection
              </span>
            </BlurReveal>
            <Link
              to="/shop"
              data-cursor-hover
              className="text-nav underline-hover"
              style={{
                color: 'var(--terracotta)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              View all
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="masonry-3">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', gridColumn: '1/-1' }}>
                <div
                  style={{
                    display: 'inline-block',
                    width: '40px',
                    height: '40px',
                    border: '3px solid var(--adobe-clay)',
                    borderTopColor: 'var(--terracotta)',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite',
                  }}
                />
              </div>
            ) : collectionItems.length > 0 ? (
              collectionItems.map((product, index) => (
                <MasonryCard key={product._id} product={product} index={index} />
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', gridColumn: '1/-1', color: 'var(--warm-gray)' }}>
                <p className="text-body">Featured products coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════ FEATURED COLLECTION ═══════ */}
      <section
        style={{
          backgroundColor: 'var(--deep-espresso)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: '50%',
            height: '100%',
          }}
        >
          <img
            src="/images/featured-hacienda.jpg"
            alt="Modern hacienda interior"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to right, #2C1810 0%, #2C1810 30%, transparent 100%)',
            }}
          />
        </div>

        {/* Content */}
        <div
          className="content-max-width section-padding"
          style={{ position: 'relative', zIndex: 2, width: '100%' }}
        >
          <div style={{ maxWidth: '600px' }}>
            <BlurReveal as="div" threshold={0.3}>
              <span
                className="text-label"
                style={{ color: 'var(--terracotta)' }}
              >
                FEATURED
              </span>
            </BlurReveal>

            <BlurReveal as="h2" threshold={0.3} delay={0.1}>
              <span className="text-h1" style={{ color: 'var(--white)', marginTop: '16px', display: 'block' }}>
                Hacienda Modern
              </span>
            </BlurReveal>

            <BlurReveal as="p" threshold={0.3} delay={0.2}>
              <span
                className="text-body"
                style={{
                  color: 'var(--white)',
                  opacity: 0.8,
                  marginTop: '24px',
                  display: 'block',
                }}
              >
                A contemporary take on the classic hacienda aesthetic — clean
                lines meet warm materials, bold color meets restrained elegance.
                Explore our curation of furniture, textiles, and objects that
                bridge Mexican tradition and modern living.
              </span>
            </BlurReveal>

            <BlurReveal as="div" threshold={0.3} delay={0.3}>
              <Link
                to="/lookbooks"
                data-cursor-hover
                className="text-button"
                style={{
                  color: 'var(--terracotta)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '32px',
                }}
              >
                Explore the Lookbook
                <ArrowRight size={16} />
              </Link>
            </BlurReveal>
          </div>
        </div>
      </section>

      {/* ═══════ LOOKBOOK GALLERY ═══════ */}
      <section className="section-padding">
        <div className="content-max-width">
          <BlurReveal as="h2" threshold={0.3}>
            <span
              className="text-h2"
              style={{ color: 'var(--deep-espresso)', marginBottom: '48px', display: 'block' }}
            >
              Lookbooks
            </span>
          </BlurReveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
            }}
            className="lookbook-grid"
          >
            {lookbooks.map((book, index) => (
              <LookbookCard key={index} book={book} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ NEWSLETTER ═══════ */}
      <section
        className="section-padding"
        style={{ backgroundColor: 'var(--light-sand)' }}
      >
        <div className="content-max-width" style={{ textAlign: 'center' }}>
          <BlurReveal as="h2" threshold={0.3}>
            <span
              className="text-h2"
              style={{
                color: 'var(--deep-espresso)',
                maxWidth: '700px',
                display: 'inline-block',
              }}
            >
              Journal dispatches, delivered to your inbox
            </span>
          </BlurReveal>

          <BlurReveal as="p" threshold={0.3} delay={0.1}>
            <span
              className="text-body"
              style={{
                color: 'var(--warm-gray)',
                marginTop: '16px',
                display: 'block',
              }}
            >
              New collections, artisan stories, and design inspiration — every
              two weeks.
            </span>
          </BlurReveal>

          <BlurReveal as="div" threshold={0.3} delay={0.2}>
            <form
              onSubmit={(e) => e.preventDefault()}
              style={{
                marginTop: '40px',
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '0',
              }}
              className="newsletter-form"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="text-body"
                style={{
                  width: '360px',
                  maxWidth: '100%',
                  height: '52px',
                  backgroundColor: 'var(--white)',
                  border: '1px solid var(--adobe-clay)',
                  borderRadius: '4px 0 0 4px',
                  padding: '0 16px',
                  color: 'var(--deep-espresso)',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                data-cursor-hover
                className="text-button"
                style={{
                  height: '52px',
                  padding: '0 28px',
                  backgroundColor: 'var(--terracotta)',
                  color: 'var(--white)',
                  border: 'none',
                  borderRadius: '0 4px 4px 0',
                  transition: 'background-color 200ms',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    '#B05028'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    'var(--terracotta)'
                }}
              >
                Subscribe
              </button>
            </form>
          </BlurReveal>

          <BlurReveal as="p" threshold={0.3} delay={0.3}>
            <span
              className="text-label"
              style={{
                color: 'var(--warm-gray)',
                marginTop: '16px',
                display: 'block',
              }}
            >
              We respect your privacy. Unsubscribe at any time.
            </span>
          </BlurReveal>
        </div>
      </section>

      <style>{`
        .lookbook-grid {
          grid-template-columns: repeat(3, 1fr) !important;
        }
        @media (max-width: 1024px) {
          .lookbook-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .lookbook-grid {
            grid-template-columns: 1fr !important;
          }
          .newsletter-form input {
            border-radius: 4px !important;
            width: 100% !important;
          }
          .newsletter-form button {
            border-radius: 4px !important;
            width: 100% !important;
            margin-top: 8px;
          }
        }
        .arrow-icon {
          transition: transform 300ms ease;
        }
        a:hover .arrow-icon {
          transform: translateX(4px);
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
