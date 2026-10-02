import { useState } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import DocumentsTable from './documents/DocumentsTable.tsx'
import { initialDocuments } from './documents/library.ts'
import UploadDocxDialog from './documents/UploadDocxDialog.tsx'
import type { DocumentType, LibraryDocument } from './documents/types.ts'
import { useTranslation } from '../../language/index.ts'

export default function DocumentsPage() {
    const { t } = useTranslation()
    const [rows, setRows] = useState<LibraryDocument[]>(initialDocuments)
    const [uploadOpen, setUploadOpen] = useState(false)

    function addDocument(document: { name: string; type: DocumentType }) {
        setRows((current) => [
            {
                id: crypto.randomUUID(),
                name: document.name,
                policyDate: new Date().toISOString().slice(0, 10),
                type: document.type,
                status: 'pending',
            },
            ...current,
        ])
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
            <DocumentsTable rows={rows} />
            <UploadDocxDialog open={uploadOpen} onClose={() => setUploadOpen(false)} onUpload={addDocument} />
        </Stack>
    )
}
