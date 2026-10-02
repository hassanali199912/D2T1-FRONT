import { useRef, useState, type ReactNode } from 'react'
import {
    Alert,
    Box,
    Button,
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
import { formatMoney } from './approvals/library.ts'
import { dismissDecision, useApprovalQueue } from './approvals/queue.ts'
import { useTranslation } from '../../language/index.ts'
import { paths } from '../../routes/paths.ts'

type ReviewMode = 'idle' | 'reject' | 'edit'

export default function ApprovalReviewPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const queue = useApprovalQueue()
    const decision = queue.find((item) => item.id === id)
    const [mode, setMode] = useState<ReviewMode>('idle')
    const [editedDecision, setEditedDecision] = useState('')
    const [editedJustification, setEditedJustification] = useState('')
    const [decisionError, setDecisionError] = useState('')
    const [justificationError, setJustificationError] = useState('')
    const leaving = useRef(false)

    if (!decision) {
        if (leaving.current) return null
        return (
            <Stack spacing={2} sx={{ maxWidth: 480 }}>
                <Typography variant="h5">{t('approvals.missing')}</Typography>
                <Button component={RouterLink} to={paths.approvals} variant="contained" sx={{ alignSelf: 'flex-start' }}>
                    {t('approvals.back')}
                </Button>
            </Stack>
        )
    }

    const current = decision
    const language = i18n.resolvedLanguage ?? i18n.language
    const suggested = t(current.proposedDecisionKey)
    const justification = t(current.justificationKey)

    function finish() {
        leaving.current = true
        dismissDecision(current.id)
        void navigate(paths.approvals)
    }

    function accept() {
        finish()
    }

    function confirmReject() {
        finish()
    }

    function confirmEdit() {
        const nextDecision = editedDecision.trim()
        const nextJustification = editedJustification.trim()
        setDecisionError(nextDecision ? '' : t('approvals.decisionRequired'))
        setJustificationError(nextJustification ? '' : t('approvals.justificationRequired'))
        if (!nextDecision || !nextJustification) return
        finish()
    }

    function openEdit() {
        setMode('edit')
        setEditedDecision(suggested)
        setEditedJustification(justification)
        setDecisionError('')
        setJustificationError('')
    }

    function openReject() {
        setMode('reject')
        setDecisionError('')
        setJustificationError('')
    }

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
                            {decision.policyNumber} · {t(decision.typeKey)}
                        </Typography>
                    </Box>
                    <Button component={RouterLink} to={paths.approvals}>
                        {t('approvals.back')}
                    </Button>
                </Stack>
                <Stack direction="row" spacing={1.25} sx={{ flexWrap: 'wrap' }}>
                    <Button variant="contained" color="success" onClick={accept} disabled={mode !== 'idle'}>
                        {t('approvals.accept')}
                    </Button>
                    <Button variant="outlined" color="error" onClick={openReject}>
                        {t('approvals.reject')}
                    </Button>
                    <Button variant="outlined" onClick={openEdit}>
                        {t('approvals.editAccept')}
                    </Button>
                </Stack>
                {mode === 'reject' ? (
                    <Stack direction="row" spacing={1.5}>
                        <Button variant="contained" color="error" onClick={confirmReject}>
                            {t('approvals.confirmReject')}
                        </Button>
                        <Button onClick={() => setMode('idle')}>{t('approvals.cancel')}</Button>
                    </Stack>
                ) : null}
                {mode === 'edit' ? (
                    <Stack direction="row" spacing={1.5}>
                        <Button variant="contained" onClick={confirmEdit}>
                            {t('approvals.confirmEdit')}
                        </Button>
                        <Button onClick={() => setMode('idle')}>{t('approvals.cancel')}</Button>
                    </Stack>
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
                        {mode === 'edit' ? (
                            <TextField
                                fullWidth
                                multiline
                                minRows={2}
                                size="medium"
                                value={editedDecision}
                                error={Boolean(decisionError)}
                                helperText={decisionError}
                                onChange={(event) => {
                                    setEditedDecision(event.target.value)
                                    setDecisionError('')
                                }}
                            />
                        ) : (
                            <Typography variant="h5">{suggested}</Typography>
                        )}
                    </Section>
                    <Section title={t('approvals.justification')} accent="secondary.main">
                        {mode === 'edit' ? (
                            <TextField
                                fullWidth
                                multiline
                                minRows={2}
                                size="medium"
                                value={editedJustification}
                                error={Boolean(justificationError)}
                                helperText={justificationError}
                                onChange={(event) => {
                                    setEditedJustification(event.target.value)
                                    setJustificationError('')
                                }}
                            />
                        ) : (
                            <Typography variant="body1">{justification}</Typography>
                        )}
                    </Section>
                    <Section title={t('approvals.calculation')} accent="primary.light">
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textAlign: 'start' }}>{t('approvals.calcItem')}</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textAlign: 'start' }}>
                                        {t('approvals.calcAmount')}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {decision.calculation.map((line, index) => {
                                    const isTotal = index === decision.calculation.length - 1
                                    return (
                                        <TableRow key={line.id}>
                                            <TableCell sx={{ fontWeight: isTotal ? 700 : 400, textAlign: 'start' }}>{t(line.labelKey)}</TableCell>
                                            <TableCell sx={{ fontWeight: isTotal ? 700 : 400, whiteSpace: 'nowrap', textAlign: 'start' }}>
                                                {formatMoney(line.amount, language)}
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
                        <Stack spacing={1.5}>
                            {decision.citations.map((citation) => (
                                <Box
                                    key={citation.id}
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        bgcolor: 'info.light',
                                        borderInlineStart: 4,
                                        borderColor: 'info.main',
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'info.dark' }}>
                                        {t(citation.sourceKey)}
                                    </Typography>
                                    <Typography variant="body2">{t(citation.excerptKey)}</Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Section>

                    <Section title={t('approvals.anomalies')} accent="warning.main">
                        {decision.anomalies.length === 0 ? (
                            <Alert severity="success">{t('approvals.noAnomalies')}</Alert>
                        ) : (
                            <Stack spacing={1}>
                                {decision.anomalies.map((anomaly) => (
                                    <Alert key={anomaly.id} severity={anomaly.severity}>
                                        {t(anomaly.textKey)}
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
