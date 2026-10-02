import { useEffect, useRef, useState } from 'react'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import ClaimAiPanel, { type ClaimAiPhase } from './claims/ClaimAiPanel.tsx'
import ClaimForm, { type ClaimDraft } from './claims/ClaimForm.tsx'
import { addClaim, setClaimStatus } from './claims/store.ts'
import type { ClaimType } from './claims/types.ts'
import { useTranslation } from '../../language/index.ts'
import { paths } from '../../routes/paths.ts'

export default function NewClaimPage() {
    const { t } = useTranslation()
    const [phase, setPhase] = useState<ClaimAiPhase>('idle')
    const [subject, setSubject] = useState<{ policyNumber: string; type: ClaimType } | null>(null)
    const [resultKey, setResultKey] = useState('')
    const timer = useRef<number | null>(null)
    const panelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        return () => {
            if (timer.current !== null) window.clearTimeout(timer.current)
        }
    }, [])

    function handleCreate(draft: ClaimDraft) {
        const id = crypto.randomUUID()
        addClaim({
            id,
            status: 'running',
            ...draft,
        })
        setSubject({ policyNumber: draft.policyNumber, type: draft.type })
        setResultKey('')
        setPhase('processing')
        if (timer.current !== null) window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => {
            setClaimStatus(id, 'awaiting_approval')
            setResultKey(`claims.ai.results.${draft.type}`)
            setPhase('ready')
            timer.current = null
        }, 2400)
        panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }

    return (
        <Stack spacing={2.5}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h4">{t('claims.formTitle')}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {t('claims.formDescription')}
                    </Typography>
                </Box>
                <Button component={RouterLink} to={paths.claims}>
                    {t('claims.back')}
                </Button>
            </Stack>
            <Box
                sx={{
                    display: 'grid',
                    gap: 2,
                    alignItems: 'stretch',
                    gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1.15fr) minmax(240px, 0.85fr)' },
                }}
            >
                <Paper sx={{ p: { xs: 2, sm: 3 } }}>
                    <ClaimForm disabled={phase === 'processing'} onSubmit={handleCreate} />
                </Paper>
                <Box ref={panelRef} sx={{ minWidth: 0 }}>
                    <ClaimAiPanel
                        phase={phase}
                        policyNumber={subject?.policyNumber}
                        type={subject?.type}
                        resultKey={resultKey}
                    />
                </Box>
            </Box>
        </Stack>
    )
}
