import { useSyncExternalStore } from 'react'
import { initialClaims } from './library.ts'
import type { Claim, ClaimStatus } from './types.ts'

let claims: readonly Claim[] = initialClaims
const listeners = new Set<() => void>()

function emit() {
    listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
}

function getClaims() {
    return claims
}

export function useClaims() {
    return useSyncExternalStore(subscribe, getClaims)
}

export function addClaim(claim: Claim) {
    claims = [claim, ...claims]
    emit()
}

export function setClaimStatus(id: string, status: ClaimStatus) {
    claims = claims.map((claim) => (claim.id === id ? { ...claim, status } : claim))
    emit()
}
