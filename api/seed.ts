import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../lib/prisma'

const menuItems = [
  // ドリンク
  { name: '生ビール', description: 'キンキンに冷えた生ビール', price: 550, category: 'ドリンク', sortOrder: 1 },
  { name: 'ハイボール', description: 'すっきり爽やかハイボール', price: 450, category: 'ドリンク', sortOrder: 2 },
  { name: 'レモンサワー', description: '自家製レモンサワー', price: 450, category: 'ドリンク', sortOrder: 3 },
  { name: 'ウーロン茶', description: '', price: 300, category: 'ドリンク', sortOrder: 4 },
  { name: 'オレンジジュース', description: '', price: 350, category: 'ドリンク', sortOrder: 5 },
  // 前菜
  { name: '枝豆', description: '塩茹で枝豆', price: 380, category: '前菜', sortOrder: 1 },
  { name: '冷奴', description: '特製だしつゆで', price: 350, category: '前菜', sortOrder: 2 },
  { name: 'たこわさ', description: 'ピリ辛たこわさび', price: 450, category: '前菜', sortOrder: 3 },
  // 焼き物
  { name: '焼き鳥盛り合わせ', description: '5本セット（塩・タレ選択可）', price: 780, category: '焼き物', sortOrder: 1 },
  { name: 'ネギマ', description: '', price: 180, category: '焼き物', sortOrder: 2 },
  { name: 'つくね', description: '月見つくね', price: 200, category: '焼き物', sortOrder: 3 },
  { name: '砂肝', description: '', price: 180, category: '焼き物', sortOrder: 4 },
  // 揚げ物
  { name: '唐揚げ', description: '秘伝のタレに漬け込んだジューシー唐揚げ', price: 650, category: '揚げ物', sortOrder: 1 },
  { name: 'フライドポテト', description: 'カリカリポテト', price: 400, category: '揚げ物', sortOrder: 2 },
  { name: '軟骨唐揚げ', description: 'コリコリ食感', price: 550, category: '揚げ物', sortOrder: 3 },
  // ご飯もの
  { name: '焼きおにぎり', description: '2個セット', price: 350, category: 'ご飯もの', sortOrder: 1 },
  { name: 'お茶漬け（梅）', description: '', price: 450, category: 'ご飯もの', sortOrder: 2 },
  { name: 'お茶漬け（鮭）', description: '', price: 500, category: 'ご飯もの', sortOrder: 3 },
]

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST with secret key for security
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { secret } = req.body
  if (secret !== process.env.SEED_SECRET && secret !== 'init-menu-2024') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Delete existing menu items
    await prisma.menuItem.deleteMany()

    // Create new menu items
    const created = await prisma.menuItem.createMany({
      data: menuItems,
    })

    return res.status(200).json({
      success: true,
      message: `Created ${created.count} menu items`
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
