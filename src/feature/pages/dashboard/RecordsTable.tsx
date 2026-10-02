import type { ReactNode } from 'react'
import { Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useTranslation } from '../../../language/index.ts'
import type { Status } from './records.ts'

const statusColor: Record<Status, 'success' | 'default' | 'warning' | 'error' | 'info'> = {
    published: 'success',
    draft: 'default',
    review: 'warning',
    approved: 'success',
    rejected: 'error',
    pending: 'warning',
    needsInfo: 'info',
}

type Column<Row> = {
    header: string
    render: (row: Row) => ReactNode
}

type RecordsTableProps<Row extends { id: string }> = {
    title: string
    columns: Column<Row>[]
    rows: readonly Row[]
}

export function StatusChip({ status }: { status: Status }) {
    const { t } = useTranslation()

    return <Chip size="small" color={statusColor[status]} label={t(`dashboard.status.${status}`)} />
}

export default function RecordsTable<Row extends { id: string }>({ title, columns, rows }: RecordsTableProps<Row>) {
    return (
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Typography variant="h5" sx={{ px: 2.5, pt: 2, pb: 1.5 }}>
                {title}
            </Typography>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={column.header}
                                sx={{
                                    fontWeight: 700,
                                    color: 'text.secondary',
                                    bgcolor: 'background.default',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {column.header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id} hover>
                            {columns.map((column) => (
                                <TableCell key={column.header} sx={{ py: 1.25, whiteSpace: 'nowrap' }}>
                                    {column.render(row)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
