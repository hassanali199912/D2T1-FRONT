export function formatClaimDate(iso: string, language: string) {
    const value = iso.length === 10 ? `${iso}T00:00:00` : iso
    return new Intl.DateTimeFormat(language, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value))
}

export function formatClaimAmount(amount: string | number, language: string) {
    const value = typeof amount === 'number' ? amount : Number(amount)
    return new Intl.NumberFormat(language, {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)
}

export function todayIso() {
    const now = new Date()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${now.getFullYear()}-${month}-${day}`
}
