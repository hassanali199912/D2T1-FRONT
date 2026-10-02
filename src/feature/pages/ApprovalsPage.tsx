import { Box, Button, Card, CardContent, Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useApprovalQueue } from './approvals/queue.ts'
import { useTranslation } from '../../language/index.ts'
import { approvalReviewPath } from '../../routes/paths.ts'

const headerCellSx = {
    fontWeight: 700,
    color: 'text.secondary',
    bgcolor: 'background.default',
    whiteSpace: 'nowrap',
} as const

export default function ApprovalsPage() {
    const { t } = useTranslation()
    const queue = useApprovalQueue()
    const headers = [
        t('approvals.columns.policy'),
        t('approvals.columns.type'),
        t('approvals.columns.decision'),
        t('approvals.columns.anomalies'),
        t('approvals.columns.action'),
    ]

    return (
        <Stack spacing={2.5}>
            <Box>
                <Typography variant="h4">{t('approvals.listTitle')}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {t('approvals.description')}
                </Typography>
            </Box>
            {queue.length === 0 ? (
                <Card>
                    <CardContent sx={{ py: 6, textAlign: 'center' }}>
                        <Typography variant="h6">{t('approvals.empty')}</Typography>
                    </CardContent>
                </Card>
            ) : (
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
                            {queue.map((decision) => {
                                const hasError = decision.anomalies.some((anomaly) => anomaly.severity === 'error')
                                return (
                                    <TableRow key={decision.id} hover>
                                        <TableCell align="center" sx={{ py: 1.25, whiteSpace: 'nowrap' }}>
                                            {decision.policyNumber}
                                        </TableCell>
                                        <TableCell align="center" sx={{ py: 1.25, whiteSpace: 'nowrap' }}>
                                            {t(decision.typeKey)}
                                        </TableCell>
                                        <TableCell align="center" sx={{ py: 1.25, minWidth: 180 }}>
                                            {t(decision.proposedDecisionKey)}
                                        </TableCell>
                                        <TableCell align="center" sx={{ py: 1.25 }}>
                                            <Chip
                                                size="small"
                                                color={decision.anomalies.length === 0 ? 'success' : hasError ? 'error' : 'warning'}
                                                label={
                                                    decision.anomalies.length === 0
                                                        ? t('approvals.noAnomalies')
                                                        : t('approvals.anomalyCount', { count: decision.anomalies.length })
                                                }
                                            />
                                        </TableCell>
                                        <TableCell align="center" sx={{ py: 1.25 }}>
                                            <Button
                                                component={RouterLink}
                                                to={approvalReviewPath(decision.id)}
                                                variant="contained"
                                                size="small"
                                            >
                                                {t('approvals.review')}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Stack>
    )
}
