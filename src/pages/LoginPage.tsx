import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BlurReveal } from '../components/BlurReveal'
import { toast } from 'sonner'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, signup } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isLogin) {
        await login(form.email, form.password)
        toast.success('Welcome back!')
      } else {
        await signup(form.email, form.password, form.firstName, form.lastName)
        toast.success('Account created!')
      }
      navigate('/shop')
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh' }}>
      <div
        style={{
          maxWidth: '420px',
          margin: '0 auto',
          padding: '0 5vw 120px',
        }}
      >
        <BlurReveal>
          <h1
            className="text-h2"
            style={{ color: 'var(--deep-espresso)', marginBottom: '8px' }}
          >
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p
            className="text-body"
            style={{ color: 'var(--warm-gray)', marginBottom: '40px' }}
          >
            {isLogin ? 'Sign in to continue shopping.' : 'Join us and start shopping.'}
          </p>
        </BlurReveal>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                placeholder="First Name"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
                style={inputStyle}
              />
              <input
                placeholder="Last Name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
          )}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={8}
            style={inputStyle}
          />
          <button
            type="submit"
            disabled={loading}
            data-cursor-hover
            style={{
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
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p
          className="text-body-sm"
          style={{
            textAlign: 'center',
            marginTop: '24px',
            color: 'var(--warm-gray)',
          }}
        >
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--terracotta)',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
            }}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '6px',
  border: '1px solid var(--adobe-clay)',
  backgroundColor: 'var(--white)',
  color: 'var(--deep-espresso)',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box',
}
