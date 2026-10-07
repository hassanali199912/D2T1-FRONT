import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from '../../language/index.ts'
import DashboardTables from './dashboard/DashboardTables.tsx'
import FeatureCards from './dashboard/FeatureCards.tsx'

export default function DashboardPage() {
    const { t } = useTranslation()

    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h4">{t('welcome')}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {t('dashboard.description')}
                </Typography>
            </Box>
            <FeatureCards />
            <DashboardTables />
        </Stack>
    )
}
