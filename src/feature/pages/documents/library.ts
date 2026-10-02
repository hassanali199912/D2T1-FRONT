import type { LibraryDocument } from './types.ts'

export const initialDocuments: LibraryDocument[] = [
    { id: 'doc-1', name: 'سياسة الإجازات', policyDate: '2026-01-12', type: 'ar', status: 'indexed' },
    { id: 'doc-2', name: 'Travel form', policyDate: '2026-02-03', type: 'en', status: 'pending' },
    { id: 'doc-3', name: 'دليل الموظف', policyDate: '2025-11-20', type: 'ar', status: 'error' },
]

export function formatPolicyDate(iso: string, language: string) {
    return new Intl.DateTimeFormat(language, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(iso))
}

export function isDocxFile(file: File) {
    return file.name.toLowerCase().endsWith('.docx')
}

export function nameFromDocx(file: File) {
    return file.name.replace(/\.docx$/i, '')
}
