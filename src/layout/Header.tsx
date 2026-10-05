import { Avatar, Box, Button, Stack, Typography } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from '../language/index.ts'
import { navItems, paths } from '../routes/paths.ts'

type Session = {
    email: string
    role: string
}

function readSession(): Session | null {
    const raw = sessionStorage.getItem('session')
    if (!raw) return null
    try {
        const parsed = JSON.parse(raw) as Partial<Session>
        if (!parsed.email) return null
        return { email: parsed.email, role: parsed.role ?? 'user' }
    } catch {
        return null
    }
}

function nameFromEmail(email: string) {
    const local = email.split('@')[0] ?? email
    return local
        .split(/[._-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
}

function initials(name: string) {
    const letters = name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0))
    return letters.join('').toUpperCase()
}

export default function Header() {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const item = navItems.find((entry) => {
        if (entry.to === pathname) return true
        const nested = entry.to === paths.approvals || entry.to === paths.claims
        return nested && pathname.startsWith(`${entry.to}/`)
    })
    const session = readSession()
    const name = !session
        ? t('header.guest')
        : session.role === 'admin'
            ? t('login.admin')
            : session.role === 'employee'
                ? t('header.employee')
                : nameFromEmail(session.email)

    function logout() {
        sessionStorage.removeItem('session')
        void navigate(paths.login)
    }

    return (
        <Box
            component="header"
            sx={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                px: 3,
                py: 2,
                bgcolor: 'background.paper',
                borderBottom: 1,
                borderColor: 'divider',
            }}
        >
            <Typography variant="h3">{item ? t(item.labelKey) : ''}</Typography>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', }}>
                <Box sx={{
                    display: "flex", gap: 2, alignItems: "center",
                    paddingInline: 2
                }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 14 }}>
                        {initials(name)}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {name}
                    </Typography>
                </Box>
                <Button variant="outlined" size="small" onClick={logout}>
                    {t('header.logout')}
                </Button>

            </Stack>
        </Box>
    )
}
