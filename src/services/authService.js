import { apiRequest } from './apiClient'

export async function loginUser(email, password) {
  const response = await apiRequest('/api/User/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password
    })
  })

  return await response.json()
}
export async function registerUser(name, email, password) {
  const response = await apiRequest('/api/User/register', {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      password
    })
  })

  return await response.json()
}