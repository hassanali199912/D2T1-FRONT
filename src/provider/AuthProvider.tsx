import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { loginRequest } from '../feature/auth/api.ts'
import {
    AUTH_CHANGED,
    clearSession,
    msUntilRefresh,
    readExpiresAt,
    readUser,
    renewSession,
    saveSession,
} from '../feature/auth/session.ts'
import type { AuthUser } from '../feature/auth/types.ts'
import { queryClient } from '../config/queryBase/queryClient.ts'

type AuthContextValue = {
    user: AuthUser | null
    login: (email: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(() => readUser())
    const timer = useRef<number | null>(null)

    useEffect(() => {
        function arm() {
            if (timer.current !== null) window.clearTimeout(timer.current)
            const nextUser = readUser()
            const expiresAt = readExpiresAt()
            setUser(nextUser)
            if (!nextUser || !expiresAt) return

            if (expiresAt <= Date.now()) {
                void renewSession().catch(() => clearSession())
                return
            }

            timer.current = window.setTimeout(() => {
                void renewSession().catch(() => clearSession())
            }, msUntilRefresh(expiresAt))
        }

        arm()
        window.addEventListener(AUTH_CHANGED, arm)
        return () => {
            window.removeEventListener(AUTH_CHANGED, arm)
            if (timer.current !== null) window.clearTimeout(timer.current)
        }
    }, [])

    async function login(email: string, password: string) {
        const response = await loginRequest(email, password)
        saveSession(response, email)
    }

    function logout() {
        clearSession()
        queryClient.clear()
    }

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
