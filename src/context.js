import { createContext } from 'react'
import {
  FIELD_KEY_DIRTY,
  FIELD_KEY_ERROR,
  FIELD_KEY_FOCUS,
  FIELD_KEY_TOUCHED,
  FIELD_KEY_VALID,
  FIELD_KEY_VALUE,
  FIELD_KEY_VALUE_ON_FOCUS,
} from './constants'
import { defaultDirtyCheck, validateFieldName, validateNamespace } from './helpers'
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
    [FIELD_KEY_ERROR]: error || null,
    [FIELD_KEY_VALID]: !error,
    [FIELD_KEY_VALUE]: value,
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
    [FIELD_KEY_DIRTY]: false,
    [FIELD_KEY_ERROR]: error || null,
    [FIELD_KEY_FOCUS]: false,
    [FIELD_KEY_TOUCHED]: false,
    [FIELD_KEY_VALID]: !error,
    [FIELD_KEY_VALUE]: value,
  }))

  return getFieldState(namespace, fieldName)
}

/**
 * sets default value only when the field is not touched or has focus
 * this way you can still change the input value after first rendering
 *
 * @param namespace
 * @param fieldName
 * @param value
 * @param error
 */
const defaultValueField = (namespace, fieldName, value, error) =>
  updateFieldStateWithCallback(
    namespace,
    fieldName,
    (currentState) =>
      !currentState[FIELD_KEY_TOUCHED] &&
      !currentState[FIELD_KEY_FOCUS] &&
      currentState[FIELD_KEY_VALUE] !== value && {
        [FIELD_KEY_ERROR]: error || null,
        [FIELD_KEY_VALID]: !error,
        [FIELD_KEY_VALUE]: value,
      }
  )

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
