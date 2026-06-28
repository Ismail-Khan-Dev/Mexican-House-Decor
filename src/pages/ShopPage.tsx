import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BlurReveal } from '../components/BlurReveal'
import { Heart, ShoppingBag, Star, Filter } from 'lucide-react'
import { productService, type Product } from '../services/api'
import { useCart } from '../context/CartContext'
import { toast } from 'sonner'

const categories = [
  { name: 'All', value: 'All' },
  { name: 'Textiles', value: 'Textiles' },
  { name: 'Ceramics', value: 'Ceramics' },
  { name: 'Furniture', value: 'Furniture' },
  { name: 'Lighting', value: 'Lighting' },
  { name: 'Decor', value: 'Decor' },
]

export function ShopPage() {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [saved, setSaved] = useState<Set<string>>(new Set())

  /**
   * Fetch products from API on mount and when category changes
   */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError('')
        let response
        if (activeCategory === 'All') {
          response = await productService.getAll({ limit: 50 })
        } else {
          response = await productService.getByCategory(activeCategory, 50)
        }
        setProducts(response.data.data || [])
      } catch (err: any) {
        console.error('Failed to fetch products:', err)
        setError('Failed to load products. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [activeCategory])

  const filtered = products

  const toggleSave = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
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
              Shop
            </span>
          </BlurReveal>
          <BlurReveal as="p" threshold={0.3} delay={0.1}>
            <span
              className="text-body"
              style={{ color: 'var(--warm-gray)', marginTop: '16px', display: 'block' }}
            >
              Handpicked Mexican home decor, delivered to your door.
            </span>
          </BlurReveal>
        </div>
      </section>

      {/* Category filters */}
      <section style={{ padding: '0 5vw 48px' }}>
        <div className="content-max-width">
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Filter size={16} style={{ color: 'var(--warm-gray)', marginRight: '8px' }} />
            {categories.map((cat) => (
              <button
                key={cat.value}
                data-cursor-hover
                onClick={() => setActiveCategory(cat.value)}
                className="text-body-sm"
                style={{
                  padding: '8px 16px',
                  borderRadius: '100px',
                  border: '1px solid',
                  borderColor: activeCategory === cat.value ? 'var(--terracotta)' : 'var(--adobe-clay)',
                  backgroundColor: activeCategory === cat.value ? 'var(--terracotta)' : 'transparent',
                  color: activeCategory === cat.value ? 'var(--white)' : 'var(--deep-espresso)',
                  transition: 'all 200ms ease',
                  fontWeight: 500,
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section style={{ padding: '0 5vw 120px' }}>
        <div className="content-max-width">
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
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
          )}

          {error && (
            <div
              style={{
                padding: '20px',
                backgroundColor: '#ffe0e0',
                borderRadius: '8px',
                color: '#cc0000',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: 'var(--warm-gray)',
              }}
            >
              <p className="text-body">No products found in this category.</p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '32px',
              }}
              className="product-grid"
            >
              {filtered.map((product, index) => {
                const isSaved = saved.has(product._id)
                const productImage = product.thumbnail || product.images?.[0]?.url || '/images/placeholder.jpg'

                return (
                  <div
                    key={product._id}
                    style={{
                      animation: `fadeInUp 0.5s ease ${index * 0.05}s both`,
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '8px',
                        backgroundColor: 'var(--light-sand)',
                      }}
                    >
                      <img
                        src={productImage}
                        alt={product.name}
                        loading="lazy"
                        style={{
                          width: '100%',
                          aspectRatio: '1/1',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                        className="hover-zoom"
                      />
                      <button
                        data-cursor-hover
                        onClick={() => toggleSave(product._id)}
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: isSaved ? 'var(--terracotta)' : 'rgba(250, 245, 239, 0.9)',
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
                          bottom: '12px',
                          left: '12px',
                          right: '12px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
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
                          {product.category}
                        </span>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: 'rgba(250, 245, 239, 0.9)',
                            padding: '4px 10px',
                            borderRadius: '4px',
                          }}
                        >
                          <Star size={10} fill="var(--terracotta)" color="var(--terracotta)" />
                          <span className="text-label" style={{ fontSize: '10px', color: 'var(--deep-espresso)' }}>
                            {product.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: '12px' }}>
                      <p
                        className="text-body-sm"
                        style={{
                          color: 'var(--deep-espresso)',
                          fontWeight: 500,
                          margin: 0,
                        }}
                      >
                        {product.name}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: '8px',
                        }}
                      >
                        <span
                          className="text-body"
                          style={{
                            color: 'var(--terracotta)',
                            fontWeight: 600,
                          }}
                        >
                          ${product.price}
                        </span>
                        <span
                          className="text-label"
                          style={{ color: 'var(--warm-gray)', fontSize: '10px' }}
                        >
                          {product.reviews} reviews
                        </span>
                      </div>
                      <button
                        data-cursor-hover
                        className="text-button"
                        onClick={() => {
                          addItem(product)
                          toast.success(`${product.name} added to bag`)
                        }}
                        style={{
                          width: '100%',
                          marginTop: '12px',
                          padding: '12px',
                          backgroundColor: 'var(--deep-espresso)',
                          color: 'var(--white)',
                          border: 'none',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          transition: 'background-color 200ms',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--terracotta)'
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--deep-espresso)'
                        }}
                      >
                        <ShoppingBag size={14} />
                        Add to Bag
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .product-grid {
          grid-template-columns: repeat(4, 1fr) !important;
        }
        @media (max-width: 1024px) {
          .product-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .product-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
