import {
  FIELD_DEFAULT_ERROR,
  FIELD_DEFAULT_VALUE,
  FIELD_INITIAL_STATIC_VALUES,
  FIELD_KEY_DEFAULT_VALUE,
  FIELD_KEY_DEFAULT_VALUE_ERROR,
} from '../constants'
import { mapFieldValueAndError } from '../helpers'
import { updateFieldStateWithCallback } from '../state'

/**
 * Reset field, but ignoring default value
 * @param namespace
 * @param fieldName
 */
export const clearField = (namespace, fieldName) => {
  updateFieldStateWithCallback(namespace, fieldName, () => ({
    ...FIELD_INITIAL_STATIC_VALUES,
    ...mapFieldValueAndError(FIELD_DEFAULT_VALUE, FIELD_DEFAULT_ERROR),
  }))
}

/**
 * Reset field to default state and setting last provided default value
 * @param namespace
 * @param fieldName
 */
export const resetField = (namespace, fieldName) => {
  // reset field to default state and setting last provided default value
  updateFieldStateWithCallback(namespace, fieldName, (currentState) => ({
    ...FIELD_INITIAL_STATIC_VALUES,
    ...mapFieldValueAndError(
      currentState[FIELD_KEY_DEFAULT_VALUE] || FIELD_DEFAULT_VALUE,
      currentState[FIELD_KEY_DEFAULT_VALUE_ERROR] || FIELD_DEFAULT_ERROR
    ),
  }))
}
