import axios from 'axios'
import { api } from '../../config/axios/index.ts'
import type { RetrievalResponse } from './types.ts'

export function retrieve(query: string) {
    return api.post<RetrievalResponse>('/rag/retrieve', {
        query,
        topK: 5,
        language: 'AUTO',
    })
}

export function retrievalErrorMessage(error: unknown) {
    if (!axios.isAxiosError(error)) return ''
    const message = (error.response?.data as { message?: unknown } | undefined)?.message
    if (Array.isArray(message)) return message.filter((item) => typeof item === 'string').join('\n')
    if (typeof message === 'string') return message
    return ''
}
