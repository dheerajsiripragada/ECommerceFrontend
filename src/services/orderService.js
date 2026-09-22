import { apiRequest } from './apiClient'

export async function placeOrder() {
  const response = await apiRequest('/api/Order', {
    method: 'POST'
  })

  return await response.json()
}

export async function getMyOrders() {
  const response = await apiRequest('/api/Order/my-orders')

  return await response.json()
}