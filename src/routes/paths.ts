export const paths = {
    dashboard: '/dashboard',
    documents: '/documents',
    askAnswers: '/ask-answers',
    claims: '/claims',
    claimNew: '/claims/new',
    approvals: '/approvals',
    login: '/login',
} as const

export function approvalReviewPath(id: string) {
    return `${paths.approvals}/${id}`
}

export const navItems = [
    { to: paths.dashboard, labelKey: 'nav.dashboard' },
    { to: paths.documents, labelKey: 'nav.documents' },
    { to: paths.askAnswers, labelKey: 'nav.askAnswers' },
    { to: paths.claims, labelKey: 'nav.claims' },
    { to: paths.approvals, labelKey: 'nav.approvals' },
] as const
