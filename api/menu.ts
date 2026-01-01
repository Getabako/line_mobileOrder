import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from './_lib/prisma'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const items = await prisma.menuItem.findMany({
        where: { available: true },
        orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
      })
      return res.status(200).json(items)
    } catch (error) {
      console.error('Error fetching menu:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
