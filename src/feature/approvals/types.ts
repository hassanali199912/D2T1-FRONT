import type { AnalysisCitation, AnalysisDecision, ClaimStatus, ClaimTypeValue } from '../claims/types.ts'

export const approvalStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'EDITED_AND_APPROVED', 'CANCELLED'] as const
export type ApprovalStatus = (typeof approvalStatuses)[number]

export const humanDecisions = ['APPROVE', 'REJECT'] as const
export type HumanDecision = (typeof humanDecisions)[number]

export type OriginalRecommendation = {
    decision: string
    payout: string | null
    reasoning: string | null
    analysisId: string
}

export type ApprovalAnomalies = {
    detected: boolean
    items: string[]
} | null

export type ApprovalView = {
    id: string
    status: ApprovalStatus
    claim: {
        id: string
        claimNumber: string
        incidentDate: string
        claimType: ClaimTypeValue | string
        claimedAmount: string
        status: ClaimStatus | string
        description: string
    }
    policy: {
        id: string
        name: string
        version: string
        language: string
        type: string
    } | null
    analysis: {
        id: string
        recommendation: AnalysisDecision | string | null
        payout: string | null
        coverage: boolean | null
        exclusions: unknown
        anomalies: ApprovalAnomalies
        coverageLimit: string | null
        deductible: string | null
        reasoning: string | null
        evidence: AnalysisCitation[]
    }
    originalRecommendation: OriginalRecommendation
    reviewer: { id: string; name: string; email: string; role: string } | null
    reviewedAt: string | null
    comment: string | null
    finalDecision: HumanDecision | null
    finalPayout: string | null
    editedFields: { finalDecision?: HumanDecision; finalPayout?: string } | null
    audits: unknown[]
    createdAt: string
    updatedAt: string
}

export type ApprovalList = {
    items: ApprovalView[]
    page: number
    limit: number
    total: number
}

export type RejectApprovalInput = {
    comment: string
}

export type EditApprovalInput = {
    finalDecision: HumanDecision
    finalPayout?: number
    comment: string
}

export function anomalyCount(anomalies: ApprovalAnomalies) {
    if (!anomalies?.detected) return 0
    return anomalies.items.length
}
