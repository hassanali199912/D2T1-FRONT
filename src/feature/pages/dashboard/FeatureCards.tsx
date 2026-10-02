import { Box, Card, CardActionArea, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'
import NavIcon from '../../../layout/NavIcon.tsx'
import { useTranslation } from '../../../language/index.ts'
import { navItems, paths } from '../../../routes/paths.ts'

const features = navItems.filter((item) => item.to !== paths.dashboard)

const tones = {
    [paths.documents]: 'primary',
    [paths.askAnswers]: 'secondary',
    [paths.claims]: 'info',
    [paths.approvals]: 'success',
} as const

const hints = {
    [paths.documents]: 'dashboard.hints.documents',
    [paths.askAnswers]: 'dashboard.hints.askAnswers',
    [paths.claims]: 'dashboard.hints.claims',
    [paths.approvals]: 'dashboard.hints.approvals',
} as const

export default function FeatureCards() {
    const { t } = useTranslation()

    return (
        <Box
            sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
            }}
        >
            {features.map((feature) => {
                const tone = tones[feature.to]
                return (
                    <Card key={feature.to} sx={{ height: '100%' }}>
                        <CardActionArea
                            component={RouterLink}
                            to={feature.to}
                            sx={{ height: '100%', p: 2, alignItems: 'stretch' }}
                        >
                            <Stack spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                                <Box
                                    sx={{
                                        width: 42,
                                        height: 42,
                                        borderRadius: 2,
                                        display: 'grid',
                                        placeItems: 'center',
                                        color: `${tone}.main`,
                                        bgcolor: (muiTheme) => alpha(muiTheme.palette[tone].main, 0.12),
                                    }}
                                >
                                    <NavIcon to={feature.to} />
                                </Box>
                                <Box>
                                    <Typography variant="h6">{t(feature.labelKey)}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t(hints[feature.to])}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardActionArea>
                    </Card>
                )
            })}
        </Box>
    )
}
