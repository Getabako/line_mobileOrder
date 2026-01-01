import { messagingApi } from '@line/bot-sdk'

const { MessagingApiClient } = messagingApi

export async function sendLineNotification(message: string): Promise<void> {
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
