import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Header } from './components/common/Header'
import { BottomNav } from './components/common/BottomNav'
import { Loading } from './components/common/Loading'
import { TablePage } from './features/TablePage'
import { MenuPage } from './features/MenuPage'
import { CartPage } from './features/CartPage'
import { OrderCompletePage } from './features/OrderCompletePage'
import { OrdersPage } from './features/OrdersPage'
import { CallStaffPage } from './features/CallStaffPage'
import { CheckoutPage } from './features/CheckoutPage'
import { initLiff, getLiffUser } from './lib/liff'
import { useUserStore } from './stores/userStore'
import { useCartStore } from './stores/cartStore'

const AppContent = () => {
  const location = useLocation()
  const tableNumber = useCartStore((state) => state.tableNumber)
  const showNav = tableNumber && location.pathname !== '/' && location.pathname !== '/order-complete'

  return (
    <div className="min-h-screen bg-gray-50">
      {showNav && <Header />}
      <main className={showNav ? 'pt-14 pb-16' : ''}>
        <Routes>
          <Route path="/" element={<TablePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-complete" element={<OrderCompletePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/call-staff" element={<CallStaffPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </main>
      {showNav && <BottomNav />}
    </div>
  )
}

function App() {
  const [loading, setLoading] = useState(true)
  const setUser = useUserStore((state) => state.setUser)

  useEffect(() => {
    const init = async () => {
      try {
        await initLiff()
        const user = await getLiffUser()
        setUser(user)
      } catch (error) {
        console.error('Initialization error:', error)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [setUser])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
