import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../index.js'
import { sendLineNotification } from '../services/lineNotify.js'

export const checkoutRouter = Router()

const checkoutSchema = z.object({
  tableNumber: z.string().min(1),
  lineUserId: z.string().min(1),
})

checkoutRouter.post('/', async (req, res, next) => {
  try {
    const data = checkoutSchema.parse(req.body)

    // Get user
    const user = await prisma.user.findUnique({
      where: { lineUserId: data.lineUserId },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Get all orders for this table that are not completed
    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
        tableNumber: data.tableNumber,
        status: { not: 'COMPLETED' },
      },
      include: { items: true },
    })

    const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0)

    // Send LINE notification
    await sendLineNotification(
      `【お会計依頼】\nテーブル: ${data.tableNumber}\n合計金額: ¥${totalAmount.toLocaleString()}`
    )

    res.json({ success: true, totalAmount })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    next(error)
  }
})
