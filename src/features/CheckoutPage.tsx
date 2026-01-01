import { useState, useEffect } from 'react'
import { useCartStore } from '../stores/cartStore'
import { useUserStore } from '../stores/userStore'
import { requestCheckout, getOrders, Order } from '../lib/api'

export const CheckoutPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const tableNumber = useCartStore((state) => state.tableNumber)
  const lineUserId = useUserStore((state) => state.lineUserId)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders(lineUserId || 'mock-user-id')
        // Filter only non-completed orders for this table
        setOrders(data.filter(o => o.tableNumber === tableNumber && o.status !== 'COMPLETED'))
      } catch {
        setOrders([])
      } finally {
        setFetchLoading(false)
      }
    }
    fetchOrders()
  }, [lineUserId, tableNumber])

  const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0)

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)

    try {
      await requestCheckout({
        tableNumber,
        lineUserId: lineUserId || 'mock-user-id',
      })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '精算依頼に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="w-20 h-20 bg-line-green rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">お会計を依頼しました</h1>
        <p className="text-gray-500 mb-4">
          スタッフがまもなく伺います。<br />
          レジにてお支払いください。
        </p>
        <div className="bg-gray-100 rounded-lg p-4 mb-8">
          <p className="text-sm text-gray-500">お支払い金額（税込）</p>
          <p className="text-3xl font-bold text-line-green">
            ¥{totalAmount.toLocaleString()}
          </p>
        </div>
      </div>
    )
  }

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-line-green"></div>
      </div>
    )
  }

  return (
    <div className="p-4 pb-20">
      <h2 className="font-bold text-lg mb-2">お会計</h2>
      <p className="text-gray-500 text-sm mb-6">
        テーブル {tableNumber}
      </p>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">ご注文がありません</p>
        </div>
      ) : (
        <>
          <div className="card mb-6">
            <h3 className="font-bold mb-3">ご注文内容</h3>
            <div className="space-y-2">
              {orders.flatMap((order) =>
                order.items.map((item, idx) => (
                  <div key={`${order.id}-${idx}`} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span>¥{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>合計（税込）</span>
                <span className="text-line-green">¥{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              お会計を依頼すると、スタッフがテーブルまで伺います。
              お支払いはレジにてお願いいたします。
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? '依頼中...' : 'お会計を依頼する'}
          </button>
        </>
      )}
    </div>
  )
}
