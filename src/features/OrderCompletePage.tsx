import { useNavigate } from 'react-router-dom'

export const OrderCompletePage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="w-20 h-20 bg-line-green rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold mb-2">注文が完了しました</h1>
      <p className="text-gray-500 mb-8">
        調理が完了次第、お届けいたします。<br />
        しばらくお待ちください。
      </p>

      <div className="space-y-3 w-full max-w-xs">
        <button
          onClick={() => navigate('/menu')}
          className="w-full btn-primary"
        >
          追加注文する
        </button>
        <button
          onClick={() => navigate('/orders')}
          className="w-full btn-secondary"
        >
          注文履歴を見る
        </button>
      </div>
    </div>
  )
}
