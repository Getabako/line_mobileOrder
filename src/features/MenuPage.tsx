import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MenuList } from '../components/menu/MenuList'
import { Loading } from '../components/common/Loading'
import { getMenu, MenuItem } from '../lib/api'
import { useCartStore } from '../stores/cartStore'

// Mock data for development
const mockMenuItems: MenuItem[] = [
  { id: '1', name: '生ビール', description: 'キンキンに冷えた生ビール', price: 550, category: 'ドリンク', available: true },
  { id: '2', name: 'ハイボール', description: 'スッキリ爽やかなハイボール', price: 450, category: 'ドリンク', available: true },
  { id: '3', name: 'ウーロン茶', description: '', price: 300, category: 'ドリンク', available: true },
  { id: '4', name: '唐揚げ', description: '秘伝のタレで漬け込んだジューシーな唐揚げ', price: 580, category: 'フード', available: true },
  { id: '5', name: '枝豆', description: '塩茹でした枝豆', price: 380, category: 'フード', available: true },
  { id: '6', name: 'ポテトフライ', description: 'カリカリのポテトフライ', price: 420, category: 'フード', available: true },
]

const categories = [
  { id: 'all', name: 'すべて' },
  { id: 'ドリンク', name: 'ドリンク' },
  { id: 'フード', name: 'フード' },
]

export const MenuPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const tableNumber = useCartStore((state) => state.tableNumber)
  const totalItems = useCartStore((state) => state.getTotalItems())
  const totalAmount = useCartStore((state) => state.getTotalAmount())

  useEffect(() => {
    if (!tableNumber) {
      navigate('/')
      return
    }

    const fetchMenu = async () => {
      try {
        const data = await getMenu()
        setMenuItems(data)
      } catch {
        // Use mock data if API fails
        setMenuItems(mockMenuItems)
      } finally {
        setLoading(false)
      }
    }
    fetchMenu()
  }, [tableNumber, navigate])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="pb-32">
      {/* Category tabs */}
      <div className="sticky top-14 bg-white z-40 px-4 py-3 border-b">
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-line-green text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu list */}
      <div className="p-4">
        <MenuList items={menuItems} category={selectedCategory} />
      </div>

      {/* Cart summary bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-4 z-40">
          <button
            onClick={() => navigate('/cart')}
            className="w-full btn-primary flex items-center justify-between"
          >
            <span className="bg-white text-line-green rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              {totalItems}
            </span>
            <span>カートを見る</span>
            <span>¥{totalAmount.toLocaleString()}</span>
          </button>
        </div>
      )}
    </div>
  )
}
