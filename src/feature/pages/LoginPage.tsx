import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box,
    Button,
    Divider,
    InputAdornment,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { useAuth } from '../../provider/AuthProvider.tsx'
import { paths } from '../../routes/paths.ts'
import { useTranslation } from '../../language/index.ts'
import MainLogo from './components/MainLogo.tsx'

type FieldErrors = {
    email?: string
    password?: string
}

const demoAccounts = {
    admin: { email: 'admin@example.com', password: 'password1' },
    employee: { email: 'employee@example.com', password: 'password1' },
} as const

export default function LoginPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [pending, setPending] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [errors, setErrors] = useState<FieldErrors>({})

    async function enter(nextEmail: string, nextPassword: string) {
        setSubmitError('')
        setPending(true)
        try {
            await login(nextEmail, nextPassword)
            void navigate(paths.dashboard)
        } catch {
            setSubmitError(t('login.failed'))
        } finally {
            setPending(false)
        }
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const nextErrors: FieldErrors = {}
        const trimmedEmail = email.trim()

        if (!trimmedEmail) {
            nextErrors.email = t('login.emailRequired')
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            nextErrors.email = t('login.emailInvalid')
        }

        if (!password) {
            nextErrors.password = t('login.passwordRequired')
        }

        setErrors(nextErrors)
        if (nextErrors.email || nextErrors.password) return

        void enter(trimmedEmail, password)
    }

    function enterAs(account: { email: string; password: string }) {
        setEmail(account.email)
        setPassword(account.password)
        setErrors({})
        void enter(account.email, account.password)
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'grid',
                placeItems: 'center',
                px: 2,
                py: 4,
                background: (muiTheme) =>
                    `radial-gradient(900px 420px at 50% -8%, ${muiTheme.palette.primary.light}33, transparent 70%), ${muiTheme.palette.background.default}`,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    maxWidth: 440,
                    overflow: 'hidden',
                    border: 1,
                    borderColor: 'divider',
                    boxShadow: '0 18px 50px rgba(30, 58, 95, 0.1)',
                }}
            >
                <Box sx={{ height: 6, bgcolor: 'primary.main' }} />
                <Stack spacing={3} sx={{ p: { xs: 3, sm: 4 } }}>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                        <MainLogo />
                        <Box sx={{
                            paddingInlineStart:1
                        }}>
                            <Typography variant="h4">{t('login.title')}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {t('login.subtitle')}
                            </Typography>
                        </Box>
                    </Stack>

                    <Box component="form" noValidate onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <TextField
                                fullWidth
                                size="medium"
                                type="email"
                                name="email"
                                autoComplete="email"
                                label={t('login.email')}
                                value={email}
                                error={Boolean(errors.email)}
                                helperText={errors.email}
                                onChange={(event) => {
                                    setEmail(event.target.value)
                                    setErrors((current) => ({ ...current, email: undefined }))
                                }}
                            />
                            <TextField
                                fullWidth
                                size="medium"
                                name="password"
                                autoComplete="current-password"
                                label={t('login.password')}
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                error={Boolean(errors.password)}
                                helperText={errors.password}
                                onChange={(event) => {
                                    setPassword(event.target.value)
                                    setErrors((current) => ({ ...current, password: undefined }))
                                }}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Button
                                                    type="button"
                                                    size="small"
                                                    onClick={() => setShowPassword((visible) => !visible)}
                                                    sx={{ minWidth: 0, px: 1 }}
                                                >
                                                    {showPassword ? t('login.hide') : t('login.show')}
                                                </Button>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                            {submitError ? (
                                <Typography variant="body2" color="error">
                                    {submitError}
                                </Typography>
                            ) : null}
                            <Button type="submit" variant="contained" size="large" fullWidth disabled={pending}>
                                {t('login.submit')}
                            </Button>
                        </Stack>
                    </Box>

                    <Divider>
                        <Typography variant="body2" color="text.secondary">
                            {t('login.or')}
                        </Typography>
                    </Divider>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={() => enterAs(demoAccounts.admin)}
                            disabled={pending}
                            sx={{
                                flex: 1,
                                py: 1.5,
                                px: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                gap: 0.25,
                                borderColor: 'divider',
                                color: 'text.primary',
                                '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.light', color: 'primary.contrastText' },
                            }}
                        >
                            <Typography component="span" variant="body1" sx={{ fontWeight: 700 }}>
                                {t('login.admin')}
                            </Typography>
                            <Typography component="span" variant="body2" sx={{ opacity: 0.8 }}>
                                {demoAccounts.admin.email}
                            </Typography>
                        </Button>
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={() => enterAs(demoAccounts.employee)}
                            disabled={pending}
                            sx={{
                                flex: 1,
                                py: 1.5,
                                px: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                gap: 0.25,
                                borderColor: 'divider',
                                color: 'text.primary',
                                '&:hover': { borderColor: 'secondary.main', bgcolor: 'secondary.main', color: 'secondary.contrastText' },
                            }}
                        >
                            <Typography component="span" variant="body1" sx={{ fontWeight: 700 }}>
                                {t('login.employees')}
                            </Typography>
                            <Typography component="span" variant="body2" sx={{ opacity: 0.8 }}>
                                {demoAccounts.employee.email}
                            </Typography>
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    )
}
