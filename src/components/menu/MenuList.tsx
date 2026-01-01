import { MenuItem as MenuItemType } from '../../lib/api'
import { MenuItemCard } from './MenuItemCard'

interface MenuListProps {
  items: MenuItemType[]
  category: string
}

export const MenuList = ({ items, category }: MenuListProps) => {
  const filteredItems = category === 'all'
    ? items
    : items.filter((item) => item.category === category)

  if (filteredItems.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        メニューがありません
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {filteredItems.map((item) => (
        <MenuItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}
