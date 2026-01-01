import { CartItem as CartItemType, useCartStore } from '../../stores/cartStore'

interface CartItemProps {
  item: CartItemType
}

export const CartItemCard = ({ item }: CartItemProps) => {
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)

  return (
    <div className="card flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <h3 className="font-bold truncate">{item.name}</h3>
        <p className="text-line-green font-bold">
          ¥{item.price.toLocaleString()}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center active:bg-gray-300"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        <span className="w-8 text-center font-bold">{item.quantity}</span>

        <button
          onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
          className="w-8 h-8 rounded-full bg-line-green text-white flex items-center justify-center active:bg-line-green-dark"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <button
        onClick={() => removeItem(item.menuItemId)}
        className="p-2 text-red-500"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}
