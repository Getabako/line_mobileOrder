import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartItemCard } from '../components/cart/CartItem'
import { useCartStore } from '../stores/cartStore'
import { useUserStore } from '../stores/userStore'
import { createOrder } from '../lib/api'

export const CartPage = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const items = useCartStore((state) => state.items)
  const tableNumber = useCartStore((state) => state.tableNumber)
  const totalAmount = useCartStore((state) => state.getTotalAmount())
  const clearCart = useCartStore((state) => state.clearCart)
  const lineUserId = useUserStore((state) => state.lineUserId)

  const handleOrder = async () => {
    if (items.length === 0) return

    setLoading(true)
    setError(null)

    try {
      await createOrder({
        tableNumber,
        lineUserId: lineUserId || 'mock-user-id',
        items: items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
        })),
      })
      clearCart()
      navigate('/order-complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : '注文に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-gray-500 mb-4">カートは空です</p>
        <button onClick={() => navigate('/menu')} className="btn-primary">
          メニューを見る
        </button>
      </div>
    )
  }

  return (
    <div className="pb-32 p-4">
      <h2 className="font-bold text-lg mb-4">カート</h2>

      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <CartItemCard key={item.menuItemId} item={item} />
        ))}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Order summary */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-4 z-40">
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold">合計</span>
          <span className="font-bold text-xl text-line-green">
            ¥{totalAmount.toLocaleString()}
          </span>
        </div>
        <button
          onClick={handleOrder}
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50"
        >
          {loading ? '注文中...' : '注文を確定する'}
        </button>
      </div>
    </div>
  )
}
