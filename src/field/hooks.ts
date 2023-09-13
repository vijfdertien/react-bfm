import { useContext, useEffect, useState } from 'react'
import {
  FIELD_KEY_DIRTY,
  FIELD_KEY_ERROR,
  FIELD_KEY_FOCUS,
  FIELD_KEY_TOUCHED,
  FIELD_KEY_VALID,
  FIELD_KEY_VALUE,
  FIELD_KEY_VALUE_ON_FOCUS,
} from '../constants'
import { BFMHooksContext } from '../context'
import { validateFieldName, validateNamespace } from '../helpers'
import { FieldNameType, FieldStateType, NamespaceType } from '../types'

export const useFieldState = (namespace: NamespaceType, fieldName: FieldNameType): FieldStateType => {
  if (process.env.NODE_ENV !== 'production') {
    validateNamespace(namespace) || console.error('Expected string with a minimal length of 1 for `namespace`') // eslint-disable-line no-console
    validateFieldName(fieldName) || console.error('Expected string with a minimal length of 1 for `fieldName`') // eslint-disable-line no-console
  }
  const { getFieldState, subscribeToField } = useContext(BFMHooksContext)
  const [value, setValue] = useState(getFieldState(namespace, fieldName))

  useEffect(
    () =>
      subscribeToField(namespace, fieldName, (fieldState: FieldStateType) => {
        setValue(fieldState)
      }),
    [fieldName, namespace, subscribeToField],
  )

  return value
}

export const useFieldError = (namespace: NamespaceType, fieldName: FieldNameType): any =>
  useFieldState(namespace, fieldName)[FIELD_KEY_ERROR]

export const useFieldHasFocus = (namespace: NamespaceType, fieldName: FieldNameType): boolean =>
  useFieldState(namespace, fieldName)[FIELD_KEY_FOCUS]

export const useFieldIsDirty = (namespace: NamespaceType, fieldName: FieldNameType): boolean =>
  useFieldState(namespace, fieldName)[FIELD_KEY_DIRTY]

export const useFieldIsTouched = (namespace: NamespaceType, fieldName: FieldNameType): boolean =>
  useFieldState(namespace, fieldName)[FIELD_KEY_TOUCHED]

export const useFieldIsValid = (namespace: NamespaceType, fieldName: FieldNameType): boolean =>
  useFieldState(namespace, fieldName)[FIELD_KEY_VALID]

export const useFieldValue = (namespace: NamespaceType, fieldName: FieldNameType): any =>
  useFieldState(namespace, fieldName)[FIELD_KEY_VALUE]

export const useFieldValueOnFocus = (namespace: NamespaceType, fieldName: FieldNameType): any =>
  useFieldState(namespace, fieldName)[FIELD_KEY_VALUE_ON_FOCUS]
