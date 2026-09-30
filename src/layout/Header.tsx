import { Box, Typography } from '@mui/material'

export default function Header() {
    return (
        <Box
            component="header"
            sx={{
                px: 3,
                py: 2,
                bgcolor: 'background.paper',
                borderBottom: 1,
                borderColor: 'divider',
            }}
        >
            <Typography variant="h3">Dashboard</Typography>
        </Box>
    )
}
