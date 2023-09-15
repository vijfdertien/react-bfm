import { FIELD_STATE_DEFAULT, NAMESPACE_STATE_DEFAULT } from './constants/state-defaults'
import {
  FieldNameType,
  FieldStateType,
  NamespaceStateType,
  NamespaceType,
  SubscriberFieldCallbackType,
  SubscriberNamespaceCallbackType,
  UpdateFieldCallbackType,
} from './common'

interface StateType {
  [namespace: NamespaceType]: NamespaceStateType
}

interface SubscriberType {
  fieldName?: FieldNameType
  fieldCallback?: SubscriberFieldCallbackType
  namespaceCallback?: SubscriberNamespaceCallbackType
}

interface SubscriberNamespaceType extends SubscriberType {
  namespace: string
}

type SubscribersMapType = Map<number, SubscriberType>

interface SubscribersType {
  [namespace: NamespaceType]: SubscribersMapType
}

export interface StateCreatorReturnType {
  getFieldState: (namespace: NamespaceType, fieldName: FieldNameType) => FieldStateType
  getNamespaceState: (namespace: NamespaceType) => NamespaceStateType
  removeField: (namespace: NamespaceType, fieldName: FieldNameType) => void
  subscribeToField: (
    namespace: NamespaceType,
    fieldName: FieldNameType,
    fieldCallback: SubscriberFieldCallbackType,
  ) => () => void
  subscribeToNamespace: (namespace: NamespaceType, namespaceCallback: SubscriberNamespaceCallbackType) => () => void
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

  const getFieldState = (namespace: NamespaceType, fieldName: FieldNameType): FieldStateType =>
    state[namespace]?.[fieldName] || FIELD_STATE_DEFAULT

  const getNamespaceState = (namespace: NamespaceType): NamespaceStateType =>
    state[namespace] || NAMESPACE_STATE_DEFAULT

  const subscribe = ({ namespace, ...subscriber }: SubscriberNamespaceType) => {
    if (!subscribers[namespace]) {
      subscribers[namespace] = new Map()
    }
    const id = ++idCounter
    subscribers[namespace].set(id, subscriber)

    return () => {
      subscribers[namespace] && subscribers[namespace].has(id) && subscribers[namespace].delete(id)
    }
  }

  const subscribeToField = (
    namespace: NamespaceType,
    fieldName: FieldNameType,
    fieldCallback: SubscriberFieldCallbackType,
  ) => subscribe({ namespace, fieldName, fieldCallback })

  const subscribeToNamespace = (namespace: NamespaceType, namespaceCallback: SubscriberNamespaceCallbackType) =>
    subscribe({ namespace, namespaceCallback })

  const triggerSubscribers = (namespace: NamespaceType, _fieldName: FieldNameType) => {
    const namespaceSubscribers = subscribers[namespace]
    if (namespaceSubscribers) {
      const fieldState = getFieldState(namespace, _fieldName)
      const namespaceState = getNamespaceState(namespace)

      namespaceSubscribers.forEach(({ fieldCallback, namespaceCallback, fieldName }: SubscriberType) => {
        if (namespaceCallback && !fieldName) {
          namespaceCallback(namespaceState)
        }
        if (fieldCallback && fieldName === _fieldName) {
          fieldCallback(fieldState)
        }
      })
    }
  }

  const updateFieldStateWithCallback = (
    namespace: NamespaceType,
    fieldName: FieldNameType,
    callback: UpdateFieldCallbackType,
  ) => {
    const currentFieldState: FieldStateType = getFieldState(namespace, fieldName)
    const update = callback(currentFieldState)

    if (update) {
      state[namespace] = {
        ...state[namespace],
        [fieldName]: { ...currentFieldState, ...update },
      }

      triggerSubscribers(namespace, fieldName)
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
    removeField,
    subscribeToField,
    subscribeToNamespace,
    updateFieldStateWithCallback,
  }
}

export const {
  getFieldState,
  getNamespaceState,
  removeField,
  subscribeToField,
  subscribeToNamespace,
  updateFieldStateWithCallback,
} = stateCreator()
