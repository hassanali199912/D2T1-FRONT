import { refreshRequest } from './api.ts'
import type { AuthResponse, AuthUser } from './types.ts'

const ACCESS = 'access_token'
const REFRESH = 'refresh_token'
const USER = 'auth_user'
const EXPIRES = 'access_expires_at'

export const AUTH_CHANGED = 'auth-changed'
const LEAD_MS = 60_000
const FALLBACK_LIFETIME_MS = 15 * 60 * 1000

let renewing: Promise<AuthResponse> | null = null

function notify() {
    window.dispatchEvent(new Event(AUTH_CHANGED))
}

export function tokenExpiresAt(token: string) {
    const part = token.split('.')[1]
    if (!part) return null
    try {
        const padded = part.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(part.length / 4) * 4, '=')
        const payload = JSON.parse(atob(padded)) as { exp?: number }
        return typeof payload.exp === 'number' ? payload.exp * 1000 : null
    } catch {
        return null
    }
}

export function readAccessToken() {
    return localStorage.getItem(ACCESS)
}

export function readRefreshToken() {
    return localStorage.getItem(REFRESH)
}

export function readExpiresAt() {
    const raw = localStorage.getItem(EXPIRES)
    const value = raw ? Number(raw) : NaN
    return Number.isFinite(value) ? value : null
}

export function readUser(): AuthUser | null {
    const raw = localStorage.getItem(USER)
    if (!raw) return null
    try {
        const user = JSON.parse(raw) as AuthUser
        return user.email ? user : null
    } catch {
        return null
    }
}

export function saveSession(response: AuthResponse, fallbackEmail?: string) {
    const user: AuthUser = response.user?.email
        ? response.user
        : { ...response.user, email: fallbackEmail ?? '' }
    const expiresAt = tokenExpiresAt(response.accessToken) ?? Date.now() + FALLBACK_LIFETIME_MS

    localStorage.setItem(ACCESS, response.accessToken)
    localStorage.setItem(REFRESH, response.refreshToken)
    localStorage.setItem(EXPIRES, String(expiresAt))
    localStorage.setItem(USER, JSON.stringify(user))
    notify()
}

export function clearSession() {
    localStorage.removeItem(ACCESS)
    localStorage.removeItem(REFRESH)
    localStorage.removeItem(EXPIRES)
    localStorage.removeItem(USER)
    sessionStorage.removeItem('session')
    notify()
}

export function msUntilRefresh(expiresAt: number) {
    const remaining = expiresAt - Date.now()
    if (remaining <= LEAD_MS) return Math.max(Math.floor(remaining / 2), 1000)
    return remaining - LEAD_MS
}

export function renewSession() {
    if (renewing) return renewing

    const refreshToken = readRefreshToken()
    if (!refreshToken) return Promise.reject(new Error('Missing refresh token'))

    renewing = refreshRequest(refreshToken)
        .then((response): AuthResponse => {
            if (!response?.accessToken || !response.refreshToken) {
                throw new Error('Refresh response is missing')
            }
            const expiresAt = tokenExpiresAt(response.accessToken)
            if (expiresAt !== null && expiresAt <= Date.now()) {
                throw new Error('Refreshed token is already expired')
            }
            saveSession(response, readUser()?.email)
            return response
        })
        .finally(() => {
            renewing = null
        })

    return renewing
}
