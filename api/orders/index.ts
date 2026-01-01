import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../../lib/prisma'
import { sendLineNotification } from '../../lib/lineNotify'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const lineUserId = req.query.lineUserId as string
      if (!lineUserId) {
        return res.status(400).json({ error: 'lineUserId is required' })
      }

      const user = await prisma.user.findUnique({
        where: { lineUserId },
      })

      if (!user) {
        return res.status(200).json([])
      }

      const orders = await prisma.order.findMany({
        where: { userId: user.id },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      })

      return res.status(200).json(orders)
    } catch (error) {
      console.error('Error fetching orders:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { tableNumber, lineUserId, items } = req.body

      if (!tableNumber || !lineUserId || !items || items.length === 0) {
        return res.status(400).json({ error: 'Invalid request body' })
      }

      // Get or create user
      let user = await prisma.user.findUnique({
        where: { lineUserId },
      })

      if (!user) {
        user = await prisma.user.create({
          data: { lineUserId },
        })
      }

      // Get menu items
      const menuItems = await prisma.menuItem.findMany({
        where: {
          id: { in: items.map((i: { menuItemId: string }) => i.menuItemId) },
        },
      })

      // Calculate total and prepare order items
      let totalAmount = 0
      const orderItems = items.map((item: { menuItemId: string; quantity: number }) => {
        const menuItem = menuItems.find((m) => m.id === item.menuItemId)
        if (!menuItem) {
          throw new Error(`Menu item not found: ${item.menuItemId}`)
        }
        totalAmount += menuItem.price * item.quantity
        return {
          menuItemId: item.menuItemId,
          name: menuItem.name,
          price: menuItem.price,
          quantity: item.quantity,
        }
      })

      // Create order
      const order = await prisma.order.create({
        data: {
          tableNumber,
          userId: user.id,
          totalAmount,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: true,
        },
      })

      // Send LINE notification
      const itemsText = orderItems
        .map((i: { name: string; quantity: number }) => `・${i.name} × ${i.quantity}`)
        .join('\n')

      await sendLineNotification(
        `【新規注文】\nテーブル: ${tableNumber}\n\n${itemsText}\n\n合計: ¥${totalAmount.toLocaleString()}`
      )

      return res.status(201).json(order)
    } catch (error) {
      console.error('Error creating order:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
