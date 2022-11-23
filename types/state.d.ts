import { StateCallback, UnsubscribeFunction } from './general.d'

export function getFieldState(namespace: string, fieldName: string): object
export function getNamespaceState(namespace: string): object
export function removeField(namespace: string, fieldName: string): void
export function subscribeToField(namespace: string, fieldName: string, callback: StateCallback): UnsubscribeFunction
export function subscribeToNamespace(namespace: string, callback: StateCallback): UnsubscribeFunction
export function updateFieldStateWithCallback(namespace: string, fieldName: string, callback: StateCallback): void
