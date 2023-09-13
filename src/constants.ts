import { FieldStateType, NamespaceStateType } from './types'

// default values for keys
export const FIELD_DEFAULT_DEFAULT_VALUE = undefined
export const FIELD_DEFAULT_DEFAULT_VALUE_ERROR = undefined
export const FIELD_DEFAULT_DIRTY = false
export const FIELD_DEFAULT_ERROR = null
export const FIELD_DEFAULT_FOCUS = false
export const FIELD_DEFAULT_TOUCHED = false
export const FIELD_DEFAULT_VALID = true
export const FIELD_DEFAULT_VALUE = ''
export const FIELD_DEFAULT_VALUE_ON_FOCUS = null

// keys
export const FIELD_KEY_DEFAULT_VALUE = 'defaultValue'
export const FIELD_KEY_DEFAULT_VALUE_ERROR = 'defaultValueError'
export const FIELD_KEY_DIRTY = 'dirty'
export const FIELD_KEY_ERROR = 'error'
export const FIELD_KEY_FOCUS = 'focus'
export const FIELD_KEY_TOUCHED = 'touched'
export const FIELD_KEY_VALID = 'valid'
export const FIELD_KEY_VALUE = 'value'
export const FIELD_KEY_VALUE_ON_FOCUS = 'valueOnFocus'

export const FIELD_STATE_DEFAULT: FieldStateType = {
  [FIELD_KEY_ERROR]: FIELD_DEFAULT_ERROR,
  [FIELD_KEY_VALID]: FIELD_DEFAULT_VALID,
  [FIELD_KEY_VALUE]: FIELD_DEFAULT_VALUE,
  [FIELD_KEY_DIRTY]: FIELD_DEFAULT_DIRTY,
  [FIELD_KEY_FOCUS]: FIELD_DEFAULT_FOCUS,
  [FIELD_KEY_TOUCHED]: FIELD_DEFAULT_TOUCHED,
  [FIELD_KEY_VALUE_ON_FOCUS]: FIELD_DEFAULT_VALUE_ON_FOCUS,
  [FIELD_KEY_DEFAULT_VALUE]: FIELD_DEFAULT_DEFAULT_VALUE,
  [FIELD_KEY_DEFAULT_VALUE_ERROR]: FIELD_DEFAULT_DEFAULT_VALUE_ERROR,
}
Object.freeze(FIELD_STATE_DEFAULT)

export const NAMESPACE_STATE_DEFAULT: NamespaceStateType = {}
Object.freeze(NAMESPACE_STATE_DEFAULT)
