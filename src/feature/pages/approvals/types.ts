export type AnomalySeverity = 'warning' | 'error'

export type Citation = {
    id: string
    sourceKey: string
    excerptKey: string
}

export type CalculationLine = {
    id: string
    labelKey: string
    amount: number
}

export type Anomaly = {
    id: string
    textKey: string
    severity: AnomalySeverity
}

export type PendingDecision = {
    id: string
    policyNumber: string
    typeKey: string
    proposedDecisionKey: string
    justificationKey: string
    citations: Citation[]
    calculation: CalculationLine[]
    anomalies: Anomaly[]
}
