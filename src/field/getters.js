import {
  FIELD_DEFAULT_DEFAULT_VALUE,
  FIELD_DEFAULT_DIRTY,
  FIELD_DEFAULT_ERROR,
  FIELD_DEFAULT_FOCUS,
  FIELD_DEFAULT_TOUCHED,
  FIELD_DEFAULT_VALID,
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
import { getFieldState } from '../state'

/**
 * @param {string|symbol} key
 * @param {string|Array|Object|boolean} defaultValue
 * @returns {function(namespace:string, fieldName:string)}
 */
export const creatorGetField = (key, defaultValue) => (namespace, fieldName) => {
  const fieldState = getFieldState(namespace, fieldName)
  if (key in fieldState) {
    return fieldState[key]
  }
  return defaultValue
}

/**
 * @param {string} namespace
 * @param {string} fieldName
 * @return {string|Array|Object|boolean|null} Falsy error values are always returned as null
 */
export const getFieldError = creatorGetField(FIELD_KEY_ERROR, FIELD_DEFAULT_ERROR)

/**
 * @param {string} namespace
 * @param {string} fieldName
 * @return {string|Array|Object|boolean}
 */
export const getFieldValue = creatorGetField(FIELD_KEY_VALUE, FIELD_DEFAULT_VALUE)

/**
 * @param {string} namespace
 * @param {string} fieldName
 * @return {string|Array|Object|boolean}
 */
export const getFieldDefaultValue = creatorGetField(FIELD_KEY_DEFAULT_VALUE, FIELD_DEFAULT_DEFAULT_VALUE)

/**
 * @param {string} namespace
 * @param {string} fieldName
 * @return {string|Array|Object|boolean}
 */
export const getFieldValueOnFocus = creatorGetField(FIELD_KEY_VALUE_ON_FOCUS, FIELD_DEFAULT_VALUE_ON_FOCUS)

/**
 * @param {string} namespace
 * @param {string} fieldName
 * @return {boolean}
 */
export const hasFieldFocus = creatorGetField(FIELD_KEY_FOCUS, FIELD_DEFAULT_FOCUS)

/**
 * @param {string} namespace
 * @param {string} fieldName
 * @return {boolean}
 */
export const isFieldDirty = creatorGetField(FIELD_KEY_DIRTY, FIELD_DEFAULT_DIRTY)

/**
 * @param {string} namespace
 * @param {string} fieldName
 * @return {boolean}
 */
export const isFieldTouched = creatorGetField(FIELD_KEY_TOUCHED, FIELD_DEFAULT_TOUCHED)

/**
 * @param {string} namespace
 * @param {string} fieldName
 * @return {boolean}
 */
export const isFieldValid = creatorGetField(FIELD_KEY_VALID, FIELD_DEFAULT_VALID)
