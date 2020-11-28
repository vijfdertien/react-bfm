import { clearField, resetField } from '..'
import { getNamespaceState } from '../state'

/**
 * Reset namespace, but ignoring the default values of the  fields
 * @param namespace
 */
export const clearNamespace = (namespace) => {
  const fieldNames = Object.keys(getNamespaceState(namespace))

  fieldNames.forEach((fieldName) => {
    clearField(namespace, fieldName)
  })
}

/**
 * Reset namespace to default state and setting last provided default value per field
 * @param namespace
 */
export const resetNamespace = (namespace) => {
  const fieldNames = Object.keys(getNamespaceState(namespace))

  fieldNames.forEach((fieldName) => {
    resetField(namespace, fieldName)
  })
}
