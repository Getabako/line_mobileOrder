import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { PrismaClient } from '@prisma/client'
import { menuRouter } from './routes/menu.js'
import { ordersRouter } from './routes/orders.js'
import { callStaffRouter } from './routes/callStaff.js'
import { checkoutRouter } from './routes/checkout.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()
const PORT = process.env.PORT || 3001

export const prisma = new PrismaClient()

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/menu', menuRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/call-staff', callStaffRouter)
app.use('/api/checkout', checkoutRouter)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// Error handler
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  process.exit(0)
})
