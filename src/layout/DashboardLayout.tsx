import { Box } from '@mui/material'
import Header from './Header.tsx'
import MainContent from './MainContent.tsx'
import Sidebar from './Sidebar.tsx'

export default function DashboardLayout() {
    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <Sidebar />
            <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', minWidth: 0, minHeight: 0, overflow: 'hidden' }}>
                <Header />
                <MainContent />
            </Box>
        </Box>
    )
}
