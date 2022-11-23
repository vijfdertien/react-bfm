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
} from './constants.d'

export type NamespaceValue = string | Array<string | number | boolean | object> | object | boolean | null
export type StateCallback = (state: object) => void
export type UnsubscribeFunction = () => void
export type ValidatorFunction = <T = string, E = string>(value: T, props: object) => E
export type DirtyCheckFunction = <T = string>(newValue: T, valueOnFocus: T) => boolean
export type EventToValueFunction<T = string> = (event: ChangeEvent<HTMLInputElement>) => T | undefined
export type TransformValueToInput<T = string> = (value: T) => string

export interface FieldStateType<V = string, E = string> {
  [FIELD_KEY_DIRTY]: boolean
  [FIELD_KEY_FOCUS]: boolean
  [FIELD_KEY_TOUCHED]: boolean
  [FIELD_KEY_VALID]: boolean
  [FIELD_KEY_VALUE]: V
  [FIELD_KEY_VALUE_ON_FOCUS]: V
  [FIELD_KEY_DEFAULT_VALUE]: V
  [FIELD_KEY_DEFAULT_VALUE_ERROR]: E
  [FIELD_KEY_ERROR]: E
}
