import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const menuItems = [
  {
    name: '生ビール',
    description: 'キンキンに冷えた生ビール',
    price: 550,
    category: 'ドリンク',
    sortOrder: 1,
  },
  {
    name: 'ハイボール',
    description: 'スッキリ爽やかなハイボール',
    price: 450,
    category: 'ドリンク',
    sortOrder: 2,
  },
  {
    name: 'ウーロン茶',
    description: '',
    price: 300,
    category: 'ドリンク',
    sortOrder: 3,
  },
  {
    name: '唐揚げ',
    description: '秘伝のタレで漬け込んだジューシーな唐揚げ',
    price: 580,
    category: 'フード',
    sortOrder: 1,
  },
  {
    name: '枝豆',
    description: '塩茹でした枝豆',
    price: 380,
    category: 'フード',
    sortOrder: 2,
  },
  {
    name: 'ポテトフライ',
    description: 'カリカリのポテトフライ',
    price: 420,
    category: 'フード',
    sortOrder: 3,
  },
]

async function main() {
  console.log('Seeding database...')

  // Delete existing menu items
  await prisma.menuItem.deleteMany()

  // Create menu items
  for (const item of menuItems) {
    await prisma.menuItem.create({
      data: item,
    })
  }

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
