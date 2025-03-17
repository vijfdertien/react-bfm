import { createContext } from 'react'
import { defaultDirtyCheck, mapFieldValueAndError, validateFieldName, validateNamespace } from './helpers'
import {
  getFieldState,
  getNamespaceState,
  initFieldState,
  removeField,
  StateCreatorReturnType,
  createGetSnapshotFieldState,
  createGetSnapshotNamespaceState,
  createGetSnapshotNamespacesState,
  createSubscribeToField,
  createSubscribeToNamespace,
  createSubscribeToNamespaces,
  updateFieldStateWithCallback,
} from './state'
import { DirtyCheckFunction, FieldNameType, FieldStateType, NamespaceType } from './common'
import {
  FIELD_KEY_INITIAL_VALUE,
  FIELD_KEY_INITIAL_VALUE_ERROR,
  FIELD_KEY_DIRTY,
  FIELD_KEY_ERROR,
  FIELD_KEY_FOCUS,
  FIELD_KEY_TOUCHED,
  FIELD_KEY_VALUE,
  FIELD_KEY_VALUE_ON_FOCUS,
} from './constants/field-keys'

const focusField = (namespace: NamespaceType, fieldName: FieldNameType) => {
  updateFieldStateWithCallback(namespace, fieldName, (currentState: FieldStateType) => ({
    [FIELD_KEY_FOCUS]: true,
    [FIELD_KEY_VALUE_ON_FOCUS]: currentState[FIELD_KEY_VALUE],
  }))
}

const changeField = (
  namespace: NamespaceType,
  fieldName: FieldNameType,
  value: any,
  error: any,
  dirtyCheck = defaultDirtyCheck,
) => {
  updateFieldStateWithCallback(namespace, fieldName, (currentState: FieldStateType) => ({
    [FIELD_KEY_DIRTY]: dirtyCheck(value, currentState[FIELD_KEY_VALUE_ON_FOCUS]),
    ...mapFieldValueAndError(value, error),
  }))
}

const blurField = (namespace: NamespaceType, fieldName: FieldNameType) => {
  updateFieldStateWithCallback(namespace, fieldName, () => ({
    [FIELD_KEY_FOCUS]: false,
    [FIELD_KEY_TOUCHED]: true,
    [FIELD_KEY_VALUE_ON_FOCUS]: null,
  }))
}

const initField = (namespace: NamespaceType, fieldName: FieldNameType, value: any, error: any) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!validateNamespace(namespace)) {
      throw new Error('Expected string with a minimal length of 1 for `namespace`')
    }
    if (!validateFieldName(fieldName)) {
      throw new Error('Expected string with a minimal length of 1 for `fieldName`')
    }
  }

  initFieldState(namespace, fieldName, value, error)
}

/**
 * sets default value only when the field is not touched or has focus
 * this way you can still change the input value after first rendering
 */
const initialValueField = (namespace: NamespaceType, fieldName: FieldNameType, initialValue: any, error: any) =>
  updateFieldStateWithCallback(namespace, fieldName, (currentState) => {
    // only update value and error when field is not touched or has focus
    const updateState: Partial<FieldStateType> =
      !currentState[FIELD_KEY_TOUCHED] &&
      !currentState[FIELD_KEY_FOCUS] &&
      currentState[FIELD_KEY_VALUE] !== initialValue
        ? mapFieldValueAndError(initialValue, error)
        : {}

    // update error if value is still default
    if (currentState[FIELD_KEY_VALUE] === initialValue && currentState[FIELD_KEY_ERROR] !== error) {
      updateState.error = error
      updateState.valid = !error
    }

    return {
      ...updateState,
      [FIELD_KEY_INITIAL_VALUE]: initialValue,
      [FIELD_KEY_INITIAL_VALUE_ERROR]: error,
    }
  })

export interface BFMHookContextType
  extends Omit<StateCreatorReturnType, 'updateFieldStateWithCallback' | 'initFieldState'> {
  blurField: (namespace: NamespaceType, fieldName: FieldNameType) => void
  changeField: (
    namespace: NamespaceType,
    fieldName: FieldNameType,
    value: any,
    error: any,
    dirtyCheck?: DirtyCheckFunction,
  ) => void
  initialValueField: (namespace: NamespaceType, fieldName: FieldNameType, initialValue: any, error: any) => void
  focusField: (namespace: NamespaceType, fieldName: FieldNameType) => void
  initField: (namespace: NamespaceType, fieldName: FieldNameType, value: any, error: any) => void
}

export const BFMHooksContext = createContext<BFMHookContextType>({
  blurField,
  changeField,
  initialValueField,
  focusField,
  getFieldState,
  getNamespaceState,
  initField,
  removeField,
  createGetSnapshotFieldState,
  createGetSnapshotNamespaceState,
  createGetSnapshotNamespacesState,
  createSubscribeToField,
  createSubscribeToNamespace,
  createSubscribeToNamespaces,
})
