import { ChangeEvent } from 'react'
import {
  FIELD_KEY_DEFAULT_VALUE,
  FIELD_KEY_DEFAULT_VALUE_ERROR,
  FIELD_KEY_DIRTY,
  FIELD_KEY_ERROR,
  FIELD_KEY_FOCUS,
  FIELD_KEY_TOUCHED,
  FIELD_KEY_VALID,
  FIELD_KEY_VALUE,
  FIELD_KEY_VALUE_ON_FOCUS,
} from './constants/field-keys'

// generic
export type NamespaceType = string
export type FieldNameType = string

// state
export interface FieldStateType {
  [FIELD_KEY_DIRTY]: boolean
  [FIELD_KEY_FOCUS]: boolean
  [FIELD_KEY_TOUCHED]: boolean
  [FIELD_KEY_VALID]: boolean
  [FIELD_KEY_VALUE]: any
  [FIELD_KEY_ERROR]: any
  [FIELD_KEY_VALUE_ON_FOCUS]: any
  [FIELD_KEY_DEFAULT_VALUE]: any
  [FIELD_KEY_DEFAULT_VALUE_ERROR]: any
}

export type FieldStateKeyType = keyof FieldStateType

export interface NamespaceStateType {
  [fieldName: FieldNameType]: FieldStateType
}

export type SubscriberNamespaceCallbackType = (state: NamespaceStateType) => void
export type SubscriberFieldCallbackType = (state: FieldStateType) => void
export type UpdateFieldCallbackType = (state: FieldStateType) => Partial<FieldStateType>

// callback functions
export type ValidatorFunction = (value?: any, props?: object) => any
export type DirtyCheckFunction = (newValue: any, valueOnFocus: any) => boolean
export type TransformEventToValueFunction<T = HTMLInputElement> = (event: ChangeEvent<T>) => any
export type TransformValueToInputFunction = (value: any) => any

// others
export interface GetNamespaceType {
  [fieldName: FieldNameType]: any
}
