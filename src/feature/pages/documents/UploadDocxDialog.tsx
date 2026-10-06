import { useState, type DragEvent, type FormEvent } from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material'
import { useTranslation } from '../../../language/index.ts'
import { policyErrorMessage } from '../../policies/api.ts'
import { policyLanguages, policyTypes, type CreatePolicyInput, type PolicyLanguage, type PolicyType } from '../../policies/types.ts'
import { isPolicyFile, isPolicyFileTooLarge, nameFromPolicyFile } from './library.ts'

type UploadDocxDialogProps = {
    open: boolean
    onClose: () => void
    onUpload: (input: CreatePolicyInput) => Promise<void>
}

type FieldErrors = {
    file?: string
    name?: string
    version?: string
    effectiveFrom?: string
    form?: string
}

function today() {
    return new Date().toISOString().slice(0, 10)
}

export default function UploadDocxDialog({ open, onClose, onUpload }: UploadDocxDialogProps) {
    const { t, i18n } = useTranslation()
    const [file, setFile] = useState<File | null>(null)
    const [name, setName] = useState('')
    const [nameEdited, setNameEdited] = useState(false)
    const [type, setType] = useState<PolicyType>('HEALTH')
    const [version, setVersion] = useState('1.0')
    const [language, setLanguage] = useState<PolicyLanguage>(i18n.language.startsWith('ar') ? 'ar' : 'en')
    const [effectiveFrom, setEffectiveFrom] = useState(today)
    const [effectiveTo, setEffectiveTo] = useState('')
    const [description, setDescription] = useState('')
    const [dragOver, setDragOver] = useState(false)
    const [pending, setPending] = useState(false)
    const [errors, setErrors] = useState<FieldErrors>({})

    function reset() {
        setFile(null)
        setName('')
        setNameEdited(false)
        setType('HEALTH')
        setVersion('1.0')
        setLanguage(i18n.language.startsWith('ar') ? 'ar' : 'en')
        setEffectiveFrom(today())
        setEffectiveTo('')
        setDescription('')
        setDragOver(false)
        setErrors({})
    }

    function close() {
        if (pending) return
        reset()
        onClose()
    }

    function chooseFile(next: File | undefined) {
        if (!next) return
        if (!isPolicyFile(next)) {
            setFile(null)
            setErrors((current) => ({ ...current, file: t('documents.fileInvalid') }))
            return
        }
        if (isPolicyFileTooLarge(next)) {
            setFile(null)
            setErrors((current) => ({ ...current, file: t('documents.fileTooLarge') }))
            return
        }
        setFile(next)
        if (!nameEdited) {
            setName(nameFromPolicyFile(next).slice(0, 160))
            setErrors((current) => ({ ...current, file: undefined, name: undefined }))
            return
        }
        setErrors((current) => ({ ...current, file: undefined }))
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const nextErrors: FieldErrors = {}
        const trimmed = name.trim()
        const trimmedVersion = version.trim()

        if (!file) nextErrors.file = t('documents.fileRequired')
        if (!trimmed) nextErrors.name = t('documents.nameRequired')
        else if (trimmed.length > 160) nextErrors.name = t('documents.nameTooLong')
        if (!trimmedVersion) nextErrors.version = t('documents.versionRequired')
        else if (trimmedVersion.length > 20) nextErrors.version = t('documents.versionTooLong')
        if (!effectiveFrom) nextErrors.effectiveFrom = t('documents.effectiveFromRequired')

        setErrors(nextErrors)
        if (nextErrors.file || nextErrors.name || nextErrors.version || nextErrors.effectiveFrom || !file) return

        setPending(true)
        try {
            await onUpload({
                document: file,
                name: trimmed,
                type,
                version: trimmedVersion,
                language,
                effectiveFrom,
                description: description.trim() || undefined,
                effectiveTo: effectiveTo || undefined,
            })
            setPending(false)
            reset()
            onClose()
        } catch (error) {
            setErrors((current) => ({
                ...current,
                form: policyErrorMessage(error) || t('documents.uploadFailed'),
            }))
            setPending(false)
        }
    }

    function handleDrop(event: DragEvent<HTMLLabelElement>) {
        event.preventDefault()
        setDragOver(false)
        chooseFile(event.dataTransfer.files[0])
    }

    return (
        <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
            <DialogTitle>{t('documents.uploadTitle')}</DialogTitle>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <DialogContent>
                    <Stack spacing={2.5}>
                        <Box
                            component="label"
                            onDragOver={(event) => {
                                event.preventDefault()
                                setDragOver(true)
                            }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            sx={{
                                display: 'grid',
                                placeItems: 'center',
                                gap: 0.5,
                                px: 2,
                                py: 3.5,
                                borderRadius: 2,
                                border: '1.5px dashed',
                                borderColor: errors.file ? 'error.main' : dragOver ? 'primary.main' : 'divider',
                                bgcolor: dragOver ? 'action.hover' : 'background.default',
                                cursor: pending ? 'default' : 'pointer',
                                textAlign: 'center',
                                pointerEvents: pending ? 'none' : 'auto',
                            }}
                        >
                            <input
                                hidden
                                type="file"
                                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                onChange={(event) => {
                                    chooseFile(event.target.files?.[0])
                                    event.target.value = ''
                                }}
                            />
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {file ? file.name : t('documents.dropHint')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {t('documents.dropDetail')}
                            </Typography>
                        </Box>
                        {errors.file ? (
                            <Typography variant="body2" color="error" sx={{ mt: -1.5 }}>
                                {errors.file}
                            </Typography>
                        ) : null}
                        <TextField
                            fullWidth
                            size="medium"
                            disabled={pending}
                            label={t('documents.columns.name')}
                            value={name}
                            error={Boolean(errors.name)}
                            helperText={errors.name}
                            slotProps={{ htmlInput: { maxLength: 160 } }}
                            onChange={(event) => {
                                setNameEdited(true)
                                setName(event.target.value)
                                setErrors((current) => ({ ...current, name: undefined, form: undefined }))
                            }}
                        />
                        <TextField
                            select
                            fullWidth
                            size="medium"
                            disabled={pending}
                            label={t('documents.columns.type')}
                            value={type}
                            onChange={(event) => setType(event.target.value as PolicyType)}
                        >
                            {policyTypes.map((item) => (
                                <MenuItem key={item} value={item}>
                                    {t(`documents.types.${item}`)}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            fullWidth
                            size="medium"
                            disabled={pending}
                            label={t('documents.fields.version')}
                            value={version}
                            error={Boolean(errors.version)}
                            helperText={errors.version}
                            slotProps={{ htmlInput: { maxLength: 20 } }}
                            onChange={(event) => {
                                setVersion(event.target.value)
                                setErrors((current) => ({ ...current, version: undefined, form: undefined }))
                            }}
                        />
                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {t('documents.fields.language')}
                            </Typography>
                            <ToggleButtonGroup
                                exclusive
                                fullWidth
                                color="primary"
                                disabled={pending}
                                value={language}
                                onChange={(_event, value: PolicyLanguage | null) => {
                                    if (value) setLanguage(value)
                                }}
                                sx={{
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
                                }}
                            >
                                {policyLanguages.map((item) => (
                                    <ToggleButton key={item} value={item}>
                                        {t(`documents.languages.${item}`)}
                                    </ToggleButton>
                                ))}
                            </ToggleButtonGroup>
                        </Box>
                        <TextField
                            fullWidth
                            size="medium"
                            type="date"
                            disabled={pending}
                            label={t('documents.fields.effectiveFrom')}
                            value={effectiveFrom}
                            error={Boolean(errors.effectiveFrom)}
                            helperText={errors.effectiveFrom}
                            slotProps={{ inputLabel: { shrink: true } }}
                            onChange={(event) => {
                                setEffectiveFrom(event.target.value)
                                setErrors((current) => ({ ...current, effectiveFrom: undefined }))
                            }}
                        />
                        <TextField
                            fullWidth
                            size="medium"
                            type="date"
                            disabled={pending}
                            label={t('documents.fields.effectiveTo')}
                            value={effectiveTo}
                            slotProps={{ inputLabel: { shrink: true } }}
                            onChange={(event) => setEffectiveTo(event.target.value)}
                        />
                        <TextField
                            fullWidth
                            size="medium"
                            multiline
                            minRows={2}
                            disabled={pending}
                            label={t('documents.fields.description')}
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                        />
                        {errors.form ? (
                            <Typography variant="body2" color="error" sx={{ whiteSpace: 'pre-line' }}>
                                {errors.form}
                            </Typography>
                        ) : null}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button type="button" disabled={pending} onClick={close}>
                        {t('documents.cancel')}
                    </Button>
                    <Button type="submit" variant="contained" disabled={pending}>
                        {t('documents.upload')}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}
