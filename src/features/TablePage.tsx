import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../stores/cartStore'

export const TablePage = () => {
  const [tableNumber, setTableNumber] = useState('')
  const setStoreTableNumber = useCartStore((state) => state.setTableNumber)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tableNumber.trim()) {
      setStoreTableNumber(tableNumber.trim())
      navigate('/menu')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Food Order</h1>
          <p className="text-gray-500">モバイルオーダー</p>
        </div>

        <form onSubmit={handleSubmit} className="card">
          <label className="block text-sm font-bold mb-2">
            テーブル番号を入力してください
          </label>
          <input
            type="text"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="例: 1, A-1, 2F-3"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg mb-4 focus:outline-none focus:ring-2 focus:ring-line-green"
            autoFocus
          />
          <button
            type="submit"
            disabled={!tableNumber.trim()}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            注文を始める
          </button>
        </form>
      </div>
    </div>
  )
}
