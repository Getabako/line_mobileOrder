import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../index.js'
import { sendLineNotification } from '../services/lineNotify.js'

export const callStaffRouter = Router()

const callStaffSchema = z.object({
  tableNumber: z.string().min(1),
  lineUserId: z.string().min(1),
  reason: z.string().min(1),
})

const reasonLabels: Record<string, string> = {
  refill: 'おかわり',
  check: 'お会計',
  question: '質問・相談',
  other: 'その他',
}

callStaffRouter.post('/', async (req, res, next) => {
  try {
    const data = callStaffSchema.parse(req.body)

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { lineUserId: data.lineUserId },
    })

    if (!user) {
      user = await prisma.user.create({
        data: { lineUserId: data.lineUserId },
      })
    }

    // Create staff call record
    const staffCall = await prisma.staffCall.create({
      data: {
        tableNumber: data.tableNumber,
        userId: user.id,
        reason: data.reason,
      },
    })

    // Send LINE notification
    const reasonLabel = reasonLabels[data.reason] || data.reason
    await sendLineNotification(
      `【店員呼び出し】\nテーブル: ${data.tableNumber}\n用件: ${reasonLabel}`
    )

    res.status(201).json({ success: true, id: staffCall.id })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    next(error)
  }
})
