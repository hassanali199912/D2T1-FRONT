import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

export default function MainContent() {
    return (
        <Box component="main" sx={{ flex: 1, p: 3 }}>
            <Outlet />
        </Box>
    )
}
