import { Chip, CircularProgress, Paper, Stack, Typography } from '@mui/material'
import { useTranslation } from '../../../language/index.ts'
import type { AnalysisDecision, ClaimAnalysis } from '../../claims/types.ts'
import { formatClaimAmount, formatClaimDate } from './library.ts'

export type ClaimAiPhase = 'idle' | 'processing' | 'ready' | 'error'

const decisionColor: Record<AnalysisDecision, 'success' | 'error' | 'warning'> = {
    APPROVE: 'success',
    REJECT: 'error',
    REVIEW: 'warning',
}

type ClaimAiPanelProps = {
    phase: ClaimAiPhase
    analysis?: ClaimAnalysis | null
    error?: string
}

export default function ClaimAiPanel({ phase, analysis, error }: ClaimAiPanelProps) {
    const { t, i18n } = useTranslation()
    const language = i18n.resolvedLanguage ?? i18n.language
    const refused = analysis?.status === 'INSUFFICIENT_EVIDENCE'

    return (
        <Paper
            variant="outlined"
            aria-live="polite"
            sx={{
                p: 2.5,
                height: '100%',
                borderRadius: 2,
                bgcolor: 'background.paper',
            }}
        >
            <Stack spacing={1.5}>
                <Typography variant="h5">{t('claims.ai.title')}</Typography>
                {phase === 'idle' ? <Typography color="text.secondary">{t('claims.ai.idle')}</Typography> : null}
                {phase === 'processing' ? (
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                        <CircularProgress size={22} color="secondary" />
                        <Stack spacing={0.25}>
                            <Typography>{t('claims.ai.processing')}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {t('claims.ai.waiting')}
                            </Typography>
                        </Stack>
                    </Stack>
                ) : null}
                {phase === 'error' && error ? (
                    <Typography color="error" sx={{ whiteSpace: 'pre-line' }}>
                        {error}
                    </Typography>
                ) : null}
                {phase === 'ready' && analysis && refused ? (
                    <Stack spacing={0.75}>
                        <Typography variant="body2" color="text.secondary">
                            {analysis.claim.claimNumber}
                        </Typography>
                        <Typography>{analysis.message || t('claims.ai.noEvidence')}</Typography>
                    </Stack>
                ) : null}
                {phase === 'ready' && analysis && !refused ? (
                    <Stack spacing={1.5}>
                        <Typography variant="body2" color="text.secondary">
                            {analysis.claim.claimNumber}
                            {` · ${t('claims.ai.version')} ${analysis.policy.versionNumber}`}
                            {` · ${formatClaimDate(analysis.policy.effectiveFrom, language)}`}
                        </Typography>
                        {analysis.recommendation ? (
                            <Stack spacing={0.5}>
                                <Typography variant="subtitle2">{t('claims.ai.recommendation')}</Typography>
                                <Chip
                                    size="small"
                                    sx={{ alignSelf: 'flex-start' }}
                                    color={decisionColor[analysis.recommendation.decision]}
                                    label={t(`claims.decisions.${analysis.recommendation.decision}`)}
                                />
                                <Typography>{analysis.recommendation.reasoning}</Typography>
                            </Stack>
                        ) : null}
                        <Stack spacing={0.25}>
                            <Typography variant="subtitle2">{t('claims.ai.financials')}</Typography>
                            <MoneyLine label={t('claims.ai.claimed')} amount={analysis.financials.claimedAmount} language={language} />
                            <MoneyLine label={t('claims.ai.limit')} amount={analysis.financials.coverageLimit} language={language} />
                            <MoneyLine label={t('claims.ai.deductible')} amount={analysis.financials.deductible} language={language} />
                            <MoneyLine label={t('claims.ai.payout')} amount={analysis.financials.payout} language={language} />
                        </Stack>
                        {analysis.coverage ? (
                            <Stack spacing={0.25}>
                                <Typography variant="subtitle2">{t('claims.ai.coverage')}</Typography>
                                <Typography>
                                    {analysis.coverage.covered ? t('claims.ai.covered') : t('claims.ai.notCovered')}
                                </Typography>
                                <Typography>{analysis.coverage.reasoning}</Typography>
                            </Stack>
                        ) : null}
                        {analysis.exclusions?.applicable ? (
                            <Stack spacing={0.25}>
                                <Typography variant="subtitle2">{t('claims.ai.exclusions')}</Typography>
                                {analysis.exclusions.items.map((item) => (
                                    <Typography key={item.name}>
                                        {item.name}: {item.reasoning}
                                    </Typography>
                                ))}
                            </Stack>
                        ) : null}
                        {analysis.anomalies?.detected ? (
                            <Stack spacing={0.25}>
                                <Typography variant="subtitle2">{t('claims.ai.anomalies')}</Typography>
                                {analysis.anomalies.items.map((item) => (
                                    <Typography key={item}>{item}</Typography>
                                ))}
                            </Stack>
                        ) : null}
                        {analysis.evidence.length > 0 ? (
                            <Stack spacing={0.25}>
                                <Typography variant="subtitle2">{t('claims.ai.citations')}</Typography>
                                {analysis.evidence.map((citation) => (
                                    <Typography key={citation.chunkId} variant="body2" color="text.secondary">
                                        {[
                                            citation.documentName,
                                            t('claims.ai.versionValue', { version: citation.version }),
                                            citation.pageNumber !== null
                                                ? t('claims.ai.page', { page: citation.pageNumber })
                                                : '',
                                            citation.section ?? '',
                                        ]
                                            .filter(Boolean)
                                            .join(' · ')}
                                    </Typography>
                                ))}
                            </Stack>
                        ) : null}
                    </Stack>
                ) : null}
            </Stack>
        </Paper>
    )
}

function MoneyLine({ label, amount, language }: { label: string; amount: string | null; language: string }) {
    if (!amount) return null
    return (
        <Typography variant="body2">
            {label}: {formatClaimAmount(amount, language)}
        </Typography>
    )
}
