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

const reasonLabels: Record<string, string> = {
  refill: 'おかわり',
  check: 'お会計',
  question: '質問・相談',
  other: 'その他',
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { tableNumber, lineUserId, reason } = req.body

    if (!tableNumber || !lineUserId || !reason) {
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

    // Create staff call record
    const staffCall = await prisma.staffCall.create({
      data: {
        tableNumber,
        userId: user.id,
        reason,
      },
    })

    // Send LINE notification
    const reasonLabel = reasonLabels[reason] || reason
    await sendLineNotification(
      `【店員呼び出し】\nテーブル: ${tableNumber}\n用件: ${reasonLabel}`
    )

    return res.status(201).json({ success: true, id: staffCall.id })
  } catch (error) {
    console.error('Error calling staff:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
