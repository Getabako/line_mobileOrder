const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN
const LINE_ADMIN_USER_ID = process.env.LINE_ADMIN_USER_ID

export async function sendLineNotification(message: string): Promise<void> {
  if (!LINE_CHANNEL_ACCESS_TOKEN || !LINE_ADMIN_USER_ID) {
    console.log('[LINE Notification Mock]', message)
    return
  }

  try {
    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        to: LINE_ADMIN_USER_ID,
        messages: [
          {
            type: 'text',
            text: message,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('LINE notification error:', error)
    }
  } catch (error) {
    console.error('Failed to send LINE notification:', error)
  }
}
