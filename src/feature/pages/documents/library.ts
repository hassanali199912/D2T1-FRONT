const MAX_FILE_BYTES = 10 * 1024 * 1024

export function formatPolicyDate(iso: string, language: string) {
    return new Intl.DateTimeFormat(language, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(iso))
}

export function isPolicyFile(file: File) {
    const name = file.name.toLowerCase()
    return name.endsWith('.pdf') || name.endsWith('.docx')
}

export function isPolicyFileTooLarge(file: File) {
    return file.size > MAX_FILE_BYTES
}

export function nameFromPolicyFile(file: File) {
    return file.name.replace(/\.(pdf|docx)$/i, '')
}
