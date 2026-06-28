import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { BlurReveal } from '../components/BlurReveal'
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react'

export function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart()

  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  if (items.length === 0) {
    return (
      <div style={{ paddingTop: '120px', minHeight: '100vh' }}>
        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '0 5vw 120px',
            textAlign: 'center',
          }}
        >
          <BlurReveal>
            <ShoppingBag
              size={48}
              style={{ color: 'var(--warm-gray)', marginBottom: '16px' }}
            />
            <h2
              className="text-h3"
              style={{ color: 'var(--deep-espresso)', marginBottom: '8px' }}
            >
              Your bag is empty
            </h2>
            <p
              className="text-body"
              style={{ color: 'var(--warm-gray)', marginBottom: '24px' }}
            >
              Discover our handpicked Mexican home decor.
            </p>
            <Link
              to="/shop"
              data-cursor-hover
              className="text-button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: 'var(--deep-espresso)',
                color: 'var(--white)',
                borderRadius: '6px',
                textDecoration: 'none',
              }}
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
          </BlurReveal>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 5vw 120px' }}>
        <BlurReveal>
          <h1
            className="text-h2"
            style={{ color: 'var(--deep-espresso)', marginBottom: '40px' }}
          >
            Shopping Bag ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h1>
        </BlurReveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: '48px',
            alignItems: 'start',
          }}
          className="cart-layout"
        >
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {items.map((item) => (
              <div
                key={item.productId}
                style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--white)',
                  border: '1px solid var(--adobe-clay)',
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div>
                      <p
                        className="text-body"
                        style={{
                          fontWeight: 600,
                          color: 'var(--deep-espresso)',
                          margin: 0,
                        }}
                      >
                        {item.name}
                      </p>
                      <span
                        className="text-label"
                        style={{ color: 'var(--warm-gray)', fontSize: '12px' }}
                      >
                        {item.category}
                      </span>
                    </div>
                    <button
                      data-cursor-hover
                      onClick={() => removeItem(item.productId)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--warm-gray)',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '16px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: '1px solid var(--adobe-clay)',
                        borderRadius: '6px',
                      }}
                    >
                      <button
                        data-cursor-hover
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '8px 10px',
                          cursor: 'pointer',
                          color: 'var(--deep-espresso)',
                        }}
                      >
                        <Minus size={14} />
                      </button>
                      <span
                        className="text-body-sm"
                        style={{ minWidth: '24px', textAlign: 'center' }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        data-cursor-hover
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '8px 10px',
                          cursor: 'pointer',
                          color: 'var(--deep-espresso)',
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span
                      className="text-body"
                      style={{
                        fontWeight: 600,
                        color: 'var(--terracotta)',
                      }}
                    >
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div
            style={{
              padding: '24px',
              borderRadius: '8px',
              backgroundColor: 'var(--white)',
              border: '1px solid var(--adobe-clay)',
              position: 'sticky',
              top: '100px',
            }}
          >
            <h3
              className="text-body"
              style={{
                fontWeight: 600,
                color: 'var(--deep-espresso)',
                marginBottom: '20px',
              }}
            >
              Order Summary
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <Row label="Shipping" value={shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`} />
              <Row label="Tax (8%)" value={`$${tax.toFixed(2)}`} />
              <div
                style={{
                  height: '1px',
                  backgroundColor: 'var(--adobe-clay)',
                  margin: '4px 0',
                }}
              />
              <Row label="Total" value={`$${total.toFixed(2)}`} bold />
            </div>
            <Link
              to="/checkout"
              data-cursor-hover
              className="text-button"
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: '24px',
                padding: '14px',
                backgroundColor: 'var(--deep-espresso)',
                color: 'var(--white)',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'background-color 200ms',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.backgroundColor = 'var(--terracotta)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.backgroundColor = 'var(--deep-espresso)'
              }}
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/shop"
              className="text-body-sm"
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: '12px',
                color: 'var(--warm-gray)',
              }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

function Row({
  label,
  value,
  bold,
}: {
  label: string
  value: string
  bold?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span
        className="text-body-sm"
        style={{ color: 'var(--warm-gray)', fontWeight: bold ? 600 : 400 }}
      >
        {label}
      </span>
      <span
        className="text-body-sm"
        style={{
          color: 'var(--deep-espresso)',
          fontWeight: bold ? 600 : 400,
        }}
      >
        {value}
      </span>
    </div>
  )
}
