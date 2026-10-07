import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { CLAIMS_PAGE_SIZE, claimErrorMessage, claimsQueryKey, listClaims } from '../claims/api.ts'
import { useTranslation } from '../../language/index.ts'
import { paths } from '../../routes/paths.ts'
import ClaimsTable from './claims/ClaimsTable.tsx'

export default function ClaimsPage() {
    const { t } = useTranslation()
    const [page, setPage] = useState(1)
    const claims = useQuery({
        queryKey: [...claimsQueryKey, page],
        queryFn: () => listClaims(page),
    })
    const total = claims.data?.total ?? 0
    const limit = claims.data?.limit ?? CLAIMS_PAGE_SIZE
    const pages = Math.max(1, Math.ceil(total / limit))

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
            {claims.isPending ? (
                <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
                    <CircularProgress />
                </Box>
            ) : null}
            {claims.isError ? (
                <Typography variant="body2" color="error">
                    {claimErrorMessage(claims.error) || t('claims.loadFailed')}
                </Typography>
            ) : null}
            {claims.data ? (
                <>
                    <ClaimsTable rows={claims.data.items} />
                    {total > limit ? (
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Typography variant="body2" color="text.secondary">
                                {t('claims.page', { page, pages })}
                            </Typography>
                            <Button disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
                                {t('claims.previous')}
                            </Button>
                            <Button disabled={page >= pages} onClick={() => setPage((current) => current + 1)}>
                                {t('claims.next')}
                            </Button>
                        </Stack>
                    ) : null}
                </>
            ) : null}
        </Stack>
    )
}
