import axios from 'axios'
import { api } from '../../config/axios/index.ts'
import type { ClaimAnalysis, ClaimList, ClaimTypeOption, ClaimView, CreateClaimInput } from './types.ts'

export const claimsQueryKey = ['claims'] as const
export const claimTypesQueryKey = ['claims', 'types'] as const
export const CLAIMS_PAGE_SIZE = 20

export function listClaimTypes() {
    return api.get<ClaimTypeOption[]>('/claims/types')
}

export function listClaims(page: number, limit = CLAIMS_PAGE_SIZE) {
    return api.get<ClaimList>('/claims', { params: { page, limit } })
}

export function createClaim(input: CreateClaimInput) {
    return api.post<ClaimView>('/claims', input)
}

export function analyzeClaim(id: string) {
    return api.post<ClaimAnalysis>(`/claims/${id}/analyze`)
}

export function claimErrorMessage(error: unknown) {
    if (!axios.isAxiosError(error)) return ''
    const message = (error.response?.data as { message?: unknown } | undefined)?.message
    if (Array.isArray(message)) return message.filter((item) => typeof item === 'string').join('\n')
    if (typeof message === 'string') return message
    return ''
}
