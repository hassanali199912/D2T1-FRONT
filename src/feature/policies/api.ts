import axios from 'axios'
import { api } from '../../config/axios/index.ts'
import type { CreatePolicyInput, Policy } from './types.ts'

export const policiesQueryKey = ['policies'] as const

export function listPolicies() {
    return api.get<Policy[]>('/policies')
}

export function createPolicy(input: CreatePolicyInput) {
    const form = new FormData()
    form.append('document', input.document)
    form.append('name', input.name)
    form.append('type', input.type)
    form.append('version', input.version)
    form.append('language', input.language)
    form.append('effectiveFrom', input.effectiveFrom)

    const description = input.description?.trim()
    if (description) form.append('description', description)
    if (input.effectiveTo) form.append('effectiveTo', input.effectiveTo)

    return api.postFormData<Policy>('/policies', form)
}

export function deletePolicy(id: string) {
    return api.delete<void>(`/policies/${id}`)
}

export function policyFileUrl(documentUrl: string) {
    if (/^https?:\/\//i.test(documentUrl)) return documentUrl
    const base = String(import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
    const path = documentUrl.startsWith('/') ? documentUrl : `/${documentUrl}`
    return `${base}${path}`
}

export function policyStillIndexing(policy: Policy) {
    return policy.status === 'UPLOADED' || policy.status === 'PROCESSING'
}

export function policyErrorMessage(error: unknown) {
    if (!axios.isAxiosError(error)) return ''
    const message = (error.response?.data as { message?: unknown } | undefined)?.message
    if (Array.isArray(message)) return message.filter((item) => typeof item === 'string').join('\n')
    if (typeof message === 'string') return message
    return ''
}
