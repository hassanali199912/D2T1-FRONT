import type { ReactNode } from 'react'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'

type Column<Row> = {
    header: string
    render: (row: Row) => ReactNode
}

type RecordsTableProps<Row extends { id: string }> = {
    title: string
    columns: Column<Row>[]
    rows: readonly Row[]
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
