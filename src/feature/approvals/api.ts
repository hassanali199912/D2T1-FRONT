import axios from 'axios'
import { api } from '../../config/axios/index.ts'
import type { ApprovalList, ApprovalView, EditApprovalInput, RejectApprovalInput } from './types.ts'

export const approvalsQueryKey = ['approvals'] as const
export const APPROVALS_PAGE_SIZE = 20

export function listApprovals(page: number, limit = APPROVALS_PAGE_SIZE) {
    return api.get<ApprovalList>('/approvals', { params: { page, limit } })
}

export function getApproval(id: string) {
    return api.get<ApprovalView>(`/approvals/${id}`)
}

export function approveApproval(id: string) {
    return api.post<ApprovalView>(`/approvals/${id}/approve`)
}

export function rejectApproval(id: string, input: RejectApprovalInput) {
    return api.post<ApprovalView>(`/approvals/${id}/reject`, input)
}

export function editAndApprove(id: string, input: EditApprovalInput) {
    return api.post<ApprovalView>(`/approvals/${id}/edit-and-approve`, input)
}

export function approvalErrorMessage(error: unknown) {
    if (!axios.isAxiosError(error)) return ''
    const message = (error.response?.data as { message?: unknown } | undefined)?.message
    if (Array.isArray(message)) return message.filter((item) => typeof item === 'string').join('\n')
    if (typeof message === 'string') return message
    return ''
}

export function isUnauthorizedReviewer(error: unknown) {
    if (!axios.isAxiosError(error)) return false
    if (error.response?.status === 403) return true
    return approvalErrorMessage(error) === 'UNAUTHORIZED_REVIEWER'
}
