import { Typography } from '@mui/material'
import { useTranslation } from '../language/index.ts'

export default function DashboardPage() {
    const { t } = useTranslation()

    return <Typography variant="h2">{t('welcome')}</Typography>
}
