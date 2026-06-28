import { BlurReveal } from '../components/BlurReveal'
import { ArrowRight } from 'lucide-react'

const lookbooks = [
  {
    img: '/images/lookbook-oaxaca.jpg',
    name: 'The Oaxaca House',
    description: 'Vibrant textiles, warm wood, and the layered beauty of Oaxacan craft traditions in a lived-in family home.',
    items: 24,
  },
  {
    img: '/images/lookbook-talavera.jpg',
    name: 'Talavera & Tile',
    description: 'Blue and white ceramic artistry meets functional kitchen design in this celebration of Puebla\'s most famous export.',
    items: 18,
  },
  {
    img: '/images/lookbook-desert.jpg',
    name: 'Desert Hacienda',
    description: 'Adobe walls, desert gardens, and the quiet grandeur of Southwestern Mexican architecture at golden hour.',
    items: 21,
  },
  {
    img: '/images/lookbook-moderno.jpg',
    name: 'Mexico City Modern',
    description: 'Clean concrete floors, floor-to-ceiling light, and one bold Oaxacan rug as the statement piece.',
    items: 16,
  },
  {
    img: '/images/lookbook-coastal.jpg',
    name: 'Coastal Yucat\u00E1n',
    description: 'Breezy white walls, hammocks, and turquoise accents — the relaxed elegance of the Mexican Caribbean.',
    items: 19,
  },
  {
    img: '/images/lookbook-highland.jpg',
    name: 'Highland Crafts',
    description: 'Rough stone, heavy beams, and wool blankets — the intimate warmth of Mexico\'s mountain regions.',
    items: 15,
  },
]

export function LookbooksPage() {
  return (
    <div style={{ paddingTop: '72px' }}>
      <section className="section-padding" style={{ paddingBottom: '32px' }}>
        <div className="content-max-width">
          <BlurReveal as="h1" threshold={0.3}>
            <span className="text-h1" style={{ color: 'var(--deep-espresso)' }}>
              Lookbooks
            </span>
          </BlurReveal>
          <BlurReveal as="p" threshold={0.3} delay={0.1}>
            <span
              className="text-body"
              style={{ color: 'var(--warm-gray)', marginTop: '16px', display: 'block' }}
            >
              Curated room collections that bring Mexican design traditions into contemporary living.
            </span>
          </BlurReveal>
        </div>
      </section>

      <section style={{ padding: '0 5vw 120px' }}>
        <div className="content-max-width">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '48px',
            }}
          >
            {lookbooks.map((book, index) => (
              <BlurReveal key={index} as="div" threshold={0.15} delay={index * 0.1}>
                <div
                  data-cursor-hover
                  style={{
                    display: 'grid',
                    gridTemplateColumns: index % 2 === 0 ? '1fr 1fr' : '1fr 1fr',
                    gap: '0',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: 'var(--light-sand)',
                  }}
                  className={`lookbook-row ${index % 2 === 1 ? 'lookbook-reverse' : ''}`}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <img
                      src={book.img}
                      alt={book.name}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        minHeight: '360px',
                      }}
                      className="hover-zoom-lg"
                    />
                  </div>
                  <div
                    style={{
                      padding: '64px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      className="text-label"
                      style={{ color: 'var(--terracotta)' }}
                    >
                      {book.items} ITEMS
                    </span>
                    <h2
                      className="text-h2"
                      style={{
                        color: 'var(--deep-espresso)',
                        marginTop: '16px',
                      }}
                    >
                      {book.name}
                    </h2>
                    <p
                      className="text-body"
                      style={{
                        color: 'var(--warm-gray)',
                        marginTop: '16px',
                        maxWidth: '440px',
                      }}
                    >
                      {book.description}
                    </p>
                    <span
                      className="text-button"
                      style={{
                        color: 'var(--terracotta)',
                        marginTop: '32px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        alignSelf: 'flex-start',
                      }}
                    >
                      Explore Collection
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </BlurReveal>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .lookbook-row {
          grid-template-columns: 1fr 1fr !important;
        }
        @media (max-width: 768px) {
          .lookbook-row {
            grid-template-columns: 1fr !important;
          }
          .lookbook-reverse {
            direction: ltr !important;
          }
        }
      `}</style>
    </div>
  )
}
