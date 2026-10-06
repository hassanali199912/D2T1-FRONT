import { Button, Chip, Link, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useTranslation } from '../../../language/index.ts'
import { policyFileUrl } from '../../policies/api.ts'
import type { Policy, PolicyStage, PolicyStatus } from '../../policies/types.ts'
import { formatPolicyDate } from './library.ts'

const statusColor: Record<PolicyStatus, 'info' | 'warning' | 'success' | 'error'> = {
    UPLOADED: 'info',
    PROCESSING: 'warning',
    INDEXED: 'success',
    FAILED: 'error',
}

type DocumentsTableProps = {
    rows: readonly Policy[]
    deletingId: string | null
    onDelete: (id: string) => void
}

const headerCellSx = {
    fontWeight: 700,
    color: 'text.secondary',
    bgcolor: 'background.default',
    whiteSpace: 'nowrap',
} as const

export default function DocumentsTable({ rows, deletingId, onDelete }: DocumentsTableProps) {
    const { t, i18n } = useTranslation()
    const language = i18n.resolvedLanguage ?? i18n.language
    const headers = [
        t('documents.columns.name'),
        t('documents.columns.type'),
        t('documents.columns.language'),
        t('documents.columns.version'),
        t('documents.columns.effectiveFrom'),
        t('documents.columns.status'),
        t('documents.columns.actions'),
    ]

    return (
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        {headers.map((header) => (
                            <TableCell key={header} align="center" sx={headerCellSx}>
                                {header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id} hover>
                            <TableCell align="center" sx={{ py: 1.25 }}>
                                <Link href={policyFileUrl(row.documentUrl)} target="_blank" rel="noopener noreferrer">
                                    {row.name}
                                </Link>
                            </TableCell>
                            <TableCell align="center" sx={{ py: 1.25 }}>
                                {t(`documents.types.${row.type}`)}
                            </TableCell>
                            <TableCell align="center" sx={{ py: 1.25 }}>
                                {t(`documents.languages.${row.language}`)}
                            </TableCell>
                            <TableCell align="center" sx={{ py: 1.25 }}>
                                {row.version}
                            </TableCell>
                            <TableCell align="center" sx={{ py: 1.25, whiteSpace: 'nowrap' }}>
                                {formatPolicyDate(row.effectiveFrom, language)}
                            </TableCell>
                            <TableCell align="center" sx={{ py: 1.25 }}>
                                <StatusCell status={row.status} stage={row.currentStage} errorMessage={row.errorMessage} />
                            </TableCell>
                            <TableCell align="center" sx={{ py: 1.25 }}>
                                <Button
                                    size="small"
                                    color="error"
                                    disabled={deletingId === row.id}
                                    onClick={() => onDelete(row.id)}
                                >
                                    {t('documents.delete')}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

function StatusCell({
    status,
    stage,
    errorMessage,
}: {
    status: PolicyStatus
    stage: PolicyStage | null
    errorMessage: string | null
}) {
    const { t } = useTranslation()
    const showStage = stage && (status === 'PROCESSING' || status === 'FAILED')

    return (
        <Stack spacing={0.5} sx={{ alignItems: 'center' }}>
            <Chip size="small" color={statusColor[status]} label={t(`documents.statuses.${status}`)} />
            {showStage ? (
                <Typography variant="caption" color="text.secondary">
                    {t(`documents.stages.${stage}`)}
                </Typography>
            ) : null}
            {status === 'FAILED' && errorMessage ? (
                <Typography variant="caption" color="error">
                    {errorMessage}
                </Typography>
            ) : null}
        </Stack>
    )
}
