import {
  FIELD_KEY_DEFAULT_VALUE,
  FIELD_KEY_DIRTY,
  FIELD_KEY_ERROR,
  FIELD_KEY_FOCUS,
  FIELD_KEY_TOUCHED,
  FIELD_KEY_VALID,
  FIELD_KEY_VALUE,
  FIELD_KEY_VALUE_ON_FOCUS,
} from '../constants'
import { getFieldState } from '../state'
import { FieldNameType, FieldStateType, NamespaceType } from '../types'

export const getFieldError = (namespace: NamespaceType, fieldName: FieldNameType): any => {
  const fieldState: FieldStateType = getFieldState(namespace, fieldName)

  return fieldState[FIELD_KEY_ERROR]
}

export const getFieldValue = (namespace: NamespaceType, fieldName: FieldNameType): any => {
  const fieldState: FieldStateType = getFieldState(namespace, fieldName)

  return fieldState[FIELD_KEY_VALUE]
}

export const getFieldDefaultValue = (namespace: NamespaceType, fieldName: FieldNameType): any => {
  const fieldState: FieldStateType = getFieldState(namespace, fieldName)

  return fieldState[FIELD_KEY_DEFAULT_VALUE]
}

export const getFieldValueOnFocus = (namespace: NamespaceType, fieldName: FieldNameType): any => {
  const fieldState: FieldStateType = getFieldState(namespace, fieldName)

  return fieldState[FIELD_KEY_VALUE_ON_FOCUS]
}

export const hasFieldFocus = (namespace: NamespaceType, fieldName: FieldNameType): boolean => {
  const fieldState: FieldStateType = getFieldState(namespace, fieldName)

  return fieldState[FIELD_KEY_FOCUS]
}

export const isFieldDirty = (namespace: NamespaceType, fieldName: FieldNameType): boolean => {
  const fieldState: FieldStateType = getFieldState(namespace, fieldName)

  return fieldState[FIELD_KEY_DIRTY]
}

export const isFieldTouched = (namespace: NamespaceType, fieldName: FieldNameType): boolean => {
  const fieldState: FieldStateType = getFieldState(namespace, fieldName)

  return fieldState[FIELD_KEY_TOUCHED]
}

export const isFieldValid = (namespace: NamespaceType, fieldName: FieldNameType): boolean => {
  const fieldState: FieldStateType = getFieldState(namespace, fieldName)

  return fieldState[FIELD_KEY_VALID]
}
