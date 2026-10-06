export type RetrievalHit = {
    chunkId: string
    content: string
    score: number
    retrievalMethod: string
    policyId: string
    policyVersionId: string
    documentId: string
    documentName: string
    version: string
    pageNumber: number | null
    section: string | null
    language: string
}

export type RetrievalCitation = {
    chunkId: string
    documentId: string
    documentName: string
    version: string
    pageNumber: number | null
    section: string | null
    language: string
}

export type RetrievalResponse = {
    query?: string
    hasSufficientEvidence: boolean
    results: RetrievalHit[]
    citations: RetrievalCitation[]
    message: string | null
}
