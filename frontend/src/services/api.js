import axios from 'axios'
import { supabase } from '../lib/supabase.js'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
})

// Attach access token to every request
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

// Normalise error responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error) || error.code === 'ERR_CANCELED') {
      return Promise.reject(error)
    }
    const responseMessage =
      error.response?.data?.error ||
      error.response?.data?.message
    const message = typeof responseMessage === 'string'
      ? responseMessage
      : error.response?.status === 404
        ? 'Endpoint API tidak ditemukan (404). Periksa URL backend atau routing Vercel.'
        : error.message || 'Terjadi kesalahan. Coba lagi.'
    return Promise.reject(new Error(message))
  }
)

export default api
