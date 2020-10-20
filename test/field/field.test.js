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
  creatorGetField,
  getFieldError,
  getFieldState,
  getFieldValue,
  getFieldValueOnFocus,
  hasFieldFocus,
  isFieldDirty,
  isFieldTouched,
  isFieldValid,
} from '../../src'
import { SUPPORTED_VALUES } from '../constants'

jest.mock('../../src/state')

describe('creatorGetField', () => {
  it('should always return the value of the key', () => {
    SUPPORTED_VALUES.forEach((value) => {
      getFieldState.mockReturnValueOnce({ foobar: value })
      const getField = creatorGetField('foobar', 'defaultValue')
      expect(getField('spaceName', 'nameField')).toBe(value)
    })
  })

  it('should always return the default value of the key, when not set', () => {
    SUPPORTED_VALUES.forEach((value) => {
      getFieldState.mockReturnValueOnce({ barfoo: value })
      const getField = creatorGetField('foobar', 'defaultValue')
      expect(getField('spaceName', 'nameField')).toBe('defaultValue')
    })
  })
})

describe('getFieldError', () => {
  it('should return the value', () => {
    getFieldState.mockReturnValueOnce({ [FIELD_KEY_ERROR]: 'foobar' })
    expect(getFieldError('spaceName', 'nameField')).toBe('foobar')
  })
  it('should return the default value', () => {
    getFieldState.mockReturnValue({})
    expect(getFieldError('spaceName', 'nameField')).toBe(FIELD_DEFAULT_ERROR)
  })
})

describe('getFieldValue', () => {
  it('should return the value', () => {
    getFieldState.mockReturnValueOnce({ [FIELD_KEY_VALUE]: 'foobar' })
    expect(getFieldValue('spaceName', 'nameField')).toBe('foobar')
  })
  it('should return the default value', () => {
    getFieldState.mockReturnValue({})
    expect(getFieldValue('spaceName', 'nameField')).toBe(FIELD_DEFAULT_VALUE)
  })
})

describe('getFieldValueOnFocus', () => {
  it('should return the value', () => {
    getFieldState.mockReturnValueOnce({ [FIELD_KEY_VALUE_ON_FOCUS]: 'foobar' })
    expect(getFieldValueOnFocus('spaceName', 'nameField')).toBe('foobar')
  })
  it('should return the default value', () => {
    getFieldState.mockReturnValue({})
    expect(getFieldValueOnFocus('spaceName', 'nameField')).toBe(FIELD_DEFAULT_VALUE_ON_FOCUS)
  })
})

describe('hasFieldFocus', () => {
  it('should return true', () => {
    getFieldState.mockReturnValueOnce({ [FIELD_KEY_FOCUS]: true })
    expect(hasFieldFocus('spaceName', 'nameField')).toBe(true)
  })
  it('should return false', () => {
    getFieldState.mockReturnValueOnce({ [FIELD_KEY_FOCUS]: false })
    expect(hasFieldFocus('spaceName', 'nameField')).toBe(false)
  })
  it('should return the default value', () => {
    getFieldState.mockReturnValue({})
    expect(hasFieldFocus('spaceName', 'nameField')).toBe(FIELD_DEFAULT_FOCUS)
  })
})

describe('isFieldDirty', () => {
  it('should return true', () => {
    getFieldState.mockReturnValueOnce({ [FIELD_KEY_DIRTY]: true })
    expect(isFieldDirty('spaceName', 'nameField')).toBe(true)
  })
  it('should return false', () => {
    getFieldState.mockReturnValueOnce({ [FIELD_KEY_DIRTY]: false })
    expect(isFieldDirty('spaceName', 'nameField')).toBe(false)
  })
  it('should return the default value', () => {
    getFieldState.mockReturnValue({})
    expect(isFieldDirty('spaceName', 'nameField')).toBe(FIELD_DEFAULT_DIRTY)
  })
})

describe('isFieldTouched', () => {
  it('should return true', () => {
    getFieldState.mockReturnValueOnce({ [FIELD_KEY_TOUCHED]: true })
    expect(isFieldTouched('spaceName', 'nameField')).toBe(true)
  })
  it('should return false', () => {
    getFieldState.mockReturnValueOnce({ [FIELD_KEY_TOUCHED]: false })
    expect(isFieldTouched('spaceName', 'nameField')).toBe(false)
  })
  it('should return the default value', () => {
    getFieldState.mockReturnValue({})
    expect(isFieldTouched('spaceName', 'nameField')).toBe(FIELD_DEFAULT_TOUCHED)
  })
})

describe('isFieldValid', () => {
  it('should return true', () => {
    getFieldState.mockReturnValueOnce({ [FIELD_KEY_VALID]: true })
    expect(isFieldValid('spaceName', 'nameField')).toBe(true)
  })
  it('should return false', () => {
    getFieldState.mockReturnValueOnce({ [FIELD_KEY_VALID]: false })
    expect(isFieldValid('spaceName', 'nameField')).toBe(false)
  })
  it('should return the default value', () => {
    getFieldState.mockReturnValue({})
    expect(isFieldValid('spaceName', 'nameField')).toBe(FIELD_DEFAULT_VALID)
  })
})
