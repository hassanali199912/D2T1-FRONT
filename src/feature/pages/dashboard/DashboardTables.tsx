import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Box, Chip, CircularProgress, Stack, Typography } from '@mui/material'
import {
    approvalErrorMessage,
    approvalsQueryKey,
    isUnauthorizedReviewer,
    listApprovals,
} from '../../approvals/api.ts'
import { claimsQueryKey, claimErrorMessage, listClaims } from '../../claims/api.ts'
import { listPolicies, policiesQueryKey, policyErrorMessage } from '../../policies/api.ts'
import { formatClaimAmount, formatClaimDate } from '../claims/library.ts'
import { useTranslation } from '../../../language/index.ts'
import RecordsTable from './RecordsTable.tsx'

const DASHBOARD_LIMIT = 5

export default function DashboardTables() {
    const { t, i18n } = useTranslation()
    const language = i18n.resolvedLanguage ?? i18n.language

    const documents = useQuery({
        queryKey: policiesQueryKey,
        queryFn: listPolicies,
    })
    const claims = useQuery({
        queryKey: [...claimsQueryKey, 'dashboard', DASHBOARD_LIMIT],
        queryFn: () => listClaims(1, DASHBOARD_LIMIT),
    })
    const approvals = useQuery({
        queryKey: [...approvalsQueryKey, 'dashboard', DASHBOARD_LIMIT],
        queryFn: () => listApprovals(1, DASHBOARD_LIMIT),
        retry: (failureCount, error) => !isUnauthorizedReviewer(error) && failureCount < 1,
    })

    const documentRows = (documents.data ?? []).slice(0, DASHBOARD_LIMIT)
    const claimRows = claims.data?.items ?? []
    const approvalRows = approvals.data?.items ?? []
    const approvalsForbidden = approvals.isError && isUnauthorizedReviewer(approvals.error)

    return (
        <Stack spacing={2.5}>
            <SectionState
                loading={documents.isPending}
                error={documents.isError ? policyErrorMessage(documents.error) || t('documents.loadFailed') : ''}
            >
                <RecordsTable
                    title={t('dashboard.tables.documents')}
                    rows={documentRows}
                    columns={[
                        { header: t('dashboard.columns.name'), render: (row) => row.name },
                        { header: t('dashboard.columns.type'), render: (row) => t(`documents.types.${row.type}`) },
                        {
                            header: t('dashboard.columns.version'),
                            render: (row) => `${row.version} · ${t(`documents.languages.${row.language}`)}`,
                        },
                        {
                            header: t('dashboard.columns.status'),
                            render: (row) => (
                                <Chip size="small" color={policyStatusColor(row.status)} label={t(`documents.statuses.${row.status}`)} />
                            ),
                        },
                    ]}
                />
            </SectionState>

            <SectionState
                loading={claims.isPending}
                error={claims.isError ? claimErrorMessage(claims.error) || t('claims.loadFailed') : ''}
            >
                <RecordsTable
                    title={t('dashboard.tables.claims')}
                    rows={claimRows}
                    columns={[
                        { header: t('dashboard.columns.number'), render: (row) => row.claimNumber },
                        { header: t('dashboard.columns.type'), render: (row) => t(`claims.types.${row.claimType}`) },
                        {
                            header: t('dashboard.columns.amount'),
                            render: (row) => formatClaimAmount(row.claimedAmount, language),
                        },
                        {
                            header: t('dashboard.columns.submitted'),
                            render: (row) => formatClaimDate(row.incidentDate, language),
                        },
                        {
                            header: t('dashboard.columns.status'),
                            render: (row) => (
                                <Chip size="small" color={claimStatusColor(row.status)} label={t(`claims.statuses.${row.status}`)} />
                            ),
                        },
                    ]}
                />
            </SectionState>

            <SectionState
                loading={approvals.isPending}
                error={
                    approvalsForbidden
                        ? ''
                        : approvals.isError
                          ? approvalErrorMessage(approvals.error) || t('approvals.loadFailed')
                          : ''
                }
                note={approvalsForbidden ? t('approvals.unauthorized') : ''}
            >
                <RecordsTable
                    title={t('dashboard.tables.approvals')}
                    rows={approvalRows}
                    columns={[
                        { header: t('dashboard.columns.number'), render: (row) => row.claim.claimNumber },
                        { header: t('dashboard.columns.policy'), render: (row) => row.policy?.name ?? '—' },
                        {
                            header: t('dashboard.columns.decision'),
                            render: (row) =>
                                t(`claims.decisions.${row.originalRecommendation.decision}`, {
                                    defaultValue: row.originalRecommendation.decision,
                                }),
                        },
                        {
                            header: t('dashboard.columns.type'),
                            render: (row) => t(`claims.types.${row.claim.claimType}`),
                        },
                        {
                            header: t('dashboard.columns.submitted'),
                            render: (row) => formatClaimDate(row.createdAt.slice(0, 10), language),
                        },
                        {
                            header: t('dashboard.columns.status'),
                            render: (row) => (
                                <Chip
                                    size="small"
                                    color={approvalStatusColor(row.status)}
                                    label={t(`approvals.statuses.${row.status}`)}
                                />
                            ),
                        },
                    ]}
                />
            </SectionState>
        </Stack>
    )
}

function SectionState({
    loading,
    error,
    note,
    children,
}: {
    loading: boolean
    error: string
    note?: string
    children: ReactNode
}) {
    if (loading) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', py: 4 }}>
                <CircularProgress size={28} />
            </Box>
        )
    }
    return (
        <Stack spacing={1}>
            {note ? (
                <Typography variant="body2" color="text.secondary">
                    {note}
                </Typography>
            ) : null}
            {error ? (
                <Typography variant="body2" color="error">
                    {error}
                </Typography>
            ) : null}
            {children}
        </Stack>
    )
}

function policyStatusColor(status: string): 'info' | 'warning' | 'success' | 'error' | 'default' {
    if (status === 'INDEXED') return 'success'
    if (status === 'FAILED') return 'error'
    if (status === 'PROCESSING') return 'warning'
    if (status === 'UPLOADED') return 'info'
    return 'default'
}

function claimStatusColor(status: string): 'info' | 'warning' | 'success' | 'error' | 'default' {
    if (status === 'APPROVED') return 'success'
    if (status === 'REJECTED') return 'error'
    if (status === 'UNDER_REVIEW') return 'warning'
    if (status === 'SUBMITTED') return 'info'
    return 'default'
}

function approvalStatusColor(status: string): 'info' | 'warning' | 'success' | 'error' | 'default' {
    if (status === 'APPROVED' || status === 'EDITED_AND_APPROVED') return 'success'
    if (status === 'REJECTED') return 'error'
    if (status === 'PENDING') return 'warning'
    return 'default'
}
