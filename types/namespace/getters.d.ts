export function creatorGetNamespace<T>(key: string | symbol, defaultValue: T): (namespace: string) => object
export function creatorIsEveryNamespace(key: string | symbol): (namespace: string) => boolean
export function creatorIsSomeNamespace(key: string | symbol): (namespace: string) => boolean
export function getNamespaceDefaultValues(namespace: string): object
export function getNamespaceErrors(namespace: string): object
export function getNamespaceValues(namespace: string): object
export function getNamespaceValuesOnFocus(namespace: string): object
export function hasNamespaceFocus(namespace: string): boolean
export function isNamespaceDirty(namespace: string): boolean
export function isNamespaceTouched(namespace: string): boolean
export function isNamespaceValid(namespace: string): boolean
