import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'
import { CustomCursor } from './components/CustomCursor'
import { HomePage } from './pages/HomePage'
import { InspirationPage } from './pages/InspirationPage'
import { ShopPage } from './pages/ShopPage'
import { JournalPage } from './pages/JournalPage'
import { LookbooksPage } from './pages/LookbooksPage'
import { AboutPage } from './pages/AboutPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { LoginPage } from './pages/LoginPage'
import { OrdersPage } from './pages/OrdersPage'
import { PaymentStatusPage } from './pages/PaymentStatusPage'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminOverview } from './pages/admin/AdminOverview'
import { AdminProducts } from './pages/admin/AdminProducts'
import { AdminOrders } from './pages/admin/AdminOrders'
import { AdminUsers } from './pages/admin/AdminUsers'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    })
    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <>
      <CustomCursor />
      <Navigation />
      <ScrollToTop />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/inspiration" element={<InspirationPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrdersPage />} />
          <Route path="/payment/status" element={<PaymentStatusPage />} />
          <Route path="/admin" element={<AdminLayout><AdminOverview /></AdminLayout>} />
          <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
          <Route path="/admin/orders" element={<AdminLayout><AdminOrders /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/lookbooks" element={<LookbooksPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>

      <Footer />
    </>
  )
}

export default App
