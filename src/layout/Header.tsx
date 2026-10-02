import { Box, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { useTranslation } from '../language/index.ts'
import { navItems, paths } from '../routes/paths.ts'

export default function Header() {
    const { pathname } = useLocation()
    const { t } = useTranslation()
    const item = navItems.find((entry) => {
        if (entry.to === pathname) return true
        const nested = entry.to === paths.approvals || entry.to === paths.claims
        return nested && pathname.startsWith(`${entry.to}/`)
    })

    return (
        <Box
            component="header"
            sx={{
                flexShrink: 0,
                px: 3,
                py: 2,
                bgcolor: 'background.paper',
                borderBottom: 1,
                borderColor: 'divider',
            }}
        >
            <Typography variant="h3">{item ? t(item.labelKey) : ''}</Typography>
        </Box>
    )
}
