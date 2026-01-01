import { useState } from 'react'
import { useCartStore } from '../stores/cartStore'
import { useUserStore } from '../stores/userStore'
import { callStaff } from '../lib/api'

const reasons = [
  { id: 'refill', label: 'おかわり', icon: '🍺' },
  { id: 'check', label: 'お会計', icon: '💰' },
  { id: 'question', label: '質問・相談', icon: '❓' },
  { id: 'other', label: 'その他', icon: '🙋' },
]

export const CallStaffPage = () => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const tableNumber = useCartStore((state) => state.tableNumber)
  const lineUserId = useUserStore((state) => state.lineUserId)

  const handleCall = async () => {
    if (!selectedReason) return

    setLoading(true)
    setError(null)

    try {
      await callStaff({
        tableNumber,
        lineUserId: lineUserId || 'mock-user-id',
        reason: selectedReason,
      })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '呼び出しに失敗しました')
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
        <h1 className="text-2xl font-bold mb-2">店員を呼び出しました</h1>
        <p className="text-gray-500 mb-8">
          スタッフがまもなく参ります。<br />
          しばらくお待ちください。
        </p>
        <button
          onClick={() => {
            setSuccess(false)
            setSelectedReason(null)
          }}
          className="btn-secondary"
        >
          戻る
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 pb-20">
      <h2 className="font-bold text-lg mb-2">店員呼び出し</h2>
      <p className="text-gray-500 text-sm mb-6">
        ご用件を選択してください
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {reasons.map((reason) => (
          <button
            key={reason.id}
            onClick={() => setSelectedReason(reason.id)}
            className={`card flex flex-col items-center py-6 ${
              selectedReason === reason.id
                ? 'ring-2 ring-line-green'
                : ''
            }`}
          >
            <span className="text-4xl mb-2">{reason.icon}</span>
            <span className="font-bold">{reason.label}</span>
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <button
        onClick={handleCall}
        disabled={!selectedReason || loading}
        className="w-full btn-primary disabled:opacity-50"
      >
        {loading ? '呼び出し中...' : '店員を呼ぶ'}
      </button>
    </div>
  )
}
