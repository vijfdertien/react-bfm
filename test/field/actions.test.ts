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
  getFieldState,
  updateFieldStateWithCallback,
  FIELD_KEY_INITIAL_VALUE,
  FIELD_KEY_INITIAL_VALUE_ERROR,
  resetField,
  removeField,
  FIELD_DEFAULT_DEFAULT_VALUE,
  FIELD_DEFAULT_DEFAULT_VALUE_ERROR,
  clearField,
} from '../../src'
import { initFieldState } from '../../src/state'

// reset modules to be sure that we have a clean state for every test
beforeEach(() => {
  removeField('spaceName', 'nameField')
})

describe('clearField', () => {
  beforeEach(() => {
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_DIRTY]: true,
      [FIELD_KEY_ERROR]: true,
      [FIELD_KEY_FOCUS]: true,
      [FIELD_KEY_TOUCHED]: true,
      [FIELD_KEY_VALID]: false,
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALUE_ON_FOCUS]: 'barfoo',
      [FIELD_KEY_INITIAL_VALUE]: undefined,
      [FIELD_KEY_INITIAL_VALUE_ERROR]: undefined,
    }))
  })

  it('should clear a field without default value', () => {
    initFieldState('spaceName', 'nameField', '', null)
    clearField('spaceName', 'nameField')
    expect(getFieldState('spaceName', 'nameField')).toStrictEqual({
      [FIELD_KEY_DIRTY]: FIELD_DEFAULT_DIRTY,
      [FIELD_KEY_ERROR]: FIELD_DEFAULT_ERROR,
      [FIELD_KEY_FOCUS]: FIELD_DEFAULT_FOCUS,
      [FIELD_KEY_TOUCHED]: FIELD_DEFAULT_TOUCHED,
      [FIELD_KEY_VALID]: FIELD_DEFAULT_VALID,
      [FIELD_KEY_VALUE]: FIELD_DEFAULT_VALUE,
      [FIELD_KEY_VALUE_ON_FOCUS]: FIELD_DEFAULT_VALUE_ON_FOCUS,
      [FIELD_KEY_INITIAL_VALUE]: FIELD_DEFAULT_DEFAULT_VALUE,
      [FIELD_KEY_INITIAL_VALUE_ERROR]: FIELD_DEFAULT_DEFAULT_VALUE_ERROR,
    })
  })

  it('should clear a field with default value and no error', () => {
    initFieldState('spaceName', 'nameField', '', null)
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_INITIAL_VALUE]: 'foobar',
      [FIELD_KEY_INITIAL_VALUE_ERROR]: false,
    }))

    clearField('spaceName', 'nameField')
    expect(getFieldState('spaceName', 'nameField')).toStrictEqual({
      [FIELD_KEY_DIRTY]: FIELD_DEFAULT_DIRTY,
      [FIELD_KEY_ERROR]: FIELD_DEFAULT_ERROR,
      [FIELD_KEY_FOCUS]: FIELD_DEFAULT_FOCUS,
      [FIELD_KEY_TOUCHED]: FIELD_DEFAULT_TOUCHED,
      [FIELD_KEY_VALID]: FIELD_DEFAULT_VALID,
      [FIELD_KEY_VALUE]: FIELD_DEFAULT_VALUE,
      [FIELD_KEY_VALUE_ON_FOCUS]: FIELD_DEFAULT_VALUE_ON_FOCUS,
      [FIELD_KEY_INITIAL_VALUE]: FIELD_DEFAULT_DEFAULT_VALUE,
      [FIELD_KEY_INITIAL_VALUE_ERROR]: FIELD_DEFAULT_DEFAULT_VALUE_ERROR,
    })
  })

  it('should clear a field with default value and error', () => {
    initFieldState('spaceName', 'nameField', '', null)
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_INITIAL_VALUE]: 'foobar',
      [FIELD_KEY_INITIAL_VALUE_ERROR]: 'error-string',
    }))

    clearField('spaceName', 'nameField')
    expect(getFieldState('spaceName', 'nameField')).toStrictEqual({
      [FIELD_KEY_DIRTY]: FIELD_DEFAULT_DIRTY,
      [FIELD_KEY_ERROR]: FIELD_DEFAULT_ERROR,
      [FIELD_KEY_FOCUS]: FIELD_DEFAULT_FOCUS,
      [FIELD_KEY_TOUCHED]: FIELD_DEFAULT_TOUCHED,
      [FIELD_KEY_VALID]: FIELD_DEFAULT_VALID,
      [FIELD_KEY_VALUE]: FIELD_DEFAULT_VALUE,
      [FIELD_KEY_VALUE_ON_FOCUS]: FIELD_DEFAULT_VALUE_ON_FOCUS,
      [FIELD_KEY_INITIAL_VALUE]: FIELD_DEFAULT_DEFAULT_VALUE,
      [FIELD_KEY_INITIAL_VALUE_ERROR]: FIELD_DEFAULT_DEFAULT_VALUE_ERROR,
    })
  })
})

describe('resetField', () => {
  beforeEach(() => {
    initFieldState('spaceName', 'nameField', '', null)
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_DIRTY]: true,
      [FIELD_KEY_ERROR]: true,
      [FIELD_KEY_FOCUS]: true,
      [FIELD_KEY_TOUCHED]: true,
      [FIELD_KEY_VALID]: false,
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALUE_ON_FOCUS]: 'barfoo',
      [FIELD_KEY_INITIAL_VALUE]: undefined,
      [FIELD_KEY_INITIAL_VALUE_ERROR]: undefined,
    }))
  })

  it('should reset a field without default value', () => {
    resetField('spaceName', 'nameField')
    expect(getFieldState('spaceName', 'nameField')).toStrictEqual({
      [FIELD_KEY_DIRTY]: FIELD_DEFAULT_DIRTY,
      [FIELD_KEY_ERROR]: FIELD_DEFAULT_ERROR,
      [FIELD_KEY_FOCUS]: FIELD_DEFAULT_FOCUS,
      [FIELD_KEY_TOUCHED]: FIELD_DEFAULT_TOUCHED,
      [FIELD_KEY_VALID]: FIELD_DEFAULT_VALID,
      [FIELD_KEY_VALUE]: FIELD_DEFAULT_VALUE,
      [FIELD_KEY_VALUE_ON_FOCUS]: FIELD_DEFAULT_VALUE_ON_FOCUS,
      [FIELD_KEY_INITIAL_VALUE]: FIELD_DEFAULT_DEFAULT_VALUE,
      [FIELD_KEY_INITIAL_VALUE_ERROR]: FIELD_DEFAULT_DEFAULT_VALUE_ERROR,
    })
  })

  it('should reset a field with default value and no error', () => {
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_INITIAL_VALUE]: 'foobar',
      [FIELD_KEY_INITIAL_VALUE_ERROR]: false,
    }))

    resetField('spaceName', 'nameField')
    expect(getFieldState('spaceName', 'nameField')).toStrictEqual({
      [FIELD_KEY_DIRTY]: FIELD_DEFAULT_DIRTY,
      [FIELD_KEY_ERROR]: FIELD_DEFAULT_ERROR,
      [FIELD_KEY_FOCUS]: FIELD_DEFAULT_FOCUS,
      [FIELD_KEY_TOUCHED]: FIELD_DEFAULT_TOUCHED,
      [FIELD_KEY_VALID]: FIELD_DEFAULT_VALID,
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALUE_ON_FOCUS]: FIELD_DEFAULT_VALUE_ON_FOCUS,
      [FIELD_KEY_INITIAL_VALUE]: FIELD_DEFAULT_DEFAULT_VALUE,
      [FIELD_KEY_INITIAL_VALUE_ERROR]: FIELD_DEFAULT_DEFAULT_VALUE_ERROR,
    })
  })

  it('should reset a field with default value and error', () => {
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_INITIAL_VALUE]: 'foobar',
      [FIELD_KEY_INITIAL_VALUE_ERROR]: 'error-string',
    }))

    resetField('spaceName', 'nameField')
    expect(getFieldState('spaceName', 'nameField')).toStrictEqual({
      [FIELD_KEY_DIRTY]: FIELD_DEFAULT_DIRTY,
      [FIELD_KEY_ERROR]: 'error-string',
      [FIELD_KEY_FOCUS]: FIELD_DEFAULT_FOCUS,
      [FIELD_KEY_TOUCHED]: FIELD_DEFAULT_TOUCHED,
      [FIELD_KEY_VALID]: false,
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALUE_ON_FOCUS]: FIELD_DEFAULT_VALUE_ON_FOCUS,
      [FIELD_KEY_INITIAL_VALUE]: FIELD_DEFAULT_DEFAULT_VALUE,
      [FIELD_KEY_INITIAL_VALUE_ERROR]: FIELD_DEFAULT_DEFAULT_VALUE_ERROR,
    })
  })
})
