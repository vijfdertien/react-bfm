export const FIELD_DEFAULT_DEFAULT_VALUE = undefined
export const FIELD_DEFAULT_DEFAULT_VALUE_ERROR = undefined
export const FIELD_DEFAULT_DIRTY = false
export const FIELD_DEFAULT_ERROR = null
export const FIELD_DEFAULT_FOCUS = false
export const FIELD_DEFAULT_TOUCHED = false
export const FIELD_DEFAULT_VALID = true
export const FIELD_DEFAULT_VALUE = ''
export const FIELD_DEFAULT_VALUE_ON_FOCUS = null

export const FIELD_STATE_DEFAULT = {}
Object.freeze(FIELD_STATE_DEFAULT)

export const NAMESPACE_STATE_DEFAULT = {}
Object.freeze(NAMESPACE_STATE_DEFAULT)

// Symbol keys are normally only for internal use, these will be hidden as field prop
export const FIELD_KEY_DEFAULT_VALUE = Symbol('defaultValue')
export const FIELD_KEY_DEFAULT_VALUE_ERROR = Symbol('defaultValueError')
export const FIELD_KEY_DIRTY = 'dirty'
export const FIELD_KEY_ERROR = 'error'
export const FIELD_KEY_FOCUS = 'focus'
export const FIELD_KEY_TOUCHED = 'touched'
export const FIELD_KEY_VALID = 'valid'
export const FIELD_KEY_VALUE = 'value'
export const FIELD_KEY_VALUE_ON_FOCUS = Symbol('valueOnFocus')

export const FIELD_INITIAL_STATIC_VALUES = {
  [FIELD_KEY_DIRTY]: FIELD_DEFAULT_DIRTY,
  [FIELD_KEY_FOCUS]: FIELD_DEFAULT_DIRTY,
  [FIELD_KEY_TOUCHED]: FIELD_DEFAULT_DIRTY,
  [FIELD_KEY_VALUE_ON_FOCUS]: FIELD_DEFAULT_VALUE_ON_FOCUS,
  [FIELD_KEY_DEFAULT_VALUE]: FIELD_DEFAULT_DEFAULT_VALUE,
  [FIELD_KEY_DEFAULT_VALUE_ERROR]: FIELD_DEFAULT_DEFAULT_VALUE_ERROR,
}
