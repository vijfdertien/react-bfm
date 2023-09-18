import { useContext, useEffect, useState } from 'react'
import { BFMHooksContext } from '../context'
import { validateFieldName, validateNamespace } from '../helpers'
import { FieldNameType, FieldStateType, NamespaceType } from '../common'
import {
  FIELD_KEY_DIRTY,
  FIELD_KEY_ERROR,
  FIELD_KEY_FOCUS,
  FIELD_KEY_TOUCHED,
  FIELD_KEY_VALID,
  FIELD_KEY_VALUE,
  FIELD_KEY_VALUE_ON_FOCUS,
} from '../constants/field-keys'

export const useFieldState = (namespace: NamespaceType, fieldName: FieldNameType): FieldStateType | undefined => {
  if (process.env.NODE_ENV !== 'production') {
    if (!validateNamespace(namespace)) {
      throw new Error('Expected string with a minimal length of 1 for `namespace`')
    }
    if (!validateFieldName(fieldName)) {
      throw new Error('Expected string with a minimal length of 1 for `fieldName`')
    }
  }
  const { subscribeToField } = useContext(BFMHooksContext)
  const [value, setValue] = useState<FieldStateType | undefined>()

  useEffect(
    () =>
      subscribeToField(namespace, fieldName, (fieldState: FieldStateType) => {
        setValue(fieldState)
      }),
    [fieldName, namespace, subscribeToField],
  )

  return value
}

export const useFieldError = <T = any>(namespace: NamespaceType, fieldName: FieldNameType): T | undefined => {
  const fieldState = useFieldState(namespace, fieldName)

  return fieldState?.[FIELD_KEY_ERROR]
}

export const useFieldHasFocus = (namespace: NamespaceType, fieldName: FieldNameType): boolean | undefined => {
  const fieldState = useFieldState(namespace, fieldName)

  return fieldState?.[FIELD_KEY_FOCUS]
}

export const useFieldIsDirty = (namespace: NamespaceType, fieldName: FieldNameType): boolean | undefined => {
  const fieldState = useFieldState(namespace, fieldName)

  return fieldState?.[FIELD_KEY_DIRTY]
}

export const useFieldIsTouched = (namespace: NamespaceType, fieldName: FieldNameType): boolean | undefined => {
  const fieldState = useFieldState(namespace, fieldName)

  return fieldState?.[FIELD_KEY_TOUCHED]
}

export const useFieldIsValid = (namespace: NamespaceType, fieldName: FieldNameType): boolean | undefined => {
  const fieldState = useFieldState(namespace, fieldName)

  return fieldState?.[FIELD_KEY_VALID]
}

export const useFieldValue = <T = any>(namespace: NamespaceType, fieldName: FieldNameType): T | undefined => {
  const fieldState = useFieldState(namespace, fieldName)

  return fieldState?.[FIELD_KEY_VALUE]
}

export const useFieldValueOnFocus = <T = any>(namespace: NamespaceType, fieldName: FieldNameType): T | undefined => {
  const fieldState = useFieldState(namespace, fieldName)

  return fieldState?.[FIELD_KEY_VALUE_ON_FOCUS]
}
