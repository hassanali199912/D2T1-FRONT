import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { queryClient } from '../../config/queryBase/queryClient.ts'
import { analyzeClaim, claimErrorMessage, claimTypesQueryKey, claimsQueryKey, createClaim, listClaimTypes } from '../claims/api.ts'
import type { ClaimAnalysis, CreateClaimInput } from '../claims/types.ts'
import { listPolicyOptions, policyOptionsQueryKey } from '../policies/api.ts'
import { useTranslation } from '../../language/index.ts'
import { paths } from '../../routes/paths.ts'
import ClaimAiPanel, { type ClaimAiPhase } from './claims/ClaimAiPanel.tsx'
import ClaimForm from './claims/ClaimForm.tsx'

const knownErrors = [
    'POLICY_NOT_FOUND',
    'INVALID_INCIDENT_DATE',
    'NO_APPLICABLE_POLICY_VERSION',
    'UNAUTHORIZED_CLAIM_ACCESS',
    'ANALYSIS_FAILED',
] as const

export default function NewClaimPage() {
    const { t } = useTranslation()
    const [phase, setPhase] = useState<ClaimAiPhase>('idle')
    const [analysis, setAnalysis] = useState<ClaimAnalysis | null>(null)
    const [formError, setFormError] = useState('')
    const [panelError, setPanelError] = useState('')
    const options = useQuery({ queryKey: policyOptionsQueryKey, queryFn: listPolicyOptions })
    const types = useQuery({ queryKey: claimTypesQueryKey, queryFn: listClaimTypes })
    const loading = options.isPending || types.isPending
    const loadError = options.isError || types.isError

    async function handleCreate(draft: CreateClaimInput) {
        setFormError('')
        setPanelError('')
        setAnalysis(null)
        setPhase('processing')
        try {
            const claim = await createClaim(draft)
            await queryClient.invalidateQueries({ queryKey: claimsQueryKey })
            try {
                const result = await analyzeClaim(claim.id)
                setAnalysis(result)
                setPhase('ready')
            } catch (error) {
                setPanelError(errorText(error, t))
                setPhase('error')
            }
        } catch (error) {
            setFormError(errorText(error, t))
            setPhase('idle')
        }
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
            {loading ? (
                <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
                    <CircularProgress />
                </Box>
            ) : null}
            {loadError ? (
                <Typography variant="body2" color="error">
                    {claimErrorMessage(options.error ?? types.error) || t('claims.loadFailed')}
                </Typography>
            ) : null}
            {options.data && types.data ? (
                <Box
                    sx={{
                        display: 'grid',
                        gap: 2,
                        alignItems: 'stretch',
                        gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1.15fr) minmax(240px, 0.85fr)' },
                    }}
                >
                    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
                        <ClaimForm
                            options={options.data}
                            types={types.data}
                            disabled={phase === 'processing'}
                            error={formError}
                            onSubmit={(draft) => {
                                void handleCreate(draft)
                            }}
                        />
                    </Paper>
                    <Box sx={{ minWidth: 0 }}>
                        <ClaimAiPanel phase={phase} analysis={analysis} error={panelError} />
                    </Box>
                </Box>
            ) : null}
        </Stack>
    )
}

function errorText(error: unknown, t: (key: string) => string) {
    const message = claimErrorMessage(error)
    if (knownErrors.some((code) => code === message)) return t(`claims.errors.${message}`)
    return message || t('claims.errors.failed')
}
