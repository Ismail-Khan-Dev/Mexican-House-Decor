import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { orderService } from '../services/api'
import { BlurReveal } from '../components/BlurReveal'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

interface AddressForm {
  firstName: string
  lastName: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
}

const emptyAddress: AddressForm = {
  firstName: '',
  lastName: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'US',
  phone: '',
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, subtotal, clearCart } = useCart()
  const { isAuthenticated, user } = useAuth()
  const [address, setAddress] = useState<AddressForm>({
    ...emptyAddress,
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  })
  const [loading, setLoading] = useState(false)

  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  if (!isAuthenticated) {
    return (
      <div style={{ paddingTop: '120px', minHeight: '100vh' }}>
        <div
          style={{
            maxWidth: '500px',
            margin: '0 auto',
            padding: '0 5vw 120px',
            textAlign: 'center',
          }}
        >
          <BlurReveal>
            <h2
              className="text-h3"
              style={{ color: 'var(--deep-espresso)', marginBottom: '12px' }}
            >
              Sign in to checkout
            </h2>
            <p
              className="text-body"
              style={{ color: 'var(--warm-gray)', marginBottom: '24px' }}
            >
              Please sign in or create an account to continue.
            </p>
            <Link
              to="/login"
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
              Sign In
            </Link>
          </BlurReveal>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div style={{ paddingTop: '120px', minHeight: '100vh' }}>
        <div
          style={{
            maxWidth: '500px',
            margin: '0 auto',
            padding: '0 5vw 120px',
            textAlign: 'center',
          }}
        >
          <BlurReveal>
            <h2
              className="text-h3"
              style={{ color: 'var(--deep-espresso)', marginBottom: '8px' }}
            >
              Your bag is empty
            </h2>
            <Link
              to="/shop"
              data-cursor-hover
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

  const handleChange = (field: keyof AddressForm, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await orderService.create({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: address,
        paymentMethod: 'cod',
      })
      toast.success('Order placed successfully!')
      clearCart()
      navigate('/orders')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 5vw 120px' }}>
        <BlurReveal>
          <h1
            className="text-h2"
            style={{ color: 'var(--deep-espresso)', marginBottom: '40px' }}
          >
            Checkout
          </h1>
        </BlurReveal>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: '48px',
            alignItems: 'start',
          }}
          className="checkout-layout"
        >
          {/* Shipping Form */}
          <div>
            <h3
              className="text-body"
              style={{
                fontWeight: 600,
                color: 'var(--deep-espresso)',
                marginBottom: '20px',
              }}
            >
              Shipping Address
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  placeholder="First Name"
                  value={address.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required
                  style={inputStyle}
                />
                <input
                  placeholder="Last Name"
                  value={address.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
              <input
                placeholder="Street Address"
                value={address.street}
                onChange={(e) => handleChange('street', e.target.value)}
                required
                style={inputStyle}
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  required
                  style={{ ...inputStyle, flex: 1 }}
                />
                <input
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  required
                  style={{ ...inputStyle, flex: 1 }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  placeholder="ZIP Code"
                  value={address.zipCode}
                  onChange={(e) => handleChange('zipCode', e.target.value)}
                  required
                  style={{ ...inputStyle, flex: 1 }}
                />
                <input
                  placeholder="Country"
                  value={address.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  required
                  style={{ ...inputStyle, flex: 1 }}
                />
              </div>
              <input
                placeholder="Phone"
                type="tel"
                value={address.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
                style={inputStyle}
              />
            </div>
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
                marginBottom: '16px',
              }}
            >
              Order Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {items.map((item) => (
                <div
                  key={item.productId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ color: 'var(--deep-espresso)' }}>
                    {item.name} x{item.quantity}
                  </span>
                  <span style={{ color: 'var(--warm-gray)' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                height: '1px',
                backgroundColor: 'var(--adobe-clay)',
                marginBottom: '12px',
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <SummaryRow
                label="Shipping"
                value={shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
              />
              <SummaryRow label="Tax" value={`$${tax.toFixed(2)}`} />
              <div
                style={{
                  height: '1px',
                  backgroundColor: 'var(--adobe-clay)',
                  margin: '4px 0',
                }}
              />
              <SummaryRow label="Total" value={`$${total.toFixed(2)}`} bold />
            </div>

            <div
              className="text-label"
              style={{
                marginTop: '12px',
                padding: '8px 12px',
                backgroundColor: 'var(--light-sand)',
                borderRadius: '4px',
                color: 'var(--warm-gray)',
                fontSize: '11px',
              }}
            >
              <p style={{ margin: 0 }}>Payment: Cash on Delivery</p>
              <p style={{ margin: '4px 0 0' }}>
                {shipping === 0
                  ? 'Free shipping on orders over $100'
                  : 'Shipping calculated at checkout'}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              data-cursor-hover
              className="text-button"
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '14px',
                backgroundColor: loading ? 'var(--warm-gray)' : 'var(--deep-espresso)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 200ms',
              }}
            >
              {loading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .checkout-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

function SummaryRow({
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
        fontSize: '13px',
      }}
    >
      <span style={{ color: 'var(--warm-gray)', fontWeight: bold ? 600 : 400 }}>
        {label}
      </span>
      <span
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

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '6px',
  border: '1px solid var(--adobe-clay)',
  backgroundColor: 'var(--white)',
  color: 'var(--deep-espresso)',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
}
