const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://localhost:7048'

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && {
          Authorization: `Bearer ${token}`
        }),
        ...options.headers
      }
    }
  )

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Request failed')
  }

  return response
}