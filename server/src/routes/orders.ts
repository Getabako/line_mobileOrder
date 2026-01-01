import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../index.js'
import { sendLineNotification } from '../services/lineNotify.js'
import { AppError } from '../middleware/errorHandler.js'

export const ordersRouter = Router()

const createOrderSchema = z.object({
  tableNumber: z.string().min(1),
  lineUserId: z.string().min(1),
  items: z.array(
    z.object({
      menuItemId: z.string(),
      quantity: z.number().min(1),
    })
  ).min(1),
})

// Create order
ordersRouter.post('/', async (req, res, next) => {
  try {
    const data = createOrderSchema.parse(req.body)

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { lineUserId: data.lineUserId },
    })

    if (!user) {
      user = await prisma.user.create({
        data: { lineUserId: data.lineUserId },
      })
    }

    // Get menu items
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: data.items.map((i) => i.menuItemId) },
      },
    })

    // Calculate total and prepare order items
    let totalAmount = 0
    const orderItems = data.items.map((item) => {
      const menuItem = menuItems.find((m) => m.id === item.menuItemId)
      if (!menuItem) {
        throw new AppError(400, `Menu item not found: ${item.menuItemId}`)
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
        tableNumber: data.tableNumber,
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
      .map((i) => `・${i.name} × ${i.quantity}`)
      .join('\n')

    await sendLineNotification(
      `【新規注文】\nテーブル: ${data.tableNumber}\n\n${itemsText}\n\n合計: ¥${totalAmount.toLocaleString()}`
    )

    res.status(201).json(order)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    next(error)
  }
})

// Get orders by user
ordersRouter.get('/', async (req, res, next) => {
  try {
    const lineUserId = req.query.lineUserId as string
    if (!lineUserId) {
      return res.status(400).json({ error: 'lineUserId is required' })
    }

    const user = await prisma.user.findUnique({
      where: { lineUserId },
    })

    if (!user) {
      return res.json([])
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    })

    res.json(orders)
  } catch (error) {
    next(error)
  }
})

// Get order by ID
ordersRouter.get('/:id', async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: true },
    })

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json(order)
  } catch (error) {
    next(error)
  }
})

// Update order status
ordersRouter.put('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: { items: true },
    })
    res.json(order)
  } catch (error) {
    next(error)
  }
})
