import { StateCallback, FieldStateType } from './general.d'

export const BFMHooksContext: import('react').Context<{
  blurField: (namespace: string, fieldName: string) => void
  changeField: <T = string, E = string>(
    namespace: string,
    fieldName: string,
    value: T,
    error: E,
    dirtyCheck?: (newValue: T, valueOnFocus: T) => boolean
  ) => void
  defaultValueField: <T = string, E = string>(namespace: string, fieldName: string, defaultValue: T, error: E) => void
  focusField: (namespace: string, fieldName: string) => void
  getFieldState: <T = string>(namespace: string, fieldName: string) => FieldStateType<T>
  getNamespaceState: (namespace: string) => object
  initField: <T = string, E = string>(namespace: string, fieldName: string, value: T, error: E) => FieldStateType<T>
  removeField: (namespace: string, fieldName: string) => void
  subscribeToField: (namespace: string, fieldName: string, callback: StateCallback) => () => void
  subscribeToNamespace: (namespace: string, callback: StateCallback) => () => void
}>
