import { apiRequest } from './apiClient'

export async function getCategories() {
  const response = await apiRequest(
    '/api/Category/get-all-categories'
  )

  return await response.json()
}