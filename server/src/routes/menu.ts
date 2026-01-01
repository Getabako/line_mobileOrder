import { Router } from 'express'
import { prisma } from '../index.js'

export const menuRouter = Router()

// Get all menu items
menuRouter.get('/', async (_req, res, next) => {
  try {
    const items = await prisma.menuItem.findMany({
      where: { available: true },
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    })
    res.json(items)
  } catch (error) {
    next(error)
  }
})

// Get menu item by ID
menuRouter.get('/:id', async (req, res, next) => {
  try {
    const item = await prisma.menuItem.findUnique({
      where: { id: req.params.id },
    })
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' })
    }
    res.json(item)
  } catch (error) {
    next(error)
  }
})
