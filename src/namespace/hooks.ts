import { useContext, useMemo, useSyncExternalStore } from 'react'
import { BFMHooksContext } from '../context'
import { validateNamespace } from '../helpers'
import { FieldStateKeyType, FieldStateType, GetNamespaceType, NamespaceType } from '../common'
import {
  FIELD_KEY_DIRTY,
  FIELD_KEY_ERROR,
  FIELD_KEY_FOCUS,
  FIELD_KEY_TOUCHED,
  FIELD_KEY_VALID,
  FIELD_KEY_VALUE,
  FIELD_KEY_VALUE_ON_FOCUS,
} from '../constants/field-keys'
import { NAMESPACE_STATE_DEFAULT } from '../constants/state-defaults'

export const useNamespaceState = (namespace: NamespaceType) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!validateNamespace(namespace)) {
      throw new Error('Expected string with a minimal length of 1 for `namespace`')
    }
  }
  const { createSubscribeToNamespace, createGetSnapshotNamespaceState } = useContext(BFMHooksContext)

  const subscribe = useMemo(() => createSubscribeToNamespace(namespace), [createSubscribeToNamespace, namespace])
  const getSnapshot = useMemo(
    () => createGetSnapshotNamespaceState(namespace),
    [createGetSnapshotNamespaceState, namespace],
  )

  return useSyncExternalStore(subscribe, getSnapshot)
}

export const useNamespaceKeyValues = (
  namespace: NamespaceType,
  key: FieldStateKeyType,
): GetNamespaceType | undefined => {
  const namespaceState = useNamespaceState(namespace)

  return (
    namespaceState &&
    Object.entries<FieldStateType>(namespaceState).reduce((values: GetNamespaceType, [fieldName, fieldState]) => {
      values[fieldName] = fieldState[key]
      return values
    }, {})
  )
}

export const useNamespaceKeyIsEvery = (namespace: NamespaceType, key: FieldStateKeyType): boolean | undefined => {
  const namespaceState = useNamespaceState(namespace)

  return (
    namespaceState &&
    Object.values(namespaceState || NAMESPACE_STATE_DEFAULT).every(
      (fieldState: FieldStateType) => fieldState[key] || false,
    )
  )
}
export const useNamespaceKeyIsSome = (namespace: NamespaceType, key: FieldStateKeyType): boolean | undefined => {
  const namespaceState = useNamespaceState(namespace)

  return (
    namespaceState &&
    Object.values(namespaceState || NAMESPACE_STATE_DEFAULT).some(
      (fieldState: FieldStateType) => fieldState[key] || false,
    )
  )
}

/**
 * Falsy error values are always returned as null
 */
export const useNamespaceErrors = (namespace: NamespaceType) => useNamespaceKeyValues(namespace, FIELD_KEY_ERROR)

export const useNamespaceHasFocus = (namespace: NamespaceType) => useNamespaceKeyIsSome(namespace, FIELD_KEY_FOCUS)

export const useNamespaceIsDirty = (namespace: NamespaceType) => useNamespaceKeyIsSome(namespace, FIELD_KEY_DIRTY)

export const useNamespaceIsTouched = (namespace: NamespaceType) => useNamespaceKeyIsSome(namespace, FIELD_KEY_TOUCHED)

export const useNamespaceIsValid = (namespace: NamespaceType) => useNamespaceKeyIsEvery(namespace, FIELD_KEY_VALID)

export const useNamespaceValues = (namespace: NamespaceType) => useNamespaceKeyValues(namespace, FIELD_KEY_VALUE)

export const useNamespaceValuesOnFocus = (namespace: NamespaceType) =>
  useNamespaceKeyValues(namespace, FIELD_KEY_VALUE_ON_FOCUS)
