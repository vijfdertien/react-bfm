import { ChangeEvent } from 'react'
import { FIELD_DEFAULT_ERROR, FIELD_KEY_ERROR, FIELD_KEY_VALID, FIELD_KEY_VALUE } from './constants'
import {
  FieldNameType,
  FieldStateType,
  NamespaceType,
  DirtyCheckFunction,
  EventToValueFunction,
  TransformValueToInputFunction,
} from './types'

export const checkedEventToValue: EventToValueFunction = (event: ChangeEvent<HTMLInputElement>) =>
  event?.target?.checked

export const defaultEventToValue: EventToValueFunction = (event: ChangeEvent<HTMLInputElement>) => event?.target?.value

export const defaultDirtyCheck: DirtyCheckFunction = (newValue: any, valueOnFocus: any): boolean =>
  newValue !== valueOnFocus

export const defaultValueToInput: TransformValueToInputFunction = (value: any): any => value

export const mapFieldValueAndError = (value: any, error?: any): Pick<FieldStateType, 'error' | 'valid' | 'value'> => ({
  [FIELD_KEY_ERROR]: error || FIELD_DEFAULT_ERROR,
  [FIELD_KEY_VALID]: !error,
  [FIELD_KEY_VALUE]: value,
})

export const validateFieldName = (fieldName: FieldNameType) => fieldName?.length > 0

export const validateNamespace = (namespace: NamespaceType) => namespace?.length > 0
