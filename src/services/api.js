import axios from 'axios'
import { getToken, getRefreshToken, setToken, clearAuth } from '../utils/storage'
import API_CONFIG from '../config/api.config'

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle 401 refresh
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      try {
        const refreshToken = getRefreshToken()

        const res = await axios.post(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN}`,
          { refreshToken }
        )

        setToken(res.data.accessToken)

        original.headers.Authorization = `Bearer ${res.data.accessToken}`

        return api(original)
      } catch {
        clearAuth()
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }

    return Promise.reject(error.response?.data || error)
  }
)

export default api