import { apiRequest } from './apiClient'

export async function getProducts() {
  const response = await apiRequest(
    '/api/Product/get-all-products'
  )

  return await response.json()
}

export async function getProductById(id) {
  const response = await apiRequest(
    `/api/Product/get-products-by-id/${id}`
  )

  return await response.json()
}