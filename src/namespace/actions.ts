import { clearField, resetField } from '..'
import { getNamespaceState } from '../state'
import { FieldNameType, NamespaceType } from '../common'

/**
 * Reset namespace, but ignoring the default values of the fields
 */
export const clearNamespace = (namespace: NamespaceType): void => {
  const fieldNames = Object.keys(getNamespaceState(namespace))

  fieldNames.forEach((fieldName: FieldNameType) => {
    clearField(namespace, fieldName)
  })
}

/**
 * Reset namespace to default state and setting last provided default value per field
 */
export const resetNamespace = (namespace: NamespaceType): void => {
  const fieldNames = Object.keys(getNamespaceState(namespace))

  fieldNames.forEach((fieldName: FieldNameType) => {
    resetField(namespace, fieldName)
  })
}
