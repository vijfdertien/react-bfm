import { useContext, useEffect, useState } from 'react'
import {
  FIELD_DEFAULT_ERROR,
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
import { validateNamespace } from '../helpers'

/**
 * @param {function} getValueFromState
 * @returns {function(namespace:string)}
 */
export const creatorUseNamespace = (getValueFromState) => (namespace) => {
  if (process.env.NODE_ENV !== 'production') {
    validateNamespace(namespace) || console.error('Expected string with a minimal length of 1 for `namespace`') // eslint-disable-line no-console
  }
  const { getNamespaceState, subscribeToNamespace } = useContext(BFMHooksContext)

  const [value, setValue] = useState(getValueFromState(getNamespaceState(namespace)))

  useEffect(
    () =>
      subscribeToNamespace(namespace, (namespaceState) => {
        setValue(getValueFromState(namespaceState))
      }),
    [namespace, subscribeToNamespace]
  )

  return value
}

/**
 * @param {string|symbol} key
 * @param {string|Array|Object|boolean} defaultValue
 * @returns {function(namespace:string): Object}
 */
export const creatorUseGetNamespace = (key, defaultValue) => {
  const getValueFromState = (namespaceState) =>
    Object.entries(namespaceState).reduce((values, [fieldName, fieldState]) => {
      values[fieldName] = key in fieldState ? fieldState[key] : defaultValue
      return values
    }, {})

  return creatorUseNamespace(getValueFromState)
}

/**
 * @param {string|symbol} key
 * @returns {function(namespace:string): boolean}
 */
export const creatorUseIsEveryNamespace = (key) => {
  const getValueFromState = (namespaceState) =>
    Object.values(namespaceState).every((fieldState) => fieldState[key] || false)

  return creatorUseNamespace(getValueFromState)
}

/**
 * @param {string|symbol} key
 * @returns {function(namespace:string): boolean}
 */
export const creatorUseIsSomeNamespace = (key) => {
  const getValueFromState = (namespaceState) =>
    Object.values(namespaceState).some((fieldState) => fieldState[key] || false)

  return creatorUseNamespace(getValueFromState)
}

/**
 * @param {string} namespace
 * @return {string|Array|Object|boolean|null} Falsy error values are always returned as null
 */
export const useNamespaceErrors = creatorUseGetNamespace(FIELD_KEY_ERROR, FIELD_DEFAULT_ERROR)

/**
 * @param {string} namespace
 * @return {string|Array|Object|boolean}
 */
export const useNamespaceHasFocus = creatorUseIsSomeNamespace(FIELD_KEY_FOCUS)

/**
 * @param {string} namespace
 * @return {boolean}
 */
export const useNamespaceIsDirty = creatorUseIsSomeNamespace(FIELD_KEY_DIRTY)

/**
 * @param {string} namespace
 * @return {boolean}
 */
export const useNamespaceIsTouched = creatorUseIsSomeNamespace(FIELD_KEY_TOUCHED)

/**
 * @param {string} namespace
 * @return {boolean}
 */
export const useNamespaceIsValid = creatorUseIsEveryNamespace(FIELD_KEY_VALID)

/**
 * @param {string} namespace
 * @return {string|Array|Object|boolean|null}
 */
export const useNamespaceValues = creatorUseGetNamespace(FIELD_KEY_VALUE, FIELD_DEFAULT_VALUE)

/**
 * @param {string} namespace
 * @return {string|Array|Object|boolean|null}
 */
export const useNamespaceValuesOnFocus = creatorUseGetNamespace(FIELD_KEY_VALUE_ON_FOCUS, FIELD_DEFAULT_VALUE_ON_FOCUS)
