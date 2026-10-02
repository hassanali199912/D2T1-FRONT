import type { Claim } from './types.ts'

export const initialClaims: Claim[] = [
    {
        id: 'clm-1',
        policyNumber: 'POL-10021',
        incidentDate: '2026-03-12',
        type: 'accident',
        amount: 4500,
        description: 'تصادم عند تقاطع الملك فهد',
        language: 'ar',
        status: 'draft',
    },
    {
        id: 'clm-2',
        policyNumber: 'POL-10088',
        incidentDate: '2026-02-28',
        type: 'medical',
        amount: 1250,
        description: 'Emergency clinic visit after a fall',
        language: 'en',
        status: 'running',
    },
    {
        id: 'clm-3',
        policyNumber: 'POL-10104',
        incidentDate: '2026-02-02',
        type: 'theft',
        amount: 8700,
        description: 'سرقة جهاز محمول من السيارة',
        language: 'ar',
        status: 'awaiting_approval',
    },
    {
        id: 'clm-4',
        policyNumber: 'POL-09811',
        incidentDate: '2026-01-15',
        type: 'fire',
        amount: 22000,
        description: 'Kitchen fire damaged the apartment',
        language: 'en',
        status: 'approved',
    },
    {
        id: 'clm-5',
        policyNumber: 'POL-09702',
        incidentDate: '2025-12-09',
        type: 'other',
        amount: 640,
        description: 'طلب خارج التغطية',
        language: 'ar',
        status: 'rejected',
    },
    {
        id: 'clm-6',
        policyNumber: 'POL-09640',
        incidentDate: '2025-11-21',
        type: 'accident',
        amount: 3100,
        description: 'Submission failed during review',
        language: 'en',
        status: 'failed',
    },
]

export function formatClaimDate(iso: string, language: string) {
    return new Intl.DateTimeFormat(language, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(iso))
}

export function formatClaimAmount(amount: number, language: string) {
    return new Intl.NumberFormat(language, {
        style: 'currency',
        currency: 'EGP',
        maximumFractionDigits: 0,
    }).format(amount)
}
