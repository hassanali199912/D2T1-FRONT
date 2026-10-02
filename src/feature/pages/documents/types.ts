export const documentTypes = ['ar', 'en'] as const
export type DocumentType = (typeof documentTypes)[number]

export const documentStatuses = ['indexed', 'pending', 'error'] as const
export type DocumentStatus = (typeof documentStatuses)[number]

export type LibraryDocument = {
    id: string
    name: string
    policyDate: string
    type: DocumentType
    status: DocumentStatus
}
