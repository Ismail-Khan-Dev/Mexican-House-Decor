import { useState } from 'react'
import { BlurReveal } from '../components/BlurReveal'
import { Heart, Filter } from 'lucide-react'

const filters = [
  { name: 'All', count: 48 },
  { name: 'Hacienda', count: 12 },
  { name: 'Talavera', count: 8 },
  { name: 'Southwestern', count: 6 },
  { name: 'Boho Mexican', count: 10 },
  { name: 'Modern', count: 7 },
  { name: 'Rustic', count: 5 },
]

const inspirationItems = [
  { img: '/images/hero-interior.jpg', title: 'Sunlit Hacienda Courtyard with Terracotta Walls', style: 'Hacienda', height: 'tall' },
  { img: '/images/masonry-textiles-rug.jpg', title: 'Handwoven Oaxacan Wool Rug in Geometric Pattern', style: 'Hacienda', height: 'tall' },
  { img: '/images/masonry-ceramics-bowl.jpg', title: 'Nested Talavera Bowls on Rustic Wood', style: 'Talavera', height: 'wide' },
  { img: '/images/lookbook-oaxaca.jpg', title: 'Traditional Oaxacan Textile Room', style: 'Hacienda', height: 'tall' },
  { img: '/images/masonry-furniture-bench.jpg', title: 'Carved Mesquite Bench Against Adobe', style: 'Rustic', height: 'tall' },
  { img: '/images/lookbook-talavera.jpg', title: 'Blue and White Talavera Kitchen', style: 'Talavera', height: 'tall' },
  { img: '/images/masonry-lighting-pendant.jpg', title: 'Hammered Copper Pendant Glow', style: 'Hacienda', height: 'tall' },
  { img: '/images/masonry-decor-basket.jpg', title: 'Palm Leaf Wall Basket Collection', style: 'Boho Mexican', height: 'square' },
  { img: '/images/lookbook-desert.jpg', title: 'Desert Hacienda Walkway at Golden Hour', style: 'Southwestern', height: 'tall' },
  { img: '/images/masonry-textiles-pillow.jpg', title: 'Zapotec Woven Pillow Detail', style: 'Hacienda', height: 'tall' },
  { img: '/images/lookbook-moderno.jpg', title: 'Mexico City Apartment with Statement Rug', style: 'Modern', height: 'tall' },
  { img: '/images/masonry-ceramics-vase.jpg', title: 'Barro Negro Vase from Oaxaca', style: 'Hacienda', height: 'square' },
  { img: '/images/masonry-furniture-table.jpg', title: 'Wrought Iron and Terracotta Side Table', style: 'Hacienda', height: 'wide' },
  { img: '/images/lookbook-coastal.jpg', title: 'Breezy Yucatan Living Space', style: 'Boho Mexican', height: 'tall' },
  { img: '/images/masonry-lighting-lantern.jpg', title: 'Tin Star Lantern Shadow Play', style: 'Hacienda', height: 'tall' },
  { img: '/images/masonry-decor-runner.jpg', title: 'Hand-Embroidered Floral Runner', style: 'Hacienda', height: 'wide' },
  { img: '/images/lookbook-highland.jpg', title: 'Candlelit Highland Interior', style: 'Rustic', height: 'tall' },
  { img: '/images/masonry-textiles-throw.jpg', title: 'Rebozo Throw in Earth Tones', style: 'Boho Mexican', height: 'tall' },
  { img: '/images/masonry-ceramics-planter.jpg', title: 'Terracotta Planter with Monstera', style: 'Modern', height: 'square' },
  { img: '/images/featured-hacienda.jpg', title: 'Minimal Hacienda Modern Living', style: 'Modern', height: 'wide' },
]

export function InspirationPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [saved, setSaved] = useState<Set<number>>(new Set())

  const filtered = activeFilter === 'All'
    ? inspirationItems
    : inspirationItems.filter((item) => item.style === activeFilter)

  const toggleSave = (index: number) => {
    setSaved((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <div style={{ paddingTop: '72px' }}>
      {/* Header */}
      <section className="section-padding" style={{ paddingBottom: '32px' }}>
        <div className="content-max-width">
          <BlurReveal as="h1" threshold={0.3}>
            <span className="text-h1" style={{ color: 'var(--deep-espresso)' }}>
              Inspiration
            </span>
          </BlurReveal>
          <BlurReveal as="p" threshold={0.3} delay={0.1}>
            <span
              className="text-body"
              style={{ color: 'var(--warm-gray)', marginTop: '16px', display: 'block' }}
            >
              Save, share, and shop the Mexican home decor ideas that speak to you.
            </span>
          </BlurReveal>
        </div>
      </section>

      {/* Filters */}
      <section style={{ padding: '0 5vw 48px' }}>
        <div className="content-max-width">
          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <Filter size={16} style={{ color: 'var(--warm-gray)', marginRight: '8px' }} />
            {filters.map((filter) => (
              <button
                key={filter.name}
                data-cursor-hover
                onClick={() => setActiveFilter(filter.name)}
                className="text-body-sm"
                style={{
                  padding: '8px 16px',
                  borderRadius: '100px',
                  border: '1px solid',
                  borderColor: activeFilter === filter.name
                    ? 'var(--terracotta)'
                    : 'var(--adobe-clay)',
                  backgroundColor: activeFilter === filter.name
                    ? 'var(--terracotta)'
                    : 'transparent',
                  color: activeFilter === filter.name
                    ? 'var(--white)'
                    : 'var(--deep-espresso)',
                  transition: 'all 200ms ease',
                  fontWeight: 500,
                }}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Grid */}
      <section style={{ padding: '0 5vw 120px' }}>
        <div className="content-max-width">
          <div className="masonry-3">
            {filtered.map((item, index) => {
              const aspectRatio =
                item.height === 'tall' ? '3/4' : item.height === 'wide' ? '4/3' : '1/1'
              const isSaved = saved.has(index)

              return (
                <div
                  key={`${activeFilter}-${index}`}
                  className="break-inside-avoid"
                  style={{ marginBottom: '24px' }}
                >
                  <div
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '8px',
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      loading="lazy"
                      style={{
                        width: '100%',
                        aspectRatio,
                        objectFit: 'cover',
                        display: 'block',
                      }}
                      className="hover-zoom"
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                      }}
                    >
                      <span
                        className="text-label"
                        style={{
                          backgroundColor: 'rgba(250, 245, 239, 0.9)',
                          color: 'var(--deep-espresso)',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '10px',
                        }}
                      >
                        {item.style}
                      </span>
                    </div>
                    <button
                      data-cursor-hover
                      onClick={() => toggleSave(index)}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: isSaved
                          ? 'var(--terracotta)'
                          : 'rgba(250, 245, 239, 0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isSaved ? 'var(--white)' : 'var(--deep-espresso)',
                        transition: 'all 200ms ease',
                      }}
                    >
                      <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
                    </button>
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '32px 16px 16px',
                        background:
                          'linear-gradient(to top, rgba(44, 24, 16, 0.5) 0%, transparent 100%)',
                      }}
                    >
                      <p
                        className="text-body-sm"
                        style={{ color: 'var(--white)', margin: 0, fontWeight: 500 }}
                      >
                        {item.title}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
