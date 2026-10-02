import type { ReactNode } from 'react'

type NavIconName = 'dashboard' | 'documents' | 'askAnswers' | 'claims' | 'approvals'

const glyphs: Record<NavIconName, () => ReactNode> = {
    dashboard: () => (
        <>
            <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
            <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
            <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
            <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
        </>
    ),
    documents: () => (
        <>
            <path d="M14 3.5H7.8A1.8 1.8 0 0 0 6 5.3v13.4A1.8 1.8 0 0 0 7.8 20.5h8.4a1.8 1.8 0 0 0 1.8-1.8V8.2L14 3.5z" />
            <path d="M14 3.5V8.2h4" />
            <path d="M9 12.5h6M9 16h4" />
        </>
    ),
    askAnswers: () => (
        <>
            <path d="M5 6.8A2.3 2.3 0 0 1 7.3 4.5h9.4A2.3 2.3 0 0 1 19 6.8v5.2a2.3 2.3 0 0 1-2.3 2.3H12l-3.2 2.7v-2.7H7.3A2.3 2.3 0 0 1 5 12V6.8z" />
            <path d="M8.5 8.8h7M8.5 11.6h4" />
        </>
    ),
    claims: () => (
        <>
            <rect x="6" y="3.5" width="12" height="17" rx="2" />
            <path d="M9 8.5h6M9 12.5h6M9 16.5h3.5" />
        </>
    ),
    approvals: () => (
        <>
            <circle cx="12" cy="12" r="8" />
            <path d="m8.6 12.2 2.3 2.3 4.5-4.8" />
        </>
    ),
}

const iconForPath = {
    '/dashboard': 'dashboard',
    '/documents': 'documents',
    '/ask-answers': 'askAnswers',
    '/claims': 'claims',
    '/approvals': 'approvals',
} as const

type NavIconProps = {
    to: keyof typeof iconForPath
}

export default function NavIcon({ to }: NavIconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ flexShrink: 0, display: 'block' }}
        >
            {glyphs[iconForPath[to]]()}
        </svg>
    )
}
