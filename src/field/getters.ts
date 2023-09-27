import { getFieldState } from '../state'
import { FieldNameType, NamespaceType } from '../common'
import {
  FIELD_KEY_INITIAL_VALUE,
  FIELD_KEY_DIRTY,
  FIELD_KEY_ERROR,
  FIELD_KEY_FOCUS,
  FIELD_KEY_TOUCHED,
  FIELD_KEY_VALID,
  FIELD_KEY_VALUE,
  FIELD_KEY_VALUE_ON_FOCUS,
} from '../constants/field-keys'

export const getFieldError = <T = any>(namespace: NamespaceType, fieldName: FieldNameType): T | undefined => {
  const fieldState = getFieldState(namespace, fieldName)

  return fieldState?.[FIELD_KEY_ERROR]
}

export const getFieldValue = <T = any>(namespace: NamespaceType, fieldName: FieldNameType): T | undefined => {
  const fieldState = getFieldState(namespace, fieldName)

  return fieldState?.[FIELD_KEY_VALUE]
}

export const getFieldInitialValue = <T = any>(namespace: NamespaceType, fieldName: FieldNameType): T | undefined => {
  const fieldState = getFieldState(namespace, fieldName)

  return fieldState?.[FIELD_KEY_INITIAL_VALUE]
}

export const getFieldValueOnFocus = <T = any>(namespace: NamespaceType, fieldName: FieldNameType): T | undefined => {
  const fieldState = getFieldState(namespace, fieldName)

  return fieldState?.[FIELD_KEY_VALUE_ON_FOCUS]
}

export const hasFieldFocus = (namespace: NamespaceType, fieldName: FieldNameType): boolean => {
  const fieldState = getFieldState(namespace, fieldName)

  return fieldState?.[FIELD_KEY_FOCUS] || false
}

export const isFieldDirty = (namespace: NamespaceType, fieldName: FieldNameType): boolean => {
  const fieldState = getFieldState(namespace, fieldName)

  return fieldState?.[FIELD_KEY_DIRTY] || false
}

export const isFieldTouched = (namespace: NamespaceType, fieldName: FieldNameType): boolean => {
  const fieldState = getFieldState(namespace, fieldName)

  return fieldState?.[FIELD_KEY_TOUCHED] || false
}

export const isFieldValid = (namespace: NamespaceType, fieldName: FieldNameType): boolean => {
  const fieldState = getFieldState(namespace, fieldName)

  return fieldState?.[FIELD_KEY_VALID] || false
}
