import { getNamespaceState } from '../state'
import { FieldStateType, NamespaceType, FieldStateKeyType, GetNamespaceType } from '../common'
import {
  FIELD_KEY_DEFAULT_VALUE,
  FIELD_KEY_DIRTY,
  FIELD_KEY_ERROR,
  FIELD_KEY_FOCUS,
  FIELD_KEY_TOUCHED,
  FIELD_KEY_VALID,
  FIELD_KEY_VALUE,
  FIELD_KEY_VALUE_ON_FOCUS,
} from '../constants/field-keys'

export const getNamespaceKeyValues = <T = GetNamespaceType>(
  namespace: NamespaceType,
  key: FieldStateKeyType,
): T | undefined => {
  const namespaceState = getNamespaceState(namespace)

  return (
    namespaceState &&
    (Object.entries<FieldStateType>(namespaceState).reduce((values: GetNamespaceType, [fieldName, fieldState]) => {
      values[fieldName] = fieldState[key]
      return values
    }, {}) as T)
  )
}

export const getNamespaceKeyIsEvery = (namespace: NamespaceType, key: FieldStateKeyType): boolean | undefined => {
  const namespaceState = getNamespaceState(namespace)

  return namespaceState && Object.values(namespaceState).every((fieldState) => fieldState[key] || false)
}
export const getNamespaceKeyIsSome = (namespace: NamespaceType, key: FieldStateKeyType): boolean | undefined => {
  const namespaceState = getNamespaceState(namespace)

  return namespaceState && Object.values(namespaceState).some((fieldState) => fieldState[key] || false)
}
export const getNamespaceDefaultValues = <T = GetNamespaceType>(namespace: NamespaceType) =>
  getNamespaceKeyValues<T>(namespace, FIELD_KEY_DEFAULT_VALUE)

export const getNamespaceErrors = <T = GetNamespaceType>(namespace: NamespaceType) =>
  getNamespaceKeyValues<T>(namespace, FIELD_KEY_ERROR)

export const getNamespaceValues = <T = GetNamespaceType>(namespace: NamespaceType) =>
  getNamespaceKeyValues<T>(namespace, FIELD_KEY_VALUE)

export const getNamespaceValuesOnFocus = <T = GetNamespaceType>(namespace: NamespaceType) =>
  getNamespaceKeyValues<T>(namespace, FIELD_KEY_VALUE_ON_FOCUS)

export const hasNamespaceFocus = (namespace: NamespaceType) => getNamespaceKeyIsSome(namespace, FIELD_KEY_FOCUS)

export const isNamespaceDirty = (namespace: NamespaceType) => getNamespaceKeyIsSome(namespace, FIELD_KEY_DIRTY)

export const isNamespaceTouched = (namespace: NamespaceType) => getNamespaceKeyIsSome(namespace, FIELD_KEY_TOUCHED)

export const isNamespaceValid = (namespace: NamespaceType) => getNamespaceKeyIsEvery(namespace, FIELD_KEY_VALID)
