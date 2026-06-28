import { BlurReveal, SplitText } from '../components/BlurReveal'
import { ArrowRight, MapPin, Users, Award, Leaf } from 'lucide-react'

const values = [
  {
    icon: MapPin,
    title: 'Direct from Source',
    description: 'We travel to pottery villages, textile cooperatives, and woodworking studios across Mexico to find pieces with real provenance.',
  },
  {
    icon: Users,
    title: 'Fair to Artisans',
    description: 'Every maker is paid fairly. We work directly with artisans and small studios, cutting out intermediaries and ensuring craft traditions survive.',
  },
  {
    icon: Award,
    title: 'Curated with Care',
    description: 'Each piece is chosen for its beauty, its story, and its quality. We do not sell mass-produced items or tourist-market replicas.',
  },
  {
    icon: Leaf,
    title: 'Sustainable by Nature',
    description: 'Handcrafted goods made from local, natural materials. Small-batch production that respects both people and the planet.',
  },
]

const regions = [
  { name: 'Oaxaca', craft: 'Textiles, Barro Negro Ceramics' },
  { name: 'Puebla', craft: 'Talavera Tile & Pottery' },
  { name: 'Michoac\u00E1n', craft: 'Copper, Woodwork' },
  { name: 'Chiapas', craft: 'Amber, Woven Textiles' },
  { name: 'Jalisco', craft: 'Blown Glass, Ceramics' },
  { name: 'Guanajuato', craft: 'Silver, Tinwork' },
]

