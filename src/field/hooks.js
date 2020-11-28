import { useContext, useEffect, useState } from 'react'
import {
  FIELD_DEFAULT_DIRTY,
  FIELD_DEFAULT_ERROR,
  FIELD_DEFAULT_FOCUS,
  FIELD_DEFAULT_TOUCHED,
  FIELD_DEFAULT_VALID,
  FIELD_DEFAULT_VALUE,
  FIELD_DEFAULT_VALUE_ON_FOCUS,
  FIELD_KEY_DIRTY,
  FIELD_KEY_ERROR,
  FIELD_KEY_FOCUS,
  FIELD_KEY_TOUCHED,
  FIELD_KEY_VALID,
  FIELD_KEY_VALUE,
  FIELD_KEY_VALUE_ON_FOCUS,
} from '../constants'
import { BFMHooksContext } from '../context'
import { validateFieldName, validateNamespace } from '../helpers'

/**
 * @param {string|symbol} key
 * @param {string|Array|Object|boolean} defaultValue
 * @returns {function(namespace, fieldName)}
 */
export const creatorUseField = (key, defaultValue) => {
  const getValueFromState = (fieldState) => (key in (fieldState || {}) ? fieldState[key] : defaultValue)

  return (namespace, fieldName) => {
    if (process.env.NODE_ENV !== 'production') {
      validateNamespace(namespace) || console.error('Expected string with a minimal length of 1 for `namespace`') // eslint-disable-line no-console
      validateFieldName(fieldName) || console.error('Expected string with a minimal length of 1 for `fieldName`') // eslint-disable-line no-console
    }
    const { getFieldState, subscribeToField } = useContext(BFMHooksContext)

    const [value, setValue] = useState(getValueFromState(getFieldState(namespace, fieldName)))

    useEffect(
      () =>
        subscribeToField(namespace, fieldName, (fieldState) => {
          setValue(getValueFromState(fieldState))
        }),
      [fieldName, namespace, subscribeToField]
    )

    return value
  }
}

/**
 * @param {string} namespace
 * @param {string} fieldName
 * @return {string|Array|Object|boolean|null} Falsy error values are always returned as null
 */
export const useFieldError = creatorUseField(FIELD_KEY_ERROR, FIELD_DEFAULT_ERROR)

/**
 * @param {string} namespace
 * @param {string} fieldName
 * @return {string|Array|Object|boolean}
 */
export const useFieldHasFocus = creatorUseField(FIELD_KEY_FOCUS, FIELD_DEFAULT_FOCUS)

/**
 * @param {string} namespace
 * @param {string} fieldName
 * @return {boolean}
 */
export const useFieldIsDirty = creatorUseField(FIELD_KEY_DIRTY, FIELD_DEFAULT_DIRTY)

/**
 * @param {string} namespace
 * @param {string} fieldName
 * @return {boolean}
 */
export const useFieldIsTouched = creatorUseField(FIELD_KEY_TOUCHED, FIELD_DEFAULT_TOUCHED)

/**
 * @param {string} namespace
 * @param {string} fieldName
 * @return {boolean}
 */
export const useFieldIsValid = creatorUseField(FIELD_KEY_VALID, FIELD_DEFAULT_VALID)

/**
 * @param {string} namespace
 * @param {string} fieldName
 * @return {string|Array|Object|boolean|null}
 */
export const useFieldValue = creatorUseField(FIELD_KEY_VALUE, FIELD_DEFAULT_VALUE)

/**
 * @param {string} namespace
 * @param {string} fieldName
 * @return {string|Array|Object|boolean|null}
 */
export const useFieldValueOnFocus = creatorUseField(FIELD_KEY_VALUE_ON_FOCUS, FIELD_DEFAULT_VALUE_ON_FOCUS)
