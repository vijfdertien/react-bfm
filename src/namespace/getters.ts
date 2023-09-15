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

export const getNamespaceKeyValues = (namespace: NamespaceType, key: FieldStateKeyType) =>
  Object.entries<FieldStateType>(getNamespaceState(namespace)).reduce(
    (values: GetNamespaceType, [fieldName, fieldState]) => {
      values[fieldName] = fieldState[key]
      return values
    },
    {},
  )
export const getNamespaceKeyIsEvery = (namespace: NamespaceType, key: FieldStateKeyType): boolean =>
  Object.values(getNamespaceState(namespace)).every((fieldState) => fieldState[key] || false)
export const getNamespaceKeyIsSome = (namespace: NamespaceType, key: FieldStateKeyType): boolean =>
  Object.values(getNamespaceState(namespace)).some((fieldState) => fieldState[key] || false)

export const getNamespaceDefaultValues = (namespace: NamespaceType) =>
  getNamespaceKeyValues(namespace, FIELD_KEY_DEFAULT_VALUE)

export const getNamespaceErrors = (namespace: NamespaceType) => getNamespaceKeyValues(namespace, FIELD_KEY_ERROR)

export const getNamespaceValues = (namespace: NamespaceType) => getNamespaceKeyValues(namespace, FIELD_KEY_VALUE)

export const getNamespaceValuesOnFocus = (namespace: NamespaceType) =>
  getNamespaceKeyValues(namespace, FIELD_KEY_VALUE_ON_FOCUS)

export const hasNamespaceFocus = (namespace: NamespaceType) => getNamespaceKeyIsSome(namespace, FIELD_KEY_FOCUS)

export const isNamespaceDirty = (namespace: NamespaceType) => getNamespaceKeyIsSome(namespace, FIELD_KEY_DIRTY)

export const isNamespaceTouched = (namespace: NamespaceType) => getNamespaceKeyIsSome(namespace, FIELD_KEY_TOUCHED)

export const isNamespaceValid = (namespace: NamespaceType) => getNamespaceKeyIsEvery(namespace, FIELD_KEY_VALID)
