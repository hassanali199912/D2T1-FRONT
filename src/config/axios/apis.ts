import axios, { type InternalAxiosRequestConfig } from 'axios'
import { clearSession, readAccessToken, renewSession } from '../../feature/auth/session.ts'

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})

axiosInstance.interceptors.request.use((config) => {
    const token = readAccessToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
        if (!axios.isAxiosError(error)) return Promise.reject(error)

        const original = error.config as RetryConfig | undefined
        const isAuthCall = original?.url?.includes('/auth/login') || original?.url?.includes('/auth/refresh')
        if (error.response?.status !== 401 || !original || original._retry || isAuthCall) {
            return Promise.reject(error)
        }

        original._retry = true
        try {
            const response = await renewSession()
            original.headers.Authorization = `Bearer ${response.accessToken}`
            return axiosInstance(original)
        } catch (refreshError) {
            clearSession()
            if (!window.location.pathname.startsWith('/login')) window.location.assign('/login')
            return Promise.reject(refreshError)
        }
    },
)

export default axiosInstance
