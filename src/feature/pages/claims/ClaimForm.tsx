import { useState, type FormEvent } from 'react'
import { Box, Button, Grid, MenuItem, TextField, Typography } from '@mui/material'
import { useTranslation } from '../../../language/index.ts'
import type { PolicyOption } from '../../policies/types.ts'
import type { ClaimTypeOption, ClaimTypeValue, CreateClaimInput } from '../../claims/types.ts'
import { todayIso } from './library.ts'

type ClaimFormProps = {
    options: readonly PolicyOption[]
    types: readonly ClaimTypeOption[]
    disabled?: boolean
    error?: string
    onSubmit: (claim: CreateClaimInput) => void
}

type FieldErrors = {
    policyId?: string
    incidentDate?: string
    claimType?: string
    amount?: string
    description?: string
}

export default function ClaimForm({ options, types, disabled = false, error, onSubmit }: ClaimFormProps) {
    const { t } = useTranslation()
    const [policyId, setPolicyId] = useState('')
    const [incidentDate, setIncidentDate] = useState('')
    const [claimType, setClaimType] = useState<ClaimTypeValue | ''>('')
    const [amount, setAmount] = useState('')
    const [description, setDescription] = useState('')
    const [errors, setErrors] = useState<FieldErrors>({})
    const today = todayIso()

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (disabled) return

        const nextErrors: FieldErrors = {}
        const trimmedDescription = description.trim()
        const parsedAmount = Number(amount)

        if (!policyId) nextErrors.policyId = t('claims.policyRequired')
        if (!incidentDate) nextErrors.incidentDate = t('claims.dateRequired')
        else if (incidentDate > today) nextErrors.incidentDate = t('claims.dateFuture')
        if (!claimType) nextErrors.claimType = t('claims.typeRequired')
        if (!amount.trim()) nextErrors.amount = t('claims.amountRequired')
        else if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) nextErrors.amount = t('claims.amountInvalid')
        if (!trimmedDescription) nextErrors.description = t('claims.descriptionRequired')

        setErrors(nextErrors)
        if (Object.keys(nextErrors).length > 0 || !claimType) return

        onSubmit({
            policyId,
            incidentDate,
            claimType,
            claimedAmount: parsedAmount,
            description: trimmedDescription,
        })
    }

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <TextField
                        select
                        fullWidth
                        size="medium"
                        disabled={disabled || options.length === 0}
                        label={t('claims.columns.policy')}
                        value={policyId}
                        error={Boolean(errors.policyId)}
                        helperText={errors.policyId}
                        onChange={(event) => {
                            setPolicyId(event.target.value)
                            setErrors((current) => ({ ...current, policyId: undefined }))
                        }}
                    >
                        {options.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {`${option.name} · ${option.version} · ${t(`claims.languages.${option.language}`)}`}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <TextField
                        fullWidth
                        size="medium"
                        type="date"
                        disabled={disabled}
                        label={t('claims.columns.incidentDate')}
                        value={incidentDate}
                        error={Boolean(errors.incidentDate)}
                        helperText={errors.incidentDate}
                        slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: today } }}
                        onChange={(event) => {
                            setIncidentDate(event.target.value)
                            setErrors((current) => ({ ...current, incidentDate: undefined }))
                        }}
                    />
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <TextField
                        select
                        fullWidth
                        size="medium"
                        disabled={disabled || types.length === 0}
                        label={t('claims.columns.type')}
                        value={claimType}
                        error={Boolean(errors.claimType)}
                        helperText={errors.claimType}
                        onChange={(event) => {
                            setClaimType(event.target.value as ClaimTypeValue)
                            setErrors((current) => ({ ...current, claimType: undefined }))
                        }}
                    >
                        {types.map((item) => (
                            <MenuItem key={item.value} value={item.value}>
                                {t(`claims.types.${item.value}`)}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <TextField
                        fullWidth
                        size="medium"
                        type="number"
                        disabled={disabled}
                        label={t('claims.columns.amount')}
                        value={amount}
                        error={Boolean(errors.amount)}
                        helperText={errors.amount}
                        slotProps={{ htmlInput: { min: 0.01, step: 0.01 } }}
                        onChange={(event) => {
                            setAmount(event.target.value)
                            setErrors((current) => ({ ...current, amount: undefined }))
                        }}
                    />
                </Grid>
                <Grid size={12}>
                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        size="medium"
                        disabled={disabled}
                        label={t('claims.columns.description')}
                        value={description}
                        error={Boolean(errors.description)}
                        helperText={errors.description}
                        onChange={(event) => {
                            setDescription(event.target.value)
                            setErrors((current) => ({ ...current, description: undefined }))
                        }}
                    />
                </Grid>
                {error ? (
                    <Grid size={12}>
                        <Typography variant="body2" color="error" sx={{ whiteSpace: 'pre-line' }}>
                            {error}
                        </Typography>
                    </Grid>
                ) : null}
                <Grid size={12}>
                    <Button type="submit" variant="contained" disabled={disabled}>
                        {t('claims.submitReview')}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    )
}
