import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
import { queryClient } from '../../config/queryBase/queryClient.ts'
import { useTranslation } from '../../language/index.ts'
import { createPolicy, deletePolicy, listPolicies, policiesQueryKey, policyErrorMessage, policyStillIndexing } from '../policies/api.ts'
import type { CreatePolicyInput } from '../policies/types.ts'
import DocumentsTable from './documents/DocumentsTable.tsx'
import UploadDocxDialog from './documents/UploadDocxDialog.tsx'

export default function DocumentsPage() {
    const { t } = useTranslation()
    const [uploadOpen, setUploadOpen] = useState(false)
    const policies = useQuery({
        queryKey: policiesQueryKey,
        queryFn: listPolicies,
        refetchInterval: (query) => (query.state.data?.some(policyStillIndexing) ? 10_000 : false),
    })
    const remove = useMutation({
        mutationFn: deletePolicy,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: policiesQueryKey })
        },
    })

    async function upload(input: CreatePolicyInput) {
        await createPolicy(input)
        await queryClient.invalidateQueries({ queryKey: policiesQueryKey })
    }

    function requestDelete(id: string) {
        if (!window.confirm(t('documents.deleteConfirm'))) return
        remove.mutate(id)
    }

    return (
        <Stack spacing={2.5}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h4">{t('documents.listTitle')}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {t('documents.description')}
                    </Typography>
                </Box>
                <Button variant="contained" onClick={() => setUploadOpen(true)}>
                    {t('documents.add')}
                </Button>
            </Stack>
            {policies.isPending ? (
                <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
                    <CircularProgress />
                </Box>
            ) : null}
            {policies.isError ? (
                <Typography variant="body2" color="error">
                    {policyErrorMessage(policies.error) || t('documents.loadFailed')}
                </Typography>
            ) : null}
            {remove.isError ? (
                <Typography variant="body2" color="error">
                    {policyErrorMessage(remove.error) || t('documents.deleteFailed')}
                </Typography>
            ) : null}
            {policies.data ? (
                <DocumentsTable
                    rows={policies.data}
                    deletingId={remove.isPending ? remove.variables : null}
                    onDelete={requestDelete}
                />
            ) : null}
            <UploadDocxDialog open={uploadOpen} onClose={() => setUploadOpen(false)} onUpload={upload} />
        </Stack>
    )
}
