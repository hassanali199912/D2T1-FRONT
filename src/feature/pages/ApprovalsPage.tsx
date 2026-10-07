import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import {
    APPROVALS_PAGE_SIZE,
    approvalErrorMessage,
    approvalsQueryKey,
    isUnauthorizedReviewer,
    listApprovals,
} from '../approvals/api.ts'
import { anomalyCount } from '../approvals/types.ts'
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
    const [page, setPage] = useState(1)
    const approvals = useQuery({
        queryKey: [...approvalsQueryKey, page],
        queryFn: () => listApprovals(page),
        retry: (failureCount, error) => !isUnauthorizedReviewer(error) && failureCount < 1,
    })
    const total = approvals.data?.total ?? 0
    const limit = approvals.data?.limit ?? APPROVALS_PAGE_SIZE
    const pages = Math.max(1, Math.ceil(total / limit))
    const headers = [
        t('approvals.columns.claimNumber'),
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
            {approvals.isPending ? (
                <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
                    <CircularProgress />
                </Box>
            ) : null}
            {approvals.isError && isUnauthorizedReviewer(approvals.error) ? (
                <Card>
                    <CardContent sx={{ py: 6, textAlign: 'center' }}>
                        <Typography variant="h6">{t('approvals.unauthorized')}</Typography>
                    </CardContent>
                </Card>
            ) : null}
            {approvals.isError && !isUnauthorizedReviewer(approvals.error) ? (
                <Typography variant="body2" color="error">
                    {approvalErrorMessage(approvals.error) || t('approvals.loadFailed')}
                </Typography>
            ) : null}
            {approvals.data && approvals.data.items.length === 0 ? (
                <Card>
                    <CardContent sx={{ py: 6, textAlign: 'center' }}>
                        <Typography variant="h6">{t('approvals.empty')}</Typography>
                    </CardContent>
                </Card>
            ) : null}
            {approvals.data && approvals.data.items.length > 0 ? (
                <>
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
                                {approvals.data.items.map((item) => {
                                    const count = anomalyCount(item.analysis.anomalies)
                                    const decision = item.originalRecommendation.decision
                                    return (
                                        <TableRow key={item.id} hover>
                                            <TableCell align="center" sx={{ py: 1.25, whiteSpace: 'nowrap' }}>
                                                {item.claim.claimNumber}
                                            </TableCell>
                                            <TableCell align="center" sx={{ py: 1.25 }}>
                                                {item.policy?.name ?? '—'}
                                            </TableCell>
                                            <TableCell align="center" sx={{ py: 1.25, whiteSpace: 'nowrap' }}>
                                                {t(`claims.types.${item.claim.claimType}`)}
                                            </TableCell>
                                            <TableCell align="center" sx={{ py: 1.25 }}>
                                                {t(`claims.decisions.${decision}`, { defaultValue: decision })}
                                            </TableCell>
                                            <TableCell align="center" sx={{ py: 1.25 }}>
                                                <Chip
                                                    size="small"
                                                    color={count === 0 ? 'success' : 'warning'}
                                                    label={
                                                        count === 0
                                                            ? t('approvals.noAnomalies')
                                                            : t('approvals.anomalyCount', { count })
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell align="center" sx={{ py: 1.25 }}>
                                                <Button
                                                    component={RouterLink}
                                                    to={approvalReviewPath(item.id)}
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
                    {total > limit ? (
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Typography variant="body2" color="text.secondary">
                                {t('approvals.page', { page, pages })}
                            </Typography>
                            <Button disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
                                {t('approvals.previous')}
                            </Button>
                            <Button disabled={page >= pages} onClick={() => setPage((current) => current + 1)}>
                                {t('approvals.next')}
                            </Button>
                        </Stack>
                    ) : null}
                </>
            ) : null}
        </Stack>
    )
}
