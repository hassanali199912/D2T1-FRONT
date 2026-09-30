import { Box } from '@mui/material'
import Logo from './Logo.tsx'
import NavLinks from './NavLinks.tsx'

export default function Sidebar() {
    return (
        <Box
            component="aside"
            sx={{
                width: 240,
                flexShrink: 0,
                bgcolor: 'background.paper',
                borderInlineEnd: 1,
                borderColor: 'divider',
            }}
        >
            <Logo />
            <NavLinks />
        </Box>
    )
}
