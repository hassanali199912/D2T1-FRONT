import { useState, type ReactNode } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    MenuItem,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { queryClient } from '../../config/queryBase/queryClient.ts'
import {
    approvalErrorMessage,
    approveApproval,
    approvalsQueryKey,
    editAndApprove,
    getApproval,
    isUnauthorizedReviewer,
    rejectApproval,
} from '../approvals/api.ts'
import type { HumanDecision } from '../approvals/types.ts'
import { claimsQueryKey } from '../claims/api.ts'
import { formatClaimAmount, formatClaimDate } from './claims/library.ts'
import { useTranslation } from '../../language/index.ts'
import { paths } from '../../routes/paths.ts'

type ReviewMode = 'idle' | 'reject' | 'edit'

const knownErrors = [
    'UNAUTHORIZED_REVIEWER',
    'APPROVAL_NOT_PENDING',
    'INVALID_REJECTION_REASON',
    'INVALID_FINAL_PAYOUT',
] as const

export default function ApprovalReviewPage() {
    const { id = '' } = useParams()
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const language = i18n.resolvedLanguage ?? i18n.language
    const [mode, setMode] = useState<ReviewMode>('idle')
    const [comment, setComment] = useState('')
    const [finalDecision, setFinalDecision] = useState<HumanDecision>('APPROVE')
    const [finalPayout, setFinalPayout] = useState('')
    const [commentError, setCommentError] = useState('')
    const [payoutError, setPayoutError] = useState('')
    const [actionError, setActionError] = useState('')

    const approval = useQuery({
        queryKey: [...approvalsQueryKey, 'detail', id],
        queryFn: () => getApproval(id),
        enabled: Boolean(id),
        retry: (failureCount, error) => !isUnauthorizedReviewer(error) && failureCount < 1,
    })

    const action = useMutation({
        mutationFn: async (kind: 'accept' | 'reject' | 'edit') => {
            if (!id) throw new Error('Missing approval id')
            if (kind === 'reject') return rejectApproval(id, { comment: comment.trim() })
            if (kind === 'edit') {
                return editAndApprove(id, {
                    finalDecision,
                    comment: comment.trim(),
                    finalPayout: finalDecision === 'APPROVE' ? Number(finalPayout) : undefined,
                })
            }
            return approveApproval(id)
        },
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: approvalsQueryKey }),
                queryClient.invalidateQueries({ queryKey: claimsQueryKey }),
            ])
            void navigate(paths.approvals)
        },
        onError: (error) => {
            setActionError(errorText(error, t))
        },
    })

    if (approval.isPending) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
                <CircularProgress />
            </Box>
        )
    }

    if (approval.isError) {
        const unauthorized = isUnauthorizedReviewer(approval.error)
        const message = unauthorized
            ? t('approvals.unauthorized')
            : approvalErrorMessage(approval.error) === 'APPROVAL_NOT_PENDING'
              ? t('approvals.missing')
              : approvalErrorMessage(approval.error) || t('approvals.loadFailed')
        return (
            <Stack spacing={2} sx={{ maxWidth: 480 }}>
                <Typography variant="h5">{message}</Typography>
                <Button component={RouterLink} to={paths.approvals} variant="contained" sx={{ alignSelf: 'flex-start' }}>
                    {t('approvals.back')}
                </Button>
            </Stack>
        )
    }

    const item = approval.data
    if (!item || item.status !== 'PENDING') {
        return (
            <Stack spacing={2} sx={{ maxWidth: 480 }}>
                <Typography variant="h5">{t('approvals.missing')}</Typography>
                <Button component={RouterLink} to={paths.approvals} variant="contained" sx={{ alignSelf: 'flex-start' }}>
                    {t('approvals.back')}
                </Button>
            </Stack>
        )
    }

    const decision = item.originalRecommendation.decision
    const reasoning = item.originalRecommendation.reasoning || item.analysis.reasoning || ''
    const anomalies = item.analysis.anomalies?.detected ? item.analysis.anomalies.items : []
    const evidence = Array.isArray(item.analysis.evidence) ? item.analysis.evidence : []
    const pending = action.isPending

    function openReject() {
        setMode('reject')
        setComment('')
        setCommentError('')
        setActionError('')
    }

    function openEdit() {
        setMode('edit')
        setFinalDecision('APPROVE')
        setFinalPayout(item.originalRecommendation.payout ?? item.analysis.payout ?? '')
        setComment('')
        setCommentError('')
        setPayoutError('')
        setActionError('')
    }

    function runAccept() {
        setMode('idle')
        setActionError('')
        action.mutate('accept')
    }

    function runReject() {
        const next = comment.trim()
        setCommentError(next ? '' : t('approvals.commentRequired'))
        if (!next) return
        setActionError('')
        action.mutate('reject')
    }

    function runEdit() {
        const nextComment = comment.trim()
        const parsed = Number(finalPayout)
        setCommentError(nextComment ? '' : t('approvals.commentRequired'))
        if (finalDecision === 'APPROVE' && (!finalPayout.trim() || !Number.isFinite(parsed) || parsed < 0)) {
            setPayoutError(t('approvals.payoutRequired'))
            return
        }
        setPayoutError('')
        if (!nextComment) return
        setActionError('')
        action.mutate('edit')
    }

    const calcRows = [
        { label: t('approvals.calcClaimed'), amount: item.claim.claimedAmount },
        { label: t('approvals.calcLimit'), amount: item.analysis.coverageLimit },
        { label: t('approvals.calcDeductible'), amount: item.analysis.deductible },
        { label: t('approvals.calcPayout'), amount: item.originalRecommendation.payout ?? item.analysis.payout },
    ]

    return (
        <Stack spacing={2.5} sx={{ width: '100%' }}>
            <Stack spacing={1.5}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h4">{t('approvals.reviewTitle')}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {t('approvals.reviewDescription')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {item.claim.claimNumber}
                            {item.policy ? ` · ${item.policy.name}` : ''}
                            {` · ${t(`claims.types.${item.claim.claimType}`)}`}
                            {` · ${formatClaimDate(item.claim.incidentDate, language)}`}
                        </Typography>
                    </Box>
                    <Button component={RouterLink} to={paths.approvals} disabled={pending}>
                        {t('approvals.back')}
                    </Button>
                </Stack>
                <Stack direction="row" spacing={1.25} sx={{ flexWrap: 'wrap' }}>
                    <Button variant="contained" color="success" onClick={runAccept} disabled={pending || mode !== 'idle'}>
                        {t('approvals.accept')}
                    </Button>
                    <Button variant="outlined" color="error" onClick={openReject} disabled={pending}>
                        {t('approvals.reject')}
                    </Button>
                    <Button variant="outlined" onClick={openEdit} disabled={pending}>
                        {t('approvals.editAccept')}
                    </Button>
                </Stack>
                {mode === 'reject' ? (
                    <Stack spacing={1.5} sx={{ maxWidth: 480 }}>
                        <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            size="medium"
                            disabled={pending}
                            label={t('approvals.comment')}
                            value={comment}
                            error={Boolean(commentError)}
                            helperText={commentError || t('approvals.commentHint')}
                            onChange={(event) => {
                                setComment(event.target.value)
                                setCommentError('')
                            }}
                        />
                        <Stack direction="row" spacing={1.5}>
                            <Button variant="contained" color="error" disabled={pending} onClick={runReject}>
                                {t('approvals.confirmReject')}
                            </Button>
                            <Button disabled={pending} onClick={() => setMode('idle')}>
                                {t('approvals.cancel')}
                            </Button>
                        </Stack>
                    </Stack>
                ) : null}
                {mode === 'edit' ? (
                    <Stack spacing={1.5} sx={{ maxWidth: 480 }}>
                        <TextField
                            select
                            fullWidth
                            size="medium"
                            disabled={pending}
                            label={t('approvals.finalDecision')}
                            value={finalDecision}
                            onChange={(event) => setFinalDecision(event.target.value as HumanDecision)}
                        >
                            <MenuItem value="APPROVE">{t('claims.decisions.APPROVE')}</MenuItem>
                            <MenuItem value="REJECT">{t('claims.decisions.REJECT')}</MenuItem>
                        </TextField>
                        {finalDecision === 'APPROVE' ? (
                            <TextField
                                fullWidth
                                size="medium"
                                type="number"
                                disabled={pending}
                                label={t('approvals.finalPayout')}
                                value={finalPayout}
                                error={Boolean(payoutError)}
                                helperText={payoutError}
                                slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                                onChange={(event) => {
                                    setFinalPayout(event.target.value)
                                    setPayoutError('')
                                }}
                            />
                        ) : null}
                        <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            size="medium"
                            disabled={pending}
                            label={t('approvals.comment')}
                            value={comment}
                            error={Boolean(commentError)}
                            helperText={commentError || t('approvals.commentHint')}
                            onChange={(event) => {
                                setComment(event.target.value)
                                setCommentError('')
                            }}
                        />
                        <Stack direction="row" spacing={1.5}>
                            <Button variant="contained" disabled={pending} onClick={runEdit}>
                                {t('approvals.confirmEdit')}
                            </Button>
                            <Button disabled={pending} onClick={() => setMode('idle')}>
                                {t('approvals.cancel')}
                            </Button>
                        </Stack>
                    </Stack>
                ) : null}
                {actionError ? (
                    <Typography variant="body2" color="error" sx={{ whiteSpace: 'pre-line' }}>
                        {actionError}
                    </Typography>
                ) : null}
            </Stack>

            <Box
                sx={{
                    display: 'grid',
                    width: '100%',
                    gap: 2,
                    alignItems: 'start',
                    gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) minmax(0, 1fr)' },
                }}
            >
                <Stack spacing={2}>
                    <Section title={t('approvals.proposed')} accent="primary.main" highlighted>
                        <Typography variant="h5">
                            {t(`claims.decisions.${decision}`, { defaultValue: decision })}
                        </Typography>
                    </Section>
                    <Section title={t('approvals.justification')} accent="secondary.main">
                        <Typography variant="body1">{reasoning || '—'}</Typography>
                    </Section>
                    <Section title={t('approvals.calculation')} accent="primary.light">
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textAlign: 'start' }}>
                                        {t('approvals.calcItem')}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textAlign: 'start' }}>
                                        {t('approvals.calcAmount')}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {calcRows.map((row, index) => {
                                    const isTotal = index === calcRows.length - 1
                                    return (
                                        <TableRow key={row.label}>
                                            <TableCell sx={{ fontWeight: isTotal ? 700 : 400, textAlign: 'start' }}>
                                                {row.label}
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: isTotal ? 700 : 400, whiteSpace: 'nowrap', textAlign: 'start' }}>
                                                {row.amount ? formatClaimAmount(row.amount, language) : '—'}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </Section>
                </Stack>

                <Stack spacing={2}>
                    <Section title={t('approvals.citations')} accent="info.main">
                        {evidence.length === 0 ? (
                            <Typography color="text.secondary">—</Typography>
                        ) : (
                            <Stack spacing={1.5}>
                                {evidence.map((citation) => (
                                    <Box
                                        key={citation.chunkId}
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            bgcolor: 'info.light',
                                            borderInlineStart: 4,
                                            borderColor: 'info.main',
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'info.dark' }}>
                                            {[
                                                citation.documentName,
                                                t('approvals.versionValue', { version: citation.version }),
                                                citation.pageNumber !== null && citation.pageNumber !== undefined
                                                    ? t('approvals.pageValue', { page: citation.pageNumber })
                                                    : '',
                                                citation.section ?? '',
                                            ]
                                                .filter(Boolean)
                                                .join(' · ')}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </Section>

                    <Section title={t('approvals.anomalies')} accent="warning.main">
                        {anomalies.length === 0 ? (
                            <Alert severity="success">{t('approvals.noAnomalies')}</Alert>
                        ) : (
                            <Stack spacing={1}>
                                {anomalies.map((itemText) => (
                                    <Alert key={itemText} severity="warning">
                                        {itemText}
                                    </Alert>
                                ))}
                            </Stack>
                        )}
                    </Section>
                </Stack>
            </Box>
        </Stack>
    )
}

function Section({
    title,
    children,
    accent,
    highlighted = false,
}: {
    title: string
    children: ReactNode
    accent: string
    highlighted?: boolean
}) {
    return (
        <Paper
            sx={{
                p: 2.25,
                borderInlineStart: '3px solid',
                borderColor: accent,
                bgcolor: highlighted ? (theme) => alpha(theme.palette.primary.main, 0.06) : 'background.paper',
            }}
        >
            <Typography variant="h6" sx={{ mb: 1.25 }}>
                {title}
            </Typography>
            {children}
        </Paper>
    )
}

function errorText(error: unknown, t: (key: string) => string) {
    const message = approvalErrorMessage(error)
    if (knownErrors.some((code) => code === message)) return t(`approvals.errors.${message}`)
    return message || t('approvals.errors.failed')
}
