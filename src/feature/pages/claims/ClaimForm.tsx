import { useState, type FormEvent } from 'react'
import { Box, Button, Grid, MenuItem, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useTranslation } from '../../../language/index.ts'
import { claimTypes, type ClaimType, type DescriptionLanguage } from './types.ts'

export type ClaimDraft = {
    policyNumber: string
    incidentDate: string
    type: ClaimType
    amount: number
    description: string
    language: DescriptionLanguage
}

type ClaimFormProps = {
    disabled?: boolean
    onSubmit: (claim: ClaimDraft) => void
}

type FieldErrors = {
    policyNumber?: string
    incidentDate?: string
    type?: string
    amount?: string
    description?: string
}

const toggleSx = {
    gap: 1.5,
    p: 1,
    borderRadius: 2,
    bgcolor: 'background.default',
    '& .MuiToggleButtonGroup-grouped': {
        margin: 0,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        '&:not(:first-of-type)': {
            marginInlineStart: 0,
            borderInlineStart: '1px solid',
            borderColor: 'divider',
        },
    },
}

export default function ClaimForm({ disabled = false, onSubmit }: ClaimFormProps) {
    const { t, i18n } = useTranslation()
    const [policyNumber, setPolicyNumber] = useState('')
    const [incidentDate, setIncidentDate] = useState('')
    const [type, setType] = useState<ClaimType | ''>('')
    const [amount, setAmount] = useState('')
    const [description, setDescription] = useState('')
    const [language, setLanguage] = useState<DescriptionLanguage>(i18n.language.startsWith('ar') ? 'ar' : 'en')
    const [errors, setErrors] = useState<FieldErrors>({})

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (disabled) return

        const nextErrors: FieldErrors = {}
        const trimmedPolicy = policyNumber.trim()
        const trimmedDescription = description.trim()
        const parsedAmount = Number(amount)

        if (!trimmedPolicy) nextErrors.policyNumber = t('claims.policyRequired')
        if (!incidentDate) nextErrors.incidentDate = t('claims.dateRequired')
        if (!type) nextErrors.type = t('claims.typeRequired')
        if (!amount.trim()) nextErrors.amount = t('claims.amountRequired')
        else if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) nextErrors.amount = t('claims.amountInvalid')
        if (!trimmedDescription) nextErrors.description = t('claims.descriptionRequired')

        setErrors(nextErrors)
        if (Object.keys(nextErrors).length > 0 || !type) return

        onSubmit({
            policyNumber: trimmedPolicy,
            incidentDate,
            type,
            amount: parsedAmount,
            description: trimmedDescription,
            language,
        })
    }

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, lg: 6 }}>
                <TextField
                    fullWidth
                    size="medium"
                    disabled={disabled}
                    label={t('claims.columns.policyNumber')}
                    value={policyNumber}
                    error={Boolean(errors.policyNumber)}
                    helperText={errors.policyNumber}
                    onChange={(event) => {
                        setPolicyNumber(event.target.value)
                        setErrors((current) => ({ ...current, policyNumber: undefined }))
                    }}
                />
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
                    slotProps={{ inputLabel: { shrink: true } }}
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
                    disabled={disabled}
                    label={t('claims.columns.type')}
                    value={type}
                    error={Boolean(errors.type)}
                    helperText={errors.type}
                    onChange={(event) => {
                        setType(event.target.value as ClaimType)
                        setErrors((current) => ({ ...current, type: undefined }))
                    }}
                >
                    {claimTypes.map((claimType) => (
                        <MenuItem key={claimType} value={claimType}>
                            {t(`claims.types.${claimType}`)}
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
                    slotProps={{ htmlInput: { min: 1, step: 1 } }}
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
                <Grid size={{ xs: 12, lg: 6 }}>
                <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {t('claims.languageLabel')}
                    </Typography>
                    <ToggleButtonGroup
                        exclusive
                        fullWidth
                        color="primary"
                        disabled={disabled}
                        value={language}
                        onChange={(_event, value: DescriptionLanguage | null) => {
                            if (value) setLanguage(value)
                        }}
                        sx={toggleSx}
                    >
                        <ToggleButton value="ar">{t('claims.languages.ar')}</ToggleButton>
                        <ToggleButton value="en">{t('claims.languages.en')}</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <Button type="submit" variant="contained" disabled={disabled}>
                    {t('claims.submitReview')}
                </Button>
                </Grid>
            </Grid>
        </Box>
    )
}
