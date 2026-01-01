import { useState, useEffect } from 'react'
import { OrderCard } from '../components/order/OrderCard'
import { Loading } from '../components/common/Loading'
import { getOrders, Order } from '../lib/api'
import { useUserStore } from '../stores/userStore'

export const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const lineUserId = useUserStore((state) => state.lineUserId)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders(lineUserId || 'mock-user-id')
        setOrders(data)
      } catch {
        // Ignore errors, show empty state
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [lineUserId])

  if (loading) {
    return <Loading />
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-gray-500">注文履歴はありません</p>
      </div>
    )
  }

  return (
    <div className="p-4 pb-20">
      <h2 className="font-bold text-lg mb-4">注文履歴</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}
