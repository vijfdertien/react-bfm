import { NamespaceValue } from '../general.d'

export function creatorUseNamespace(
  getValueFromState: (state: object) => NamespaceValue
): (namespace: string) => NamespaceValue
export function creatorUseGetNamespace<T>(key: string | symbol, defaultValue: T): (namespace: string) => object
export function creatorUseIsEveryNamespace(key: string | symbol): (namespace: string) => boolean
export function creatorUseIsSomeNamespace(key: string | symbol): (namespace: string) => boolean
export function useNamespaceErrors(namespace: string): object
export function useNamespaceHasFocus(namespace: string): boolean
export function useNamespaceIsDirty(namespace: string): boolean
export function useNamespaceIsTouched(namespace: string): boolean
export function useNamespaceIsValid(namespace: string): boolean
export function useNamespaceValues(namespace: string): object
export function useNamespaceValuesOnFocus(namespace: string): object
