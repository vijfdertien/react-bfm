import {
  FIELD_DEFAULT_DEFAULT_VALUE,
  FIELD_DEFAULT_ERROR,
  FIELD_DEFAULT_VALUE,
  FIELD_DEFAULT_VALUE_ON_FOCUS,
  FIELD_KEY_DEFAULT_VALUE,
  FIELD_KEY_DIRTY,
  FIELD_KEY_ERROR,
  FIELD_KEY_FOCUS,
  FIELD_KEY_TOUCHED,
  FIELD_KEY_VALID,
  FIELD_KEY_VALUE,
  FIELD_KEY_VALUE_ON_FOCUS,
} from '../constants'
import { getNamespaceState } from '../state'

/**
 * @param {string|symbol} key
 * @param defaultValue
 * @returns {function(namespace:string): Object}
 */
export const creatorGetNamespace = (key, defaultValue) => (namespace) =>
  Object.entries(getNamespaceState(namespace)).reduce((values, [fieldName, fieldState]) => {
    values[fieldName] = key in fieldState ? fieldState[key] : defaultValue
    return values
  }, {})

/**
 * @param {string|Symbol} key
 * @returns {function(namespace:string): boolean}
 */
export const creatorIsEveryNamespace = (key) => (namespace) =>
  Object.values(getNamespaceState(namespace)).every((fieldState) => fieldState[key] || false)

/**
 * @param {string|Symbol} key
 * @returns {function(namespace:string): boolean}
 */
export const creatorIsSomeNamespace = (key) => (namespace) =>
  Object.values(getNamespaceState(namespace)).some((fieldState) => fieldState[key] || false)

/**
 * @param {string} namespace
 * @return {Object.<string, string|Array|Object|boolean>} Key is fieldName
 */
export const getNamespaceDefaultValues = creatorGetNamespace(FIELD_KEY_DEFAULT_VALUE, FIELD_DEFAULT_DEFAULT_VALUE)

/**
 * @param {string} namespace
 * @return {Object.<string, string|Array|Object|boolean|null>} Key is fieldName, Falsy error values are always returned as null
 */
export const getNamespaceErrors = creatorGetNamespace(FIELD_KEY_ERROR, FIELD_DEFAULT_ERROR)

/**
 * @param {string} namespace
 * @return {Object.<string, string|Array|Object|boolean>} Key is fieldName
 */
export const getNamespaceValues = creatorGetNamespace(FIELD_KEY_VALUE, FIELD_DEFAULT_VALUE)

/**
 * @param {string} namespace
 * @return {Object.<string, string|Array|Object|boolean>} Key is fieldName
 */
export const getNamespaceValuesOnFocus = creatorGetNamespace(FIELD_KEY_VALUE_ON_FOCUS, FIELD_DEFAULT_VALUE_ON_FOCUS)

/**
 * @param {string} namespace
 * @return {boolean}
 */
export const hasNamespaceFocus = creatorIsSomeNamespace(FIELD_KEY_FOCUS)

/**
 * @param {string} namespace
 * @return {boolean}
 */
export const isNamespaceDirty = creatorIsSomeNamespace(FIELD_KEY_DIRTY)

/**
 * @param {string} namespace
 * @return {boolean}
 */
export const isNamespaceTouched = creatorIsSomeNamespace(FIELD_KEY_TOUCHED)

/**
 * @param {string} namespace
 * @return {boolean}
 */
export const isNamespaceValid = creatorIsEveryNamespace(FIELD_KEY_VALID)
