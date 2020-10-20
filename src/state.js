import { FIELD_STATE_DEFAULT, NAMESPACE_STATE_DEFAULT } from './constants'

const stateCreator = () => {
  const state = {}
  const subscribers = {}
  let idCounter = 0

  /**
   * @param namespace
   * @param fieldName
   * @returns {Object}
   */
  const getFieldState = (namespace, fieldName) => state[namespace]?.[fieldName] || FIELD_STATE_DEFAULT

  /**
   * @param namespace
   * @returns {Object}
   */
  const getNamespaceState = (namespace) => state[namespace] || NAMESPACE_STATE_DEFAULT

  const subscribe = (callback, namespace, fieldName) => {
    if (!subscribers[namespace]) {
      subscribers[namespace] = new Map()
    }
    const id = ++idCounter
    subscribers[namespace].set(id, { fieldName, callback })

    return () => {
      subscribers[namespace] && subscribers[namespace].has(id) && subscribers[namespace].delete(id)
    }
  }

  const subscribeToField = (namespace, fieldName, callback) => subscribe(callback, namespace, fieldName)

  const subscribeToNamespace = (namespace, callback) => subscribe(callback, namespace)

  const triggerSubscribers = (namespace, _fieldName) => {
    const namespaceSubscribers = subscribers[namespace]
    if (namespaceSubscribers) {
      const fieldState = getFieldState(namespace, _fieldName)
      const namespaceState = getNamespaceState(namespace)

      namespaceSubscribers.forEach(({ callback, fieldName }) => {
        if (!fieldName) {
          callback(namespaceState)
        } else if (fieldName === _fieldName) {
          callback(fieldState)
        }
      })
    }
  }

  const updateFieldStateWithCallback = (namespace, fieldName, callback) => {
    const currentFieldState = getFieldState(namespace, fieldName)
    const update = callback(currentFieldState)

    if (update) {
      // todo: add validation for development
      state[namespace] = {
        ...state[namespace],
        [fieldName]: { ...currentFieldState, ...update },
      }

      triggerSubscribers(namespace, fieldName)
    }
  }

  const removeField = (namespace, fieldName) => {
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
