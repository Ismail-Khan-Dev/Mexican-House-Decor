import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { paymentService } from '../services/api'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export function PaymentStatusPage() {
  const [searchParams] = useSearchParams()
  const status = searchParams.get('status')
  const orderRef = searchParams.get('orderRef')
  const [verifying, setVerifying] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<'completed' | 'failed' | 'pending'>('pending')

  useEffect(() => {
    const verify = async () => {
      try {
        const txnRef = searchParams.get('txnRef')
        const res = await paymentService.getStatus({ transactionRef: txnRef || undefined })
        const payment = res.data.data?.payment
        if (payment) {
          setPaymentStatus(payment.status === 'completed' ? 'completed' : 'failed')
        } else {
          setPaymentStatus(status === 'success' ? 'completed' : 'failed')
        }
      } catch {
        setPaymentStatus(status === 'success' ? 'completed' : 'failed')
      } finally {
        setVerifying(false)
      }
    }
    verify()
  }, [searchParams, status])

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh' }}>
      <div
        style={{
          maxWidth: '480px',
          margin: '0 auto',
          padding: '0 5vw 120px',
          textAlign: 'center',
        }}
      >
        {verifying ? (
          <div style={{ padding: '60px 0' }}>
            <Loader2
              size={48}
              style={{
                color: 'var(--terracotta)',
                animation: 'spin 0.8s linear infinite',
                marginBottom: '16px',
              }}
            />
            <p className="text-body" style={{ color: 'var(--warm-gray)' }}>
              Verifying your payment...
            </p>
          </div>
        ) : paymentStatus === 'completed' ? (
          <>
            <CheckCircle size={56} style={{ color: '#10b981', marginBottom: '16px' }} />
            <h2
              className="text-h3"
              style={{ color: 'var(--deep-espresso)', marginBottom: '8px' }}
            >
              Payment Successful!
            </h2>
            <p className="text-body" style={{ color: 'var(--warm-gray)', marginBottom: '24px' }}>
              {orderRef
                ? `Your order ${orderRef} has been confirmed.`
                : 'Your order has been confirmed.'}
            </p>
            <Link
              to="/orders"
              data-cursor-hover
              className="text-button"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: 'var(--deep-espresso)',
                color: 'var(--white)',
                borderRadius: '6px',
                textDecoration: 'none',
              }}
            >
              View Orders
            </Link>
          </>
        ) : (
          <>
            <XCircle size={56} style={{ color: '#ef4444', marginBottom: '16px' }} />
            <h2
              className="text-h3"
              style={{ color: 'var(--deep-espresso)', marginBottom: '8px' }}
            >
              Payment Failed
            </h2>
            <p className="text-body" style={{ color: 'var(--warm-gray)', marginBottom: '24px' }}>
              Your payment could not be processed. Please try again.
            </p>
            <Link
              to="/cart"
              data-cursor-hover
              className="text-button"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: 'var(--deep-espresso)',
                color: 'var(--white)',
                borderRadius: '6px',
                textDecoration: 'none',
              }}
            >
              Return to Cart
            </Link>
          </>
        )}

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  )
}
