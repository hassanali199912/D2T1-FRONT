import { Box, Button, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import ClaimsTable from './claims/ClaimsTable.tsx'
import { useClaims } from './claims/store.ts'
import { useTranslation } from '../../language/index.ts'
import { paths } from '../../routes/paths.ts'

export default function ClaimsPage() {
    const { t } = useTranslation()
    const rows = useClaims()

    return (
        <Stack spacing={2.5}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h4">{t('claims.listTitle')}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {t('claims.description')}
                    </Typography>
                </Box>
                <Button component={RouterLink} to={paths.claimNew} variant="contained">
                    {t('claims.add')}
                </Button>
            </Stack>
            <ClaimsTable rows={rows} />
        </Stack>
    )
}
