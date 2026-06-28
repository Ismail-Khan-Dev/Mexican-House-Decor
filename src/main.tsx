import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <App />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              backgroundColor: 'var(--deep-espresso)',
              color: 'var(--white)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
            },
          }}
        />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>,
)
