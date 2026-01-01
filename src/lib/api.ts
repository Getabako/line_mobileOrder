const API_BASE = '/api'

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  headers?: Record<string, string>
}

export const api = async <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
  const { method = 'GET', body, headers = {} } = options

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Menu API
export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl?: string
  available: boolean
}

export const getMenu = () => api<MenuItem[]>('/menu')
export const getMenuItem = (id: string) => api<MenuItem>(`/menu/${id}`)

// Order API
export interface OrderItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  tableNumber: string
  items: OrderItem[]
  totalAmount: number
  status: string
  createdAt: string
}

export interface CreateOrderRequest {
  tableNumber: string
  lineUserId: string
  items: { menuItemId: string; quantity: number }[]
}

export const createOrder = (data: CreateOrderRequest) =>
  api<Order>('/orders', { method: 'POST', body: data })

export const getOrders = (lineUserId: string) =>
  api<Order[]>(`/orders?lineUserId=${lineUserId}`)

export const getOrder = (id: string) =>
  api<Order>(`/orders/${id}`)

// Staff Call API
export interface CallStaffRequest {
  tableNumber: string
  lineUserId: string
  reason: string
}

export const callStaff = (data: CallStaffRequest) =>
  api<{ success: boolean }>('/call-staff', { method: 'POST', body: data })

// Checkout API
export interface CheckoutRequest {
  tableNumber: string
  lineUserId: string
}

export const requestCheckout = (data: CheckoutRequest) =>
  api<{ success: boolean }>('/checkout', { method: 'POST', body: data })
