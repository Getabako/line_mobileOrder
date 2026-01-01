import { MenuItem } from '../../lib/api'
import { useCartStore } from '../../stores/cartStore'

interface MenuItemCardProps {
  item: MenuItem
}

export const MenuItemCard = ({ item }: MenuItemCardProps) => {
  const addItem = useCartStore((state) => state.addItem)
  const cartItems = useCartStore((state) => state.items)

  const cartItem = cartItems.find((i) => i.menuItemId === item.id)
  const quantityInCart = cartItem?.quantity || 0

  const handleAdd = () => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
    })
  }

  return (
    <div className="card flex gap-4">
      <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <span className="text-3xl">
            {item.category === 'ドリンク' ? '🍺' : '🍖'}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-base truncate">{item.name}</h3>
        {item.description && (
          <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
        )}
        <p className="font-bold text-line-green mt-1">
          ¥{item.price.toLocaleString()}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center">
        <button
          onClick={handleAdd}
          disabled={!item.available}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            item.available
              ? 'bg-line-green text-white active:bg-line-green-dark'
              : 'bg-gray-300 text-gray-500'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        {quantityInCart > 0 && (
          <span className="text-sm text-line-green font-bold mt-1">
            ×{quantityInCart}
          </span>
        )}
      </div>
    </div>
  )
}
