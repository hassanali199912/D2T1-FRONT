export const policyTypes = ['HEALTH', 'MOTOR', 'PROPERTY'] as const
export type PolicyType = (typeof policyTypes)[number]

export const policyLanguages = ['ar', 'en'] as const
export type PolicyLanguage = (typeof policyLanguages)[number]

export const policyStatuses = ['UPLOADED', 'PROCESSING', 'INDEXED', 'FAILED'] as const
export type PolicyStatus = (typeof policyStatuses)[number]

export const policyStages = ['EXTRACTING', 'CLEANING', 'CHUNKING', 'EMBEDDING', 'INDEXING'] as const
export type PolicyStage = (typeof policyStages)[number]

export type Policy = {
    id: string
    name: string
    type: PolicyType
    description: string | null
    version: string
    language: PolicyLanguage
    effectiveFrom: string
    effectiveTo: string | null
    documentUrl: string
    status: PolicyStatus
    currentStage: PolicyStage | null
    errorCode: string | null
    errorMessage: string | null
}

export type CreatePolicyInput = {
    document: File
    name: string
    type: PolicyType
    version: string
    language: PolicyLanguage
    effectiveFrom: string
    description?: string
    effectiveTo?: string
}
