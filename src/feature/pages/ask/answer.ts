const rules: { key: string; test: (question: string) => boolean }[] = [
    {
        key: 'ask.answers.leave',
        test: (question) => /اجاز|إجاز|leave/.test(question),
    },
    {
        key: 'ask.answers.travel',
        test: (question) => /سفر|travel/.test(question),
    },
    {
        key: 'ask.answers.claims',
        test: (question) => /مطالب|صرف|claim/.test(question),
    },
    {
        key: 'ask.answers.approvals',
        test: (question) => /موافق|اعتماد|approv/.test(question),
    },
    {
        key: 'ask.answers.documents',
        test: (question) => /مستند|ملف|وثيق|document|docx/.test(question),
    },
    {
        key: 'ask.answers.greeting',
        test: (question) => /^(مرحبا|مرحباً|السلام عليكم|hello|hi|hey)[!.\s]*$/.test(question),
    },
]

export function answerKey(question: string) {
    const normalized = question.trim().toLowerCase()
    return rules.find((rule) => rule.test(normalized))?.key ?? 'ask.answers.fallback'
}
