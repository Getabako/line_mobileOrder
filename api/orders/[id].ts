import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_lib/prisma'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid order ID' })
  }

  if (req.method === 'GET') {
    try {
      const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true },
      })

      if (!order) {
        return res.status(404).json({ error: 'Order not found' })
      }

      return res.status(200).json(order)
    } catch (error) {
      console.error('Error fetching order:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'PUT') {
    try {
      const { status } = req.body
      const order = await prisma.order.update({
        where: { id },
        data: { status },
        include: { items: true },
      })
      return res.status(200).json(order)
    } catch (error) {
      console.error('Error updating order:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
