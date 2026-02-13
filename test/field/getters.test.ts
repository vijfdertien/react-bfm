import {
  FIELD_DEFAULT_ERROR,
  FIELD_DEFAULT_VALID,
  FIELD_DEFAULT_VALUE_ON_FOCUS,
  FIELD_KEY_INITIAL_VALUE,
  FIELD_KEY_DIRTY,
  FIELD_KEY_ERROR,
  FIELD_KEY_FOCUS,
  FIELD_KEY_TOUCHED,
  FIELD_KEY_VALID,
  FIELD_KEY_VALUE,
  FIELD_KEY_VALUE_ON_FOCUS,
  FIELD_STATE_DEFAULT,
  getFieldInitialValue,
  getFieldError,
  getFieldState,
  getFieldValue,
  getFieldValueOnFocus,
  hasFieldFocus,
  isFieldDirty,
  isFieldTouched,
  isFieldValid,
} from '../../src'
import mocked = jest.mocked

jest.mock('../../src/state')

describe('getFieldInitialValue', () => {
  it('should return the value', () => {
    mocked(getFieldState).mockReturnValueOnce({ ...FIELD_STATE_DEFAULT, [FIELD_KEY_INITIAL_VALUE]: 'foobar' })
    expect(getFieldInitialValue('spaceName', 'nameField')).toBe('foobar')
  })
  it('should return undefined when missing', () => {
    mocked(getFieldState).mockReturnValue({
      initialValue: undefined,
      initialValueError: undefined,
      dirty: false,
      error: undefined,
      focus: false,
      touched: false,
      valid: false,
      value: undefined,
      valueOnFocus: undefined,
    })
    expect(getFieldInitialValue('spaceName', 'nameField')).toBeUndefined()
  })
})

describe('getFieldError', () => {
  it('should return the value', () => {
    mocked(getFieldState).mockReturnValueOnce({ ...FIELD_STATE_DEFAULT, [FIELD_KEY_ERROR]: 'foobar' })
    expect(getFieldError('spaceName', 'nameField')).toBe('foobar')
  })
  it('should return the default value', () => {
    mocked(getFieldState).mockReturnValueOnce(FIELD_STATE_DEFAULT)
    expect(getFieldError('spaceName', 'nameField')).toBe(FIELD_DEFAULT_ERROR)
  })
})

describe('getFieldValue', () => {
  it('should return the value', () => {
    mocked(getFieldState).mockReturnValueOnce({ ...FIELD_STATE_DEFAULT, [FIELD_KEY_VALUE]: 'foobar' })
    expect(getFieldValue('spaceName', 'nameField')).toBe('foobar')
  })
  it('should return undefined when missing', () => {
    mocked(getFieldState).mockReturnValueOnce(FIELD_STATE_DEFAULT)
    expect(getFieldValue('spaceName', 'nameField')).toBeUndefined()
  })
})

describe('getFieldValueOnFocus', () => {
  it('should return the value', () => {
    mocked(getFieldState).mockReturnValueOnce({ ...FIELD_STATE_DEFAULT, [FIELD_KEY_VALUE_ON_FOCUS]: 'foobar' })
    expect(getFieldValueOnFocus('spaceName', 'nameField')).toBe('foobar')
  })
  it('should return the default value', () => {
    mocked(getFieldState).mockReturnValueOnce(FIELD_STATE_DEFAULT)
    expect(getFieldValueOnFocus('spaceName', 'nameField')).toBe(FIELD_DEFAULT_VALUE_ON_FOCUS)
  })
})

describe('hasFieldFocus', () => {
  it('should return true', () => {
    mocked(getFieldState).mockReturnValueOnce({ ...FIELD_STATE_DEFAULT, [FIELD_KEY_FOCUS]: true })
    expect(hasFieldFocus('spaceName', 'nameField')).toBe(true)
  })
  it('should return false', () => {
    mocked(getFieldState).mockReturnValueOnce({ ...FIELD_STATE_DEFAULT, [FIELD_KEY_FOCUS]: false })
    expect(hasFieldFocus('spaceName', 'nameField')).toBe(false)
  })
  it('should return false when missing', () => {
    mocked(getFieldState).mockReturnValueOnce(FIELD_STATE_DEFAULT)
    expect(hasFieldFocus('spaceName', 'nameField')).toBe(false)
  })
})

describe('isFieldDirty', () => {
  it('should return true', () => {
    mocked(getFieldState).mockReturnValueOnce({ ...FIELD_STATE_DEFAULT, [FIELD_KEY_DIRTY]: true })
    expect(isFieldDirty('spaceName', 'nameField')).toBe(true)
  })
  it('should return false', () => {
    mocked(getFieldState).mockReturnValueOnce({ ...FIELD_STATE_DEFAULT, [FIELD_KEY_DIRTY]: false })
    expect(isFieldDirty('spaceName', 'nameField')).toBe(false)
  })
  it('should return false when missing', () => {
    mocked(getFieldState).mockReturnValueOnce(FIELD_STATE_DEFAULT)
    expect(isFieldDirty('spaceName', 'nameField')).toBe(false)
  })
})

describe('isFieldTouched', () => {
  it('should return true', () => {
    mocked(getFieldState).mockReturnValueOnce({ ...FIELD_STATE_DEFAULT, [FIELD_KEY_TOUCHED]: true })
    expect(isFieldTouched('spaceName', 'nameField')).toBe(true)
  })
  it('should return false', () => {
    mocked(getFieldState).mockReturnValueOnce({ ...FIELD_STATE_DEFAULT, [FIELD_KEY_TOUCHED]: false })
    expect(isFieldTouched('spaceName', 'nameField')).toBe(false)
  })
  it('should return false when missing', () => {
    mocked(getFieldState).mockReturnValueOnce(FIELD_STATE_DEFAULT)
    expect(isFieldTouched('spaceName', 'nameField')).toBe(false)
  })
})

describe('isFieldValid', () => {
  it('should return true', () => {
    mocked(getFieldState).mockReturnValueOnce({ ...FIELD_STATE_DEFAULT, [FIELD_KEY_VALID]: true })
    expect(isFieldValid('spaceName', 'nameField')).toBe(true)
  })
  it('should return false', () => {
    mocked(getFieldState).mockReturnValueOnce({ ...FIELD_STATE_DEFAULT, [FIELD_KEY_VALID]: false })
    expect(isFieldValid('spaceName', 'nameField')).toBe(false)
  })
  it('should return the default value', () => {
    mocked(getFieldState).mockReturnValueOnce(FIELD_STATE_DEFAULT)
    expect(isFieldValid('spaceName', 'nameField')).toBe(FIELD_DEFAULT_VALID)
  })
})
