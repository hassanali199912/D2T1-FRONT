import { Box } from '@mui/material'
import MainLogo from '../feature/pages/components/MainLogo.tsx'
import LanguageSwitch from '../feature/pages/components/LanguageSwitch.tsx'

export default function Logo() {
    return (
        <Box sx={{ px: 2, py: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between" }} >
            <MainLogo />
            <LanguageSwitch />
        </Box>
    )
}
