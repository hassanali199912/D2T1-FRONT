import axios from 'axios'
import type { AuthResponse } from './types.ts'

const authHttp = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})

export async function loginRequest(email: string, password: string) {
    const { data } = await authHttp.post<AuthResponse>('/auth/login', { email, password })
    return data
}

export async function refreshRequest(refreshToken: string) {
    const { data } = await authHttp.post<AuthResponse>('/auth/refresh', { refreshToken })
    return data
}
