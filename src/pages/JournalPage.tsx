import { Link } from 'react-router-dom'
import { BlurReveal } from '../components/BlurReveal'
import { ArrowRight, Clock } from 'lucide-react'

const articles = [
  {
    img: '/images/lookbook-oaxaca.jpg',
    category: 'Artisan Stories',
    title: 'The Weavers of Teotitl\u00E1n del Valle: Keeping Zapotec Textile Traditions Alive',
    excerpt: 'In a small village outside Oaxaca City, families have been weaving wool rugs for generations. We spent a week with the Mendoza family to understand how tradition and innovation coexist.',
    readTime: '8 min read',
    date: 'November 2025',
    featured: true,
  },
  {
    img: '/images/masonry-ceramics-vase.jpg',
    category: 'Materials',
    title: 'Barro Negro: The Ancient Art of Oaxacan Black Clay',
    excerpt: 'How a single village in Oaxaca produces some of the most sought-after ceramics in the world.',
    readTime: '5 min read',
    date: 'October 2025',
    featured: false,
  },
  {
    img: '/images/masonry-lighting-pendant.jpg',
    category: 'Design Guide',
    title: 'Choosing the Right Mexican Lighting for Every Room',
    excerpt: 'From hammered copper pendants to tin star lanterns, the right light transforms a space.',
    readTime: '6 min read',
    date: 'October 2025',
    featured: false,
  },
  {
    img: '/images/lookbook-desert.jpg',
    category: 'Style Guide',
    title: 'Desert Hacienda Style: Bringing the Southwest Home',
    excerpt: 'How to capture the warmth and simplicity of desert living in any climate.',
    readTime: '7 min read',
    date: 'September 2025',
    featured: false,
  },
  {
    img: '/images/masonry-textiles-rug.jpg',
    category: 'Buying Guide',
    title: 'How to Choose an Authentic Mexican Wool Rug',
    excerpt: 'What to look for, what to avoid, and how to care for your investment piece.',
    readTime: '4 min read',
    date: 'September 2025',
    featured: false,
  },
  {
    img: '/images/lookbook-talavera.jpg',
    category: 'History',
    title: 'Talavera Tile: From Puebla to the World',
    excerpt: 'The 500-year story of one of Mexico\'s most recognizable art forms.',
    readTime: '9 min read',
    date: 'August 2025',
    featured: false,
  },
]

export function JournalPage() {
  const featured = articles.find((a) => a.featured)
  const rest = articles.filter((a) => !a.featured)

  return (
    <div style={{ paddingTop: '72px' }}>
      <section className="section-padding" style={{ paddingBottom: '32px' }}>
        <div className="content-max-width">
          <BlurReveal as="h1" threshold={0.3}>
            <span className="text-h1" style={{ color: 'var(--deep-espresso)' }}>
              Journal
            </span>
          </BlurReveal>
          <BlurReveal as="p" threshold={0.3} delay={0.1}>
            <span
              className="text-body"
              style={{ color: 'var(--warm-gray)', marginTop: '16px', display: 'block' }}
            >
              Stories from Mexico's design regions, artisan profiles, and expert guides.
            </span>
          </BlurReveal>
        </div>
      </section>

      {/* Featured Article */}
      {featured && (
        <section style={{ padding: '0 5vw 64px' }}>
          <div className="content-max-width">
            <BlurReveal as="div" threshold={0.2}>
              <Link
                to="#"
                data-cursor-hover
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '48px',
                  textDecoration: 'none',
                  backgroundColor: 'var(--light-sand)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
                className="featured-article"
              >
                <div style={{ overflow: 'hidden' }}>
                  <img
                    src={featured.img}
                    alt={featured.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      minHeight: '400px',
                    }}
                    className="hover-zoom-lg"
                  />
                </div>
                <div
                  style={{
                    padding: '48px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    className="text-label"
                    style={{ color: 'var(--terracotta)' }}
                  >
                    {featured.category}
                  </span>
                  <h2
                    className="text-h3"
                    style={{
                      color: 'var(--deep-espresso)',
                      marginTop: '16px',
                    }}
                  >
                    {featured.title}
                  </h2>
                  <p
                    className="text-body"
                    style={{
                      color: 'var(--warm-gray)',
                      marginTop: '16px',
                    }}
                  >
                    {featured.excerpt}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginTop: '24px',
                    }}
                  >
                    <span
                      className="text-label"
                      style={{ color: 'var(--warm-gray)', fontSize: '11px' }}
                    >
                      {featured.date}
                    </span>
                    <span
                      className="text-label"
                      style={{
                        color: 'var(--warm-gray)',
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Clock size={12} />
                      {featured.readTime}
                    </span>
                  </div>
                  <span
                    className="text-button"
                    style={{
                      color: 'var(--terracotta)',
                      marginTop: '24px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    Read Article
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </BlurReveal>
          </div>
        </section>
      )}

      {/* Article Grid */}
      <section style={{ padding: '0 5vw 120px' }}>
        <div className="content-max-width">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '32px',
            }}
            className="article-grid"
          >
            {rest.map((article, index) => (
              <BlurReveal key={index} as="div" threshold={0.2} delay={index * 0.1}>
                <Link
                  to="#"
                  data-cursor-hover
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div
                    style={{
                      overflow: 'hidden',
                      borderRadius: '8px',
                    }}
                  >
                    <img
                      src={article.img}
                      alt={article.title}
                      loading="lazy"
                      style={{
                        width: '100%',
                        aspectRatio: '4/3',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                      className="hover-zoom"
                    />
                  </div>
                  <span
                    className="text-label"
                    style={{
                      color: 'var(--terracotta)',
                      marginTop: '16px',
                      display: 'block',
                    }}
                  >
                    {article.category}
                  </span>
                  <h3
                    className="text-h3"
                    style={{
                      color: 'var(--deep-espresso)',
                      marginTop: '8px',
                      fontSize: '22px',
                    }}
                  >
                    {article.title}
                  </h3>
                  <p
                    className="text-body-sm"
                    style={{
                      color: 'var(--warm-gray)',
                      marginTop: '8px',
                    }}
                  >
                    {article.excerpt}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginTop: '12px',
                    }}
                  >
                    <span
                      className="text-label"
                      style={{ color: 'var(--warm-gray)', fontSize: '11px' }}
                    >
                      {article.date}
                    </span>
                    <span
                      className="text-label"
                      style={{
                        color: 'var(--warm-gray)',
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Clock size={12} />
                      {article.readTime}
                    </span>
                  </div>
                </Link>
              </BlurReveal>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .featured-article {
          grid-template-columns: 1fr 1fr !important;
        }
        .article-grid {
          grid-template-columns: repeat(3, 1fr) !important;
        }
        @media (max-width: 1024px) {
          .featured-article {
            grid-template-columns: 1fr !important;
          }
          .article-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .article-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
