import { Stack } from '@mui/material'
import { useTranslation } from '../../../language/index.ts'
import RecordsTable, { StatusChip } from './RecordsTable.tsx'
import { approvals, claims, documents, formatAmount, formatDate } from './records.ts'

export default function DashboardTables() {
    const { t, i18n } = useTranslation()
    const language = i18n.resolvedLanguage ?? i18n.language

    return (
        <Stack spacing={2.5}>
            <RecordsTable
                title={t('dashboard.tables.documents')}
                rows={documents}
                columns={[
                    { header: t('dashboard.columns.name'), render: (row) => t(row.nameKey) },
                    { header: t('dashboard.columns.type'), render: (row) => row.type },
                    { header: t('dashboard.columns.updated'), render: (row) => formatDate(row.updated, language) },
                    { header: t('dashboard.columns.status'), render: (row) => <StatusChip status={row.status} /> },
                ]}
            />
            <RecordsTable
                title={t('dashboard.tables.claims')}
                rows={claims}
                columns={[
                    { header: t('dashboard.columns.number'), render: (row) => row.number },
                    { header: t('dashboard.columns.subject'), render: (row) => t(row.titleKey) },
                    { header: t('dashboard.columns.amount'), render: (row) => formatAmount(row.amount, language) },
                    { header: t('dashboard.columns.submitted'), render: (row) => formatDate(row.submitted, language) },
                    { header: t('dashboard.columns.status'), render: (row) => <StatusChip status={row.status} /> },
                ]}
            />
            <RecordsTable
                title={t('dashboard.tables.approvals')}
                rows={approvals}
                columns={[
                    { header: t('dashboard.columns.request'), render: (row) => t(row.requestKey) },
                    { header: t('dashboard.columns.requester'), render: (row) => t(row.requesterKey) },
                    { header: t('dashboard.columns.type'), render: (row) => t(row.typeKey) },
                    { header: t('dashboard.columns.submitted'), render: (row) => formatDate(row.submitted, language) },
                    { header: t('dashboard.columns.status'), render: (row) => <StatusChip status={row.status} /> },
                ]}
            />
        </Stack>
    )
}
