export const claimTypeValues = ['COLLISION', 'THEFT', 'FIRE', 'OTHER'] as const
export type ClaimTypeValue = (typeof claimTypeValues)[number]

export const claimStatuses = ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'] as const
export type ClaimStatus = (typeof claimStatuses)[number]

export const analysisStatuses = ['PENDING', 'ANALYZING', 'COMPLETED', 'INSUFFICIENT_EVIDENCE', 'FAILED'] as const
export type AnalysisStatus = (typeof analysisStatuses)[number]

export const analysisDecisions = ['APPROVE', 'REJECT', 'REVIEW'] as const
export type AnalysisDecision = (typeof analysisDecisions)[number]

export type ClaimTypeOption = {
    value: ClaimTypeValue
    label: string
}

export type ClaimPolicySummary = {
    id: string
    name: string
    version: string
    type: string
    language: string
    effectiveFrom: string
    effectiveTo: string | null
}

export type ClaimUser = {
    id: string
    name: string
    email: string
    role: string
}

export type ClaimView = {
    id: string
    claimNumber: string
    incidentDate: string
    claimType: ClaimTypeValue
    claimedAmount: string
    description: string
    status: ClaimStatus
    createdAt: string
    updatedAt: string
    policy: ClaimPolicySummary
    createdBy: ClaimUser
}

export type ClaimList = {
    items: ClaimView[]
    page: number
    limit: number
    total: number
}

export type CreateClaimInput = {
    policyId: string
    incidentDate: string
    claimType: ClaimTypeValue
    claimedAmount: number
    description: string
}

export type AnalysisCitation = {
    chunkId: string
    documentId: string
    documentName: string
    version: string
    pageNumber: number | null
    section: string | null
    language: string
}

export type ClaimAnalysis = {
    id: string
    status: AnalysisStatus
    message: string | null
    errorCode: string | null
    claim: {
        id: string
        claimNumber: string
        incidentDate: string
        claimType: string
        claimedAmount: string
    }
    policy: {
        id: string
        versionId: string
        versionNumber: string
        effectiveFrom: string
        effectiveTo: string | null
    }
    coverage: { covered: boolean; reasoning: string } | null
    exclusions: { applicable: boolean; items: { name: string; reasoning: string }[] } | null
    anomalies: { detected: boolean; items: string[] } | null
    financials: {
        claimedAmount: string
        coverageLimit: string | null
        deductible: string | null
        payout: string | null
    }
    recommendation: { decision: AnalysisDecision; reasoning: string } | null
    evidence: AnalysisCitation[]
}
