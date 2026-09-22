import { apiRequest } from './apiClient'

export async function getCart() {
  const response = await apiRequest('/api/Cart')

  return await response.json()
}

export async function addToCart(productId, quantity = 1) {
  const response = await apiRequest('/api/Cart/add', {
    method: 'POST',
    body: JSON.stringify({
      productId,
      quantity
    })
  })

  return await response.text()
}

export async function updateCartItem(productId, quantity) {
  const response = await apiRequest('/api/Cart/update', {
    method: 'PUT',
    body: JSON.stringify({
      productId,
      quantity
    })
  })

  return await response.text()
}

export async function removeCartItem(productId) {
  const response = await apiRequest(
    `/api/Cart/remove/${productId}`,
    {
      method: 'DELETE'
    }
  )

  return await response.text()
}

export async function clearCart() {
  const response = await apiRequest('/api/Cart/clear', {
    method: 'DELETE'
  })

  return await response.text()
}