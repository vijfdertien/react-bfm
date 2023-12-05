import { FieldNameType, FieldStateType, NamespaceStateType, NamespaceType, UpdateFieldCallbackType } from './common'
import { FIELD_STATE_DEFAULT } from './constants/state-defaults'
import { mapFieldValueAndError } from './helpers'

interface StateType {
  [namespace: NamespaceType]: NamespaceStateType
}

type SubscriberListener = () => void

interface SubscriberType {
  listener: SubscriberListener
  fieldName?: FieldNameType
}

type SubscribersMapType = Map<number, SubscriberType>

interface SubscribersType {
  [namespace: NamespaceType]: SubscribersMapType
}

export interface StateCreatorReturnType {
  getFieldState: (namespace: NamespaceType, fieldName: FieldNameType) => FieldStateType | undefined
  getNamespaceState: (namespace: NamespaceType) => NamespaceStateType | undefined
  initFieldState: (namespace: NamespaceType, fieldName: FieldNameType, value: any, error: any) => void
  removeField: (namespace: NamespaceType, fieldName: FieldNameType) => void
  createGetSnapshotFieldState: (namespace: NamespaceType, fieldName: FieldNameType) => () => FieldStateType | undefined
  createGetSnapshotNamespaceState: (namespace: NamespaceType) => () => NamespaceStateType | undefined
  createSubscribeToField: (
    namespace: NamespaceType,
    fieldName: FieldNameType,
  ) => (listener: SubscriberListener) => () => void
  createSubscribeToNamespace: (namespace: NamespaceType) => (listener: SubscriberListener) => () => void
  updateFieldStateWithCallback: (
    namespace: NamespaceType,
    fieldName: FieldNameType,
    callback: UpdateFieldCallbackType,
  ) => void
}

const stateCreator = (): StateCreatorReturnType => {
  const state: StateType = {}
  const subscribers: SubscribersType = {}
  let idCounter = 0

  const getFieldState = (namespace: NamespaceType, fieldName: FieldNameType): FieldStateType | undefined =>
    state[namespace]?.[fieldName]

  const getNamespaceState = (namespace: NamespaceType): NamespaceStateType | undefined => state[namespace]

  const createGetSnapshotFieldState = (namespace: NamespaceType, fieldName: FieldNameType) => () =>
    getFieldState(namespace, fieldName)
  const createGetSnapshotNamespaceState = (namespace: NamespaceType) => () => getNamespaceState(namespace)

  const subscribe = (listener: any, namespace: NamespaceType, fieldName?: FieldNameType) => {
    if (!subscribers[namespace]) {
      subscribers[namespace] = new Map()
    }
    const id = ++idCounter
    subscribers[namespace].set(id, { listener, fieldName })

    return () => {
      subscribers[namespace] && subscribers[namespace].has(id) && subscribers[namespace].delete(id)
    }
  }

  const createSubscribeToField =
    (namespace: NamespaceType, fieldName: FieldNameType) => (listener: SubscriberListener) =>
      subscribe(listener, namespace, fieldName)

  const createSubscribeToNamespace = (namespace: NamespaceType) => (listener: SubscriberListener) =>
    subscribe(listener, namespace)

  const triggerSubscribers = (namespace: NamespaceType, _fieldName: FieldNameType) => {
    const namespaceSubscribers = subscribers[namespace]
    if (namespaceSubscribers) {
      namespaceSubscribers.forEach(({ listener, fieldName }: SubscriberType) => {
        if (!fieldName) {
          listener()
        }
        if (fieldName === _fieldName) {
          listener()
        }
      })
    }
  }

  const initFieldState = (namespace: NamespaceType, fieldName: FieldNameType, value: any, error: any) => {
    state[namespace] = {
      ...state[namespace],
      [fieldName]: {
        ...FIELD_STATE_DEFAULT,
        ...mapFieldValueAndError(value, error),
      },
    }

    triggerSubscribers(namespace, fieldName)
  }

  const updateFieldStateWithCallback = (
    namespace: NamespaceType,
    fieldName: FieldNameType,
    callback: UpdateFieldCallbackType,
  ) => {
    const currentFieldState = getFieldState(namespace, fieldName)
    if (currentFieldState) {
      const update = callback(currentFieldState)

      if (update) {
        state[namespace] = {
          ...state[namespace],
          [fieldName]: { ...currentFieldState, ...update },
        }

        triggerSubscribers(namespace, fieldName)
      }
    }
  }

  const removeField = (namespace: NamespaceType, fieldName: FieldNameType) => {
    if (state[namespace]?.[fieldName]) {
      delete state[namespace][fieldName]
      if (Object.keys(state[namespace]).length === 0) {
        delete state[namespace]
      }

      triggerSubscribers(namespace, fieldName)
    }
  }

  return {
    getFieldState,
    getNamespaceState,
    initFieldState,
    removeField,
    createGetSnapshotFieldState,
    createGetSnapshotNamespaceState,
    createSubscribeToField,
    createSubscribeToNamespace,
    updateFieldStateWithCallback,
  }
}

export const {
  getFieldState,
  getNamespaceState,
  initFieldState,
  removeField,
  createGetSnapshotFieldState,
  createGetSnapshotNamespaceState,
  createSubscribeToField,
  createSubscribeToNamespace,
  updateFieldStateWithCallback,
} = stateCreator()
