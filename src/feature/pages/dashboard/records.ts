export const statuses = ['published', 'draft', 'review', 'approved', 'rejected', 'pending', 'needsInfo'] as const

export type Status = (typeof statuses)[number]

export const documents = [
    { id: 'doc-1', nameKey: 'dashboard.docs.leave', type: 'PDF', updated: '2026-03-12', status: 'published' },
    { id: 'doc-2', nameKey: 'dashboard.docs.travel', type: 'DOCX', updated: '2026-02-02', status: 'draft' },
    { id: 'doc-3', nameKey: 'dashboard.docs.identity', type: 'PDF', updated: '2026-01-20', status: 'published' },
] as const

export const claims = [
    { id: 'clm-1', number: 'CLM-1042', titleKey: 'dashboard.claims.medical', amount: 1250, submitted: '2026-03-18', status: 'review' },
    { id: 'clm-2', number: 'CLM-0988', titleKey: 'dashboard.claims.travel', amount: 640, submitted: '2026-02-04', status: 'approved' },
    { id: 'clm-3', number: 'CLM-0901', titleKey: 'dashboard.claims.equipment', amount: 3200, submitted: '2026-01-11', status: 'rejected' },
] as const

export const approvals = [
    { id: 'apr-1', requestKey: 'dashboard.approvals.leave', requesterKey: 'dashboard.people.sara', typeKey: 'dashboard.types.leave', submitted: '2026-03-21', status: 'pending' },
    { id: 'apr-2', requestKey: 'dashboard.approvals.purchase', requesterKey: 'dashboard.people.omar', typeKey: 'dashboard.types.purchase', submitted: '2026-03-19', status: 'pending' },
    { id: 'apr-3', requestKey: 'dashboard.approvals.overtime', requesterKey: 'dashboard.people.lina', typeKey: 'dashboard.types.time', submitted: '2026-03-15', status: 'needsInfo' },
] as const

export function formatDate(iso: string, language: string) {
    return new Intl.DateTimeFormat(language, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(iso))
}

export function formatAmount(amount: number, language: string) {
    return new Intl.NumberFormat(language, {
        style: 'currency',
        currency: 'EGP',
        maximumFractionDigits: 0,
    }).format(amount)
}
