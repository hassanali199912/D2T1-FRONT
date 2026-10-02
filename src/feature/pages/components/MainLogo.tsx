import { Box } from '@mui/material'

export default function MainLogo() {
    return (
        <Box
            sx={{
                width: 48,
                height: 48,
                flexShrink: 0,
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                fontWeight: 700,
                letterSpacing: 0.4,
            }}
        >
            ITI
        </Box>
    )
}
