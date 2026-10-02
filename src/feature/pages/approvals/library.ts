import type { PendingDecision } from './types.ts'

export const initialDecisions: PendingDecision[] = [
    {
        id: 'apr-medical',
        policyNumber: 'POL-10088',
        typeKey: 'approvals.samples.medical.type',
        proposedDecisionKey: 'approvals.samples.medical.decision',
        justificationKey: 'approvals.samples.medical.justification',
        citations: [
            {
                id: 'med-policy',
                sourceKey: 'approvals.samples.medical.citePolicy',
                excerptKey: 'approvals.samples.medical.citePolicyText',
            },
            {
                id: 'med-invoice',
                sourceKey: 'approvals.samples.medical.citeInvoice',
                excerptKey: 'approvals.samples.medical.citeInvoiceText',
            },
        ],
        calculation: [
            { id: 'med-invoice', labelKey: 'approvals.samples.medical.invoice', amount: 1500 },
            { id: 'med-cover', labelKey: 'approvals.samples.medical.cover', amount: 1350 },
            { id: 'med-deduct', labelKey: 'approvals.samples.medical.deductible', amount: -100 },
            { id: 'med-payable', labelKey: 'approvals.samples.medical.payable', amount: 1250 },
        ],
        anomalies: [
            { id: 'med-late', textKey: 'approvals.samples.medical.late', severity: 'warning' },
        ],
    },
    {
        id: 'apr-theft',
        policyNumber: 'POL-10104',
        typeKey: 'approvals.samples.theft.type',
        proposedDecisionKey: 'approvals.samples.theft.decision',
        justificationKey: 'approvals.samples.theft.justification',
        citations: [
            {
                id: 'theft-clause',
                sourceKey: 'approvals.samples.theft.citeClause',
                excerptKey: 'approvals.samples.theft.citeClauseText',
            },
            {
                id: 'theft-invoice',
                sourceKey: 'approvals.samples.theft.citeInvoice',
                excerptKey: 'approvals.samples.theft.citeInvoiceText',
            },
        ],
        calculation: [
            { id: 'theft-claimed', labelKey: 'approvals.samples.theft.claimed', amount: 8700 },
            { id: 'theft-excluded', labelKey: 'approvals.samples.theft.excluded', amount: -1500 },
            { id: 'theft-depreciation', labelKey: 'approvals.samples.theft.depreciation', amount: -1200 },
            { id: 'theft-payable', labelKey: 'approvals.samples.theft.payable', amount: 6000 },
        ],
        anomalies: [
            { id: 'theft-report', textKey: 'approvals.samples.theft.missingReport', severity: 'error' },
            { id: 'theft-high', textKey: 'approvals.samples.theft.aboveAverage', severity: 'warning' },
        ],
    },
    {
        id: 'apr-fire',
        policyNumber: 'POL-09811',
        typeKey: 'approvals.samples.fire.type',
        proposedDecisionKey: 'approvals.samples.fire.decision',
        justificationKey: 'approvals.samples.fire.justification',
        citations: [
            {
                id: 'fire-clause',
                sourceKey: 'approvals.samples.fire.citeClause',
                excerptKey: 'approvals.samples.fire.citeClauseText',
            },
            {
                id: 'fire-survey',
                sourceKey: 'approvals.samples.fire.citeSurvey',
                excerptKey: 'approvals.samples.fire.citeSurveyText',
            },
        ],
        calculation: [
            { id: 'fire-survey', labelKey: 'approvals.samples.fire.survey', amount: 25000 },
            { id: 'fire-limit', labelKey: 'approvals.samples.fire.limit', amount: 22000 },
            { id: 'fire-payable', labelKey: 'approvals.samples.fire.payable', amount: 22000 },
        ],
        anomalies: [
            { id: 'fire-notice', textKey: 'approvals.samples.fire.lateNotice', severity: 'warning' },
        ],
    },
]

export function formatMoney(amount: number, language: string) {
    return new Intl.NumberFormat(language, {
        style: 'currency',
        currency: 'EGP',
        maximumFractionDigits: 0,
    }).format(amount)
}
