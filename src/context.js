import { createContext } from 'react'
import {
  FIELD_INITIAL_STATIC_VALUES,
  FIELD_KEY_DEFAULT_VALUE,
  FIELD_KEY_DEFAULT_VALUE_ERROR,
  FIELD_KEY_DIRTY,
  FIELD_KEY_ERROR,
  FIELD_KEY_FOCUS,
  FIELD_KEY_TOUCHED,
  FIELD_KEY_VALUE,
  FIELD_KEY_VALUE_ON_FOCUS,
} from './constants'
import { defaultDirtyCheck, mapFieldValueAndError, validateFieldName, validateNamespace } from './helpers'
import {
  getFieldState,
  getNamespaceState,
  removeField,
  subscribeToField,
  subscribeToNamespace,
  updateFieldStateWithCallback,
} from './state'

/**
 * @param namespace
 * @param fieldName
 * @returns {Object}
 */
const focusField = (namespace, fieldName) => {
  updateFieldStateWithCallback(namespace, fieldName, (currentState) => ({
    [FIELD_KEY_FOCUS]: true,
    [FIELD_KEY_VALUE_ON_FOCUS]: currentState[FIELD_KEY_VALUE],
  }))
}

/**
 * @param namespace
 * @param fieldName
 * @param value
 * @param error
 * @param dirtyCheck
 * @returns {Object}
 */
const changeField = (namespace, fieldName, value, error, dirtyCheck = defaultDirtyCheck) => {
  updateFieldStateWithCallback(namespace, fieldName, (currentState) => ({
    [FIELD_KEY_DIRTY]: dirtyCheck(value, currentState[FIELD_KEY_VALUE_ON_FOCUS]),
    ...mapFieldValueAndError(value, error),
  }))
}

/**
 * @param namespace
 * @param fieldName
 * @returns {Object}
 */
const blurField = (namespace, fieldName) => {
  updateFieldStateWithCallback(namespace, fieldName, () => ({
    [FIELD_KEY_FOCUS]: false,
    [FIELD_KEY_TOUCHED]: true,
    [FIELD_KEY_VALUE_ON_FOCUS]: null,
  }))
}

/**
 * @param {string} namespace
 * @param {string} fieldName
 * @param {string|Array|Object|boolean|null} value
 * @param {string|Array|Object|boolean|null} error
 * @returns {*}
 */
const initField = (namespace, fieldName, value, error) => {
  if (!validateNamespace(namespace)) {
    throw new Error('Expected string with a minimal length of 1 for `namespace`')
  }
  if (!validateFieldName(fieldName)) {
    throw new Error('Expected string with a minimal length of 1 for `fieldName`')
  }

  updateFieldStateWithCallback(namespace, fieldName, () => ({
    ...FIELD_INITIAL_STATIC_VALUES,
    ...mapFieldValueAndError(value, error),
  }))

  return getFieldState(namespace, fieldName)
}

/**
 * sets default value only when the field is not touched or has focus
 * this way you can still change the input value after first rendering
 *
 * @param namespace
 * @param fieldName
 * @param defaultValue
 * @param error
 */
const defaultValueField = (namespace, fieldName, defaultValue, error) =>
  updateFieldStateWithCallback(namespace, fieldName, (currentState) => {
    // only update value and error when field is not dirty or has focus
    const updateState =
      !currentState[FIELD_KEY_DIRTY] && !currentState[FIELD_KEY_FOCUS] && currentState[FIELD_KEY_VALUE] !== defaultValue
        ? mapFieldValueAndError(defaultValue, error)
        : {}

    // update error if value is still default
    if (currentState[FIELD_KEY_VALUE] === defaultValue && currentState[FIELD_KEY_ERROR] !== error) {
      updateState.error = error
    }

    return {
      ...updateState,
      [FIELD_KEY_DEFAULT_VALUE]: defaultValue,
      [FIELD_KEY_DEFAULT_VALUE_ERROR]: error,
    }
  })

export const BFMHooksContext = createContext({
  blurField,
  changeField,
  defaultValueField,
  focusField,
  getFieldState,
  getNamespaceState,
  initField,
  removeField,
  subscribeToField,
  subscribeToNamespace,
})
