import { Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useTranslation } from '../../../language/index.ts'
import { formatPolicyDate } from './library.ts'
import type { DocumentStatus, DocumentType, LibraryDocument } from './types.ts'

const statusColor: Record<DocumentStatus, 'success' | 'warning' | 'error'> = {
    indexed: 'success',
    pending: 'warning',
    error: 'error',
}

type DocumentsTableProps = {
    rows: readonly LibraryDocument[]
}

const headerCellSx = {
    fontWeight: 700,
    color: 'text.secondary',
    bgcolor: 'background.default',
    whiteSpace: 'nowrap',
} as const

export default function DocumentsTable({ rows }: DocumentsTableProps) {
    const { t, i18n } = useTranslation()
    const language = i18n.resolvedLanguage ?? i18n.language
    const headers = [
        t('documents.columns.name'),
        t('documents.columns.policyDate'),
        t('documents.columns.type'),
        t('documents.columns.status'),
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
                                {row.name}
                            </TableCell>
                            <TableCell align="center" sx={{ py: 1.25, whiteSpace: 'nowrap' }}>
                                {formatPolicyDate(row.policyDate, language)}
                            </TableCell>
                            <TableCell align="center" sx={{ py: 1.25 }}>
                                <TypeChip type={row.type} />
                            </TableCell>
                            <TableCell align="center" sx={{ py: 1.25 }}>
                                <StatusChip status={row.status} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

function TypeChip({ type }: { type: DocumentType }) {
    const { t } = useTranslation()

    return <Chip size="small" variant="outlined" label={t(`documents.types.${type}`)} />
}

function StatusChip({ status }: { status: DocumentStatus }) {
    const { t } = useTranslation()

    return <Chip size="small" color={statusColor[status]} label={t(`documents.statuses.${status}`)} />
}
