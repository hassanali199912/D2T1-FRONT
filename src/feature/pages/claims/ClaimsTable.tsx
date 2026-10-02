import { Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useTranslation } from '../../../language/index.ts'
import { formatClaimAmount, formatClaimDate } from './library.ts'
import type { Claim, ClaimStatus, ClaimType, DescriptionLanguage } from './types.ts'

const statusColor: Record<ClaimStatus, 'default' | 'primary' | 'warning' | 'success' | 'error'> = {
    draft: 'default',
    running: 'primary',
    awaiting_approval: 'warning',
    approved: 'success',
    rejected: 'error',
    failed: 'error',
}

type ClaimsTableProps = {
    rows: readonly Claim[]
}

export default function ClaimsTable({ rows }: ClaimsTableProps) {
    const { t, i18n } = useTranslation()
    const language = i18n.resolvedLanguage ?? i18n.language
    const headers = [
        t('claims.columns.policyNumber'),
        t('claims.columns.status'),
        t('claims.columns.incidentDate'),
        t('claims.columns.type'),
        t('claims.columns.amount'),
        t('claims.columns.description'),
    ]

    return (
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        {headers.map((header) => (
                            <TableCell
                                key={header}
                                align="center"
                                sx={{
                                    fontWeight: 700,
                                    color: 'text.secondary',
                                    bgcolor: 'background.default',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id} hover>
                            <TableCell align="center" sx={{ py: 1.25, whiteSpace: 'nowrap' }}>{row.policyNumber}</TableCell>
                            <TableCell align="center" sx={{ py: 1.25 }}>
                                <StatusChip status={row.status} />
                            </TableCell>
                            <TableCell align="center" sx={{ py: 1.25, whiteSpace: 'nowrap' }}>
                                {formatClaimDate(row.incidentDate, language)}
                            </TableCell>
                            <TableCell align="center" sx={{ py: 1.25, whiteSpace: 'nowrap' }}>
                                <TypeChip type={row.type} />
                            </TableCell>
                            <TableCell align="center" sx={{ py: 1.25, whiteSpace: 'nowrap' }}>
                                {formatClaimAmount(row.amount, language)}
                            </TableCell>
                            <TableCell align="center" sx={{ py: 1.25, minWidth: 180 }}>
                                <DescriptionCell text={row.description} language={row.language} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

function DescriptionCell({ text, language }: { text: string; language: DescriptionLanguage }) {
    const { t } = useTranslation()

    return (
        <Stack spacing={0.75} sx={{ alignItems: 'center' }}>
            <span>{text}</span>
            <Chip size="small" variant="outlined" label={t(`claims.languages.${language}`)} />
        </Stack>
    )
}

function TypeChip({ type }: { type: ClaimType }) {
    const { t } = useTranslation()

    return <Chip size="small" variant="outlined" label={t(`claims.types.${type}`)} />
}

function StatusChip({ status }: { status: ClaimStatus }) {
    const { t } = useTranslation()

    return <Chip size="small" color={statusColor[status]} label={t(`claims.statuses.${status}`)} />
}