export function AboutPage() {
  return (
    <div style={{ paddingTop: '72px' }}>
      {/* Hero */}
      <section
        className="section-padding"
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div className="content-max-width">
          <BlurReveal as="h1" threshold={0.3}>
            <SplitText
              text={"We believe in the\npower of craft."}
              className="text-h1"
            />
          </BlurReveal>
          <BlurReveal as="p" threshold={0.3} delay={0.3}>
            <span
              className="text-body"
              style={{
                color: 'var(--warm-gray)',
                maxWidth: '640px',
                display: 'inline-block',
                marginTop: '32px',
              }}
            >
              Mexican House Decor was founded on a simple idea: that the objects
              in our homes should carry meaning, support craft traditions, and
              connect us to the hands that made them.
            </span>
          </BlurReveal>
        </div>
      </section>

      {/* Story Section */}
      <section
        className="section-padding"
        style={{ backgroundColor: 'var(--light-sand)' }}
      >
        <div
          className="content-max-width about-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '64px',
            alignItems: 'center',
          }}
        >
          <div>
            <BlurReveal as="h2" threshold={0.3}>
              <span className="text-h2" style={{ color: 'var(--deep-espresso)' }}>
                Our Story
              </span>
            </BlurReveal>
            <BlurReveal as="p" threshold={0.3} delay={0.1}>
              <span
                className="text-body"
                style={{
                  color: 'var(--deep-espresso)',
                  marginTop: '24px',
                  display: 'block',
                }}
              >
                What began as a personal collection of pieces gathered on trips
                through Oaxaca and Puebla grew into something larger. Friends
                wanted to know where to find that rug, that lamp, that bowl.
                Artisans wanted help reaching new markets. And a community of
                design-lovers emerged, united by a shared appreciation for
                Mexican craft.
              </span>
            </BlurReveal>
            <BlurReveal as="p" threshold={0.3} delay={0.2}>
              <span
                className="text-body"
                style={{
                  color: 'var(--warm-gray)',
                  marginTop: '16px',
                  display: 'block',
                }}
              >
                Today, Mexican House Decor is a curated marketplace and editorial
                platform dedicated to the best of Mexican home design. We work
                with over 40 artisan families and small studios across six
                states, bringing their work to homes around the world.
              </span>
            </BlurReveal>
          </div>
          <BlurReveal as="div" threshold={0.3} delay={0.2}>
            <img
              src="/images/hero-interior.jpg"
              alt="Mexican interior with terracotta walls"
              style={{
                width: '100%',
                aspectRatio: '4/3',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
          </BlurReveal>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="content-max-width">
          <BlurReveal as="h2" threshold={0.3}>
            <span
              className="text-h2"
              style={{
                color: 'var(--deep-espresso)',
                textAlign: 'center',
                display: 'block',
                marginBottom: '64px',
              }}
            >
              What We Stand For
            </span>
          </BlurReveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '32px',
            }}
            className="values-grid"
          >
            {values.map((value, index) => (
              <BlurReveal
                key={index}
                as="div"
                threshold={0.2}
                delay={index * 0.1}
              >
                <div
                  style={{
                    padding: '32px',
                    backgroundColor: 'var(--light-sand)',
                    borderRadius: '8px',
                    height: '100%',
                  }}
                >
                  <value.icon
                    size={28}
                    style={{ color: 'var(--terracotta)' }}
                  />
                  <h3
                    className="text-h3"
                    style={{
                      color: 'var(--deep-espresso)',
                      marginTop: '16px',
                      fontSize: '22px',
                    }}
                  >
                    {value.title}
                  </h3>
                  <p
                    className="text-body-sm"
                    style={{
                      color: 'var(--warm-gray)',
                      marginTop: '12px',
                    }}
                  >
                    {value.description}
                  </p>
                </div>
              </BlurReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Regions */}
      <section
        className="section-padding"
        style={{ backgroundColor: 'var(--deep-espresso)' }}
      >
        <div className="content-max-width">
          <BlurReveal as="h2" threshold={0.3}>
            <span
              className="text-h2"
              style={{
                color: 'var(--white)',
                textAlign: 'center',
                display: 'block',
                marginBottom: '16px',
              }}
            >
              Where We Source
            </span>
          </BlurReveal>
          <BlurReveal as="p" threshold={0.3} delay={0.1}>
            <span
              className="text-body"
              style={{
                color: 'var(--white)',
                opacity: 0.7,
                textAlign: 'center',
                display: 'block',
                marginBottom: '64px',
              }}
            >
              From six Mexican states, we bring you the finest craft traditions.
            </span>
          </BlurReveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
            }}
            className="regions-grid"
          >
            {regions.map((region, index) => (
              <BlurReveal
                key={index}
                as="div"
                threshold={0.2}
                delay={index * 0.08}
              >
                <div
                  style={{
                    padding: '32px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    transition: 'border-color 300ms',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      'var(--terracotta)'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      'rgba(255,255,255,0.1)'
                  }}
                >
                  <h3
                    className="text-h3"
                    style={{
                      color: 'var(--white)',
                      fontSize: '24px',
                      margin: 0,
                    }}
                  >
                    {region.name}
                  </h3>
                  <p
                    className="text-body-sm"
                    style={{
                      color: 'var(--white)',
                      opacity: 0.5,
                      marginTop: '8px',
                    }}
                  >
                    {region.craft}
                  </p>
                </div>
              </BlurReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="section-padding"
        style={{ textAlign: 'center' }}
      >
        <div className="content-max-width">
          <BlurReveal as="h2" threshold={0.3}>
            <span
              className="text-h2"
              style={{ color: 'var(--deep-espresso)' }}
            >
              Ready to transform your space?
            </span>
          </BlurReveal>
          <BlurReveal as="div" threshold={0.3} delay={0.2}>
            <a
              href="/shop"
              data-cursor-hover
              className="text-button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '32px',
                padding: '16px 32px',
                backgroundColor: 'var(--terracotta)',
                color: 'var(--white)',
                textDecoration: 'none',
                borderRadius: '6px',
                transition: 'background-color 200ms',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#B05028'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--terracotta)'
              }}
            >
              Explore the Collection
              <ArrowRight size={16} />
            </a>
          </BlurReveal>
        </div>
      </section>

      <style>{`
        .about-grid {
          grid-template-columns: 1fr 1fr !important;
        }
        .values-grid {
          grid-template-columns: repeat(4, 1fr) !important;
        }
        .regions-grid {
          grid-template-columns: repeat(3, 1fr) !important;
        }
        @media (max-width: 1024px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
          .values-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .values-grid {
            grid-template-columns: 1fr !important;
          }
          .regions-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
