import {
  FieldNameType,
  FieldStateType,
  NamespaceStateType,
  NamespaceType,
  SubscriberFieldCallbackType,
  SubscriberNamespaceCallbackType,
  UpdateFieldCallbackType,
} from './common'
import { FIELD_STATE_DEFAULT } from './constants/state-defaults'
import { mapFieldValueAndError } from './helpers'

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
  getFieldState: (namespace: NamespaceType, fieldName: FieldNameType) => FieldStateType | undefined
  getNamespaceState: (namespace: NamespaceType) => NamespaceStateType | undefined
  initFieldState: (namespace: NamespaceType, fieldName: FieldNameType, value: any, error: any) => void
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

  const getFieldState = (namespace: NamespaceType, fieldName: FieldNameType): FieldStateType | undefined =>
    state[namespace]?.[fieldName]

  const getNamespaceState = (namespace: NamespaceType): NamespaceStateType | undefined => state[namespace]

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
  ) => {
    const unsubscribe = subscribe({ namespace, fieldName, fieldCallback })
    const fieldState = getFieldState(namespace, fieldName)
    if (fieldState) {
      fieldCallback(fieldState)
    }
    return unsubscribe
  }

  const subscribeToNamespace = (namespace: NamespaceType, namespaceCallback: SubscriberNamespaceCallbackType) => {
    const unsubscribe = subscribe({ namespace, namespaceCallback })
    const namespaceState = getNamespaceState(namespace)
    if (namespaceState) {
      namespaceCallback(namespaceState)
    }
    return unsubscribe
  }

  const triggerSubscribers = (namespace: NamespaceType, _fieldName: FieldNameType) => {
    const namespaceSubscribers = subscribers[namespace]
    if (namespaceSubscribers) {
      const fieldState = getFieldState(namespace, _fieldName)
      const namespaceState = getNamespaceState(namespace)

      namespaceSubscribers.forEach(({ fieldCallback, namespaceCallback, fieldName }: SubscriberType) => {
        if (namespaceState && namespaceCallback && !fieldName) {
          namespaceCallback(namespaceState)
        }
        if (fieldState && fieldCallback && fieldName === _fieldName) {
          fieldCallback(fieldState)
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
    subscribeToField,
    subscribeToNamespace,
    updateFieldStateWithCallback,
  }
}

export const {
  getFieldState,
  getNamespaceState,
  initFieldState,
  removeField,
  subscribeToField,
  subscribeToNamespace,
  updateFieldStateWithCallback,
} = stateCreator()
