import { ChangeEvent, FocusEvent } from 'react'
import {
  DirtyCheckFunction,
  EventToValueFunction,
  FieldStateType,
  TransformValueToInput,
  ValidatorFunction,
} from './general.d'

export interface ConnectFieldProps {
  namespace: string
  fieldName: string
  defaultValue?: unknown
  validator?: ValidatorFunction
  dirtyCheck?: DirtyCheckFunction
  transformValueToInput?: TransformValueToInput
  transformEventToValue?: EventToValueFunction
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void
}

interface BaseConnectFieldReturnProps<T = string, E = string> extends FieldStateType<T, E> {
  onFocus: (event: FocusEvent<HTMLInputElement>) => void
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onBlur: (event: FocusEvent<HTMLInputElement>) => void
}

export type ConnectFieldReturnProps<P, T = string, E = string> = P & BaseConnectFieldReturnProps<T, E>

export function useConnectField<P, T = string, E = string>(
  props: ConnectFieldProps,
  omitProps?: string[]
): ConnectFieldReturnProps<P, T, E>
