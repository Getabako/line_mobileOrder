import { Order } from '../../lib/api'

interface OrderCardProps {
  order: Order
}

const statusLabels: Record<string, string> = {
  PENDING: '注文受付',
  PREPARING: '調理中',
  SERVED: '提供済み',
  COMPLETED: '完了',
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PREPARING: 'bg-blue-100 text-blue-800',
  SERVED: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
          <p className="text-sm text-gray-500">テーブル {order.tableNumber}</p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold ${
            statusColors[order.status] || statusColors.PENDING
          }`}
        >
          {statusLabels[order.status] || order.status}
        </span>
      </div>

      <div className="border-t pt-3 space-y-2">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>¥{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="border-t mt-3 pt-3 flex justify-between font-bold">
        <span>合計</span>
        <span className="text-line-green">¥{order.totalAmount.toLocaleString()}</span>
      </div>
    </div>
  )
}
