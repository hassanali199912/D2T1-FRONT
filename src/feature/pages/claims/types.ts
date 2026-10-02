export const claimTypes = ['accident', 'medical', 'theft', 'fire', 'other'] as const
export type ClaimType = (typeof claimTypes)[number]

export const claimStatuses = ['draft', 'running', 'awaiting_approval', 'approved', 'rejected', 'failed'] as const
export type ClaimStatus = (typeof claimStatuses)[number]

export const descriptionLanguages = ['ar', 'en'] as const
export type DescriptionLanguage = (typeof descriptionLanguages)[number]

export type Claim = {
    id: string
    policyNumber: string
    incidentDate: string
    type: ClaimType
    amount: number
    description: string
    language: DescriptionLanguage
    status: ClaimStatus
}
