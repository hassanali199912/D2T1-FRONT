import { useState, type DragEvent, type FormEvent } from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material'
import { useTranslation } from '../../../language/index.ts'
import { isDocxFile, nameFromDocx } from './library.ts'
import type { DocumentType } from './types.ts'

type UploadDocxDialogProps = {
    open: boolean
    onClose: () => void
    onUpload: (document: { name: string; type: DocumentType }) => void
}

type FieldErrors = {
    file?: string
    name?: string
}

export default function UploadDocxDialog({ open, onClose, onUpload }: UploadDocxDialogProps) {
    const { t, i18n } = useTranslation()
    const [file, setFile] = useState<File | null>(null)
    const [name, setName] = useState('')
    const [nameEdited, setNameEdited] = useState(false)
    const [type, setType] = useState<DocumentType>(i18n.language.startsWith('ar') ? 'ar' : 'en')
    const [dragOver, setDragOver] = useState(false)
    const [errors, setErrors] = useState<FieldErrors>({})

    function reset() {
        setFile(null)
        setName('')
        setNameEdited(false)
        setType(i18n.language.startsWith('ar') ? 'ar' : 'en')
        setDragOver(false)
        setErrors({})
    }

    function close() {
        reset()
        onClose()
    }

    function chooseFile(next: File | undefined) {
        if (!next) return
        if (!isDocxFile(next)) {
            setFile(null)
            setErrors((current) => ({ ...current, file: t('documents.fileInvalid') }))
            return
        }
        setFile(next)
        if (!nameEdited) {
            setName(nameFromDocx(next))
            setErrors((current) => ({ ...current, file: undefined, name: undefined }))
            return
        }
        setErrors((current) => ({ ...current, file: undefined }))
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const nextErrors: FieldErrors = {}
        const trimmed = name.trim()

        if (!file) nextErrors.file = t('documents.fileRequired')
        if (!trimmed) nextErrors.name = t('documents.nameRequired')

        setErrors(nextErrors)
        if (nextErrors.file || nextErrors.name) return

        onUpload({ name: trimmed, type })
        close()
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
                                cursor: 'pointer',
                                textAlign: 'center',
                            }}
                        >
                            <input
                                hidden
                                type="file"
                                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
                            label={t('documents.columns.name')}
                            value={name}
                            error={Boolean(errors.name)}
                            helperText={errors.name}
                            onChange={(event) => {
                                setNameEdited(true)
                                setName(event.target.value)
                                setErrors((current) => ({ ...current, name: undefined }))
                            }}
                        />
                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {t('documents.columns.type')}
                            </Typography>
                            <ToggleButtonGroup
                                exclusive
                                fullWidth
                                color="primary"
                                value={type}
                                onChange={(_event, value: DocumentType | null) => {
                                    if (value) setType(value)
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
                                <ToggleButton value="ar">{t('documents.types.ar')}</ToggleButton>
                                <ToggleButton value="en">{t('documents.types.en')}</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button type="button" onClick={close}>
                        {t('documents.cancel')}
                    </Button>
                    <Button type="submit" variant="contained">
                        {t('documents.upload')}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}
