export type AuthUser = {
    id?: string | number
    email: string
    name?: string
    role?: string
}

export type AuthResponse = {
    accessToken: string
    refreshToken: string
    user?: AuthUser
}
