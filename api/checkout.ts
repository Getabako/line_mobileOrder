import type { VercelRequest, VercelResponse } from '@vercel/node'
import { PrismaClient } from '@prisma/client'
import { messagingApi } from '@line/bot-sdk'

const prisma = new PrismaClient()
const { MessagingApiClient } = messagingApi

async function sendLineNotification(message: string): Promise<void> {
  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN
  const adminUserId = process.env.LINE_ADMIN_USER_ID

  if (!channelAccessToken || !adminUserId) {
    console.log('LINE notification skipped: credentials not configured')
    return
  }

  try {
    const client = new MessagingApiClient({ channelAccessToken })
    await client.pushMessage({
      to: adminUserId,
      messages: [{ type: 'text', text: message }],
    })
  } catch (error) {
    console.error('Failed to send LINE notification:', error)
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { tableNumber, lineUserId } = req.body

    if (!tableNumber || !lineUserId) {
      return res.status(400).json({ error: 'Invalid request body' })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { lineUserId },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Get all orders for this table that are not completed
    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
        tableNumber,
        status: { not: 'COMPLETED' },
      },
      include: { items: true },
    })

    const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0)

    // Send LINE notification
    await sendLineNotification(
      `【お会計依頼】\nテーブル: ${tableNumber}\n合計金額: ¥${totalAmount.toLocaleString()}`
    )

    return res.status(200).json({ success: true, totalAmount })
  } catch (error) {
    console.error('Error requesting checkout:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
