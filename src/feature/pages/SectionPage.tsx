import { Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { useTranslation } from '../../language/index.ts'
import { navItems } from '../../routes/paths.ts'

export default function SectionPage() {
    const { pathname } = useLocation()
    const { t } = useTranslation()
    const item = navItems.find((entry) => entry.to === pathname)

    return <Typography variant="h2">{item ? t(item.labelKey) : ''}</Typography>
}
