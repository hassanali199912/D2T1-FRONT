import { CircularProgress, Paper, Stack, Typography } from '@mui/material'
import { useTranslation } from '../../../language/index.ts'
import type { ClaimType } from './types.ts'

export type ClaimAiPhase = 'idle' | 'processing' | 'ready'

type ClaimAiPanelProps = {
    phase: ClaimAiPhase
    policyNumber?: string
    type?: ClaimType
    resultKey?: string
}

export default function ClaimAiPanel({ phase, policyNumber, type, resultKey }: ClaimAiPanelProps) {
    const { t } = useTranslation()

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
                {phase === 'idle' ? (
                    <Typography color="text.secondary">{t('claims.ai.idle')}</Typography>
                ) : null}
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
                {phase === 'ready' && resultKey ? (
                    <Stack spacing={1}>
                        <Typography variant="body2" color="text.secondary">
                            {policyNumber}
                            {type ? ` · ${t(`claims.types.${type}`)}` : ''}
                        </Typography>
                        <Typography variant="subtitle2">{t('claims.ai.result')}</Typography>
                        <Typography>{t(resultKey)}</Typography>
                    </Stack>
                ) : null}
            </Stack>
        </Paper>
    )
}
