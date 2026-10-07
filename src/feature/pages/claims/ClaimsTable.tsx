import { Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useTranslation } from '../../../language/index.ts'
import type { ClaimStatus, ClaimView } from '../../claims/types.ts'
import { formatClaimAmount, formatClaimDate } from './library.ts'

const statusColor: Record<ClaimStatus, 'default' | 'info' | 'warning' | 'success' | 'error'> = {
    DRAFT: 'default',
    SUBMITTED: 'info',
    UNDER_REVIEW: 'warning',
    APPROVED: 'success',
    REJECTED: 'error',
}

type ClaimsTableProps = {
    rows: readonly ClaimView[]
}

export default function ClaimsTable({ rows }: ClaimsTableProps) {
    const { t, i18n } = useTranslation()
    const language = i18n.resolvedLanguage ?? i18n.language
    const headers = [
        t('claims.columns.claimNumber'),
        t('claims.columns.policy'),
        t('claims.columns.status'),
        t('claims.columns.incidentDate'),
        t('claims.columns.type'),
        t('claims.columns.amount'),
        t('claims.columns.createdBy'),
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
                            <TableCell align="center" sx={{ py: 1.25, whiteSpace: 'nowrap' }}>
                                {row.claimNumber}
                            </TableCell>
                            <TableCell align="center" sx={{ py: 1.25 }}>{row.policy.name}</TableCell>
                            <TableCell align="center" sx={{ py: 1.25 }}>
                                <Chip
                                    size="small"
                                    color={statusColor[row.status]}
                                    label={t(`claims.statuses.${row.status}`)}
                                />
                            </TableCell>
                            <TableCell align="center" sx={{ py: 1.25, whiteSpace: 'nowrap' }}>
                                {formatClaimDate(row.incidentDate, language)}
                            </TableCell>
                            <TableCell align="center" sx={{ py: 1.25, whiteSpace: 'nowrap' }}>
                                <Chip size="small" variant="outlined" label={t(`claims.types.${row.claimType}`)} />
                            </TableCell>
                            <TableCell align="center" sx={{ py: 1.25, whiteSpace: 'nowrap' }}>
                                {formatClaimAmount(row.claimedAmount, language)}
                            </TableCell>
                            <TableCell align="center" sx={{ py: 1.25 }}>{row.createdBy.name}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
