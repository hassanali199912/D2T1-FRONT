import { useSyncExternalStore } from 'react'
import { initialDecisions } from './library.ts'
import type { PendingDecision } from './types.ts'

let queue: readonly PendingDecision[] = initialDecisions
const listeners = new Set<() => void>()

function emit() {
    listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
}

function getQueue() {
    return queue
}

export function useApprovalQueue() {
    return useSyncExternalStore(subscribe, getQueue)
}

export function dismissDecision(id: string) {
    queue = queue.filter((decision) => decision.id !== id)
    emit()
}
