import { List, ListItemButton, ListItemText } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { NavLink } from 'react-router-dom'
import { useTranslation } from '../language/index.ts'
import { navItems, paths } from '../routes/paths.ts'
import NavIcon from './NavIcon.tsx'

export default function NavLinks() {
    const { t } = useTranslation()

    return (
        <List component="nav" sx={{ px: 1.5, py: 1 }}>
            {navItems.map((item) => (
                <ListItemButton
                    key={item.to}
                    component={NavLink}
                    to={item.to}
                    end={item.to !== paths.approvals && item.to !== paths.claims}
                    sx={{
                        position: 'relative',
                        borderRadius: 2,
                        mb: 0.5,
                        px: 1.5,
                        py: 1.15,
                        gap: 1.25,
                        color: 'text.secondary',
                        '&:hover': {
                            color: 'text.primary',
                            bgcolor: (muiTheme) => alpha(muiTheme.palette.primary.main, 0.06),
                        },
                        '&.active': {
                            color: 'primary.main',
                            bgcolor: (muiTheme) => alpha(muiTheme.palette.primary.main, 0.1),
                            '&:hover': {
                                bgcolor: (muiTheme) => alpha(muiTheme.palette.primary.main, 0.14),
                            },
                        },
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            insetInlineStart: 6,
                            top: 10,
                            bottom: 10,
                            width: 3,
                            borderRadius: 99,
                            bgcolor: 'transparent',
                        },
                        '&.active::before': {
                            bgcolor: 'primary.main',
                        },
                    }}
                >
                    <NavIcon to={item.to} />
                    <ListItemText
                        primary={t(item.labelKey)}
                        slotProps={{
                            primary: {
                                variant: 'body2',
                                sx: { fontWeight: 600, lineHeight: 1.45 },
                            },
                        }}
                    />
                </ListItemButton>
            ))}
        </List>
    )
}
