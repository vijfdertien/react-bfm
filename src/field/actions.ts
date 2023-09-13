import {
  FIELD_DEFAULT_ERROR,
  FIELD_DEFAULT_VALUE,
  FIELD_KEY_DEFAULT_VALUE,
  FIELD_KEY_DEFAULT_VALUE_ERROR,
  FIELD_STATE_DEFAULT,
} from '../constants'
import { mapFieldValueAndError } from '../helpers'
import { updateFieldStateWithCallback } from '../state'
import { FieldNameType, FieldStateType, NamespaceType } from '../types'

/**
 * Reset field, but ignoring default value
 */
export const clearField = (namespace: NamespaceType, fieldName: FieldNameType): void => {
  updateFieldStateWithCallback(namespace, fieldName, () => ({
    ...FIELD_STATE_DEFAULT,
    ...mapFieldValueAndError(FIELD_DEFAULT_VALUE, FIELD_DEFAULT_ERROR),
  }))
}
/**
 * Reset field to default state and setting last provided default value
 */
export const resetField = (namespace: NamespaceType, fieldName: FieldNameType): void => {
  updateFieldStateWithCallback(namespace, fieldName, (currentState: FieldStateType) => ({
    ...FIELD_STATE_DEFAULT,
    ...mapFieldValueAndError(
      currentState[FIELD_KEY_DEFAULT_VALUE] || FIELD_DEFAULT_VALUE,
      currentState[FIELD_KEY_DEFAULT_VALUE_ERROR],
    ),
  }))
}
