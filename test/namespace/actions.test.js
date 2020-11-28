import {
  FIELD_DEFAULT_DEFAULT_VALUE,
  FIELD_DEFAULT_DEFAULT_VALUE_ERROR,
  FIELD_DEFAULT_DIRTY,
  FIELD_DEFAULT_ERROR,
  FIELD_DEFAULT_FOCUS,
  FIELD_DEFAULT_TOUCHED,
  FIELD_DEFAULT_VALID,
  FIELD_DEFAULT_VALUE,
  FIELD_DEFAULT_VALUE_ON_FOCUS,
  FIELD_KEY_DEFAULT_VALUE,
  FIELD_KEY_DEFAULT_VALUE_ERROR,
  FIELD_KEY_DIRTY,
  FIELD_KEY_ERROR,
  FIELD_KEY_FOCUS,
  FIELD_KEY_TOUCHED,
  FIELD_KEY_VALID,
  FIELD_KEY_VALUE,
  FIELD_KEY_VALUE_ON_FOCUS,
  clearNamespace,
  getFieldState,
  removeField,
  resetNamespace,
  updateFieldStateWithCallback,
} from '../../src'

// reset modules to be sure that we have a clean state for every test
beforeEach(() => {
  removeField('spaceName', 'nameField')
})

describe('clearNamespace', () => {
  beforeEach(() => {
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_DIRTY]: true,
      [FIELD_KEY_ERROR]: true,
      [FIELD_KEY_FOCUS]: true,
      [FIELD_KEY_TOUCHED]: true,
      [FIELD_KEY_VALID]: false,
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALUE_ON_FOCUS]: 'barfoo',
      [FIELD_KEY_DEFAULT_VALUE]: undefined,
      [FIELD_KEY_DEFAULT_VALUE_ERROR]: undefined,
    }))
  })

  it('should clear a field without default value', () => {
    clearNamespace('spaceName', 'nameField')
    expect(getFieldState('spaceName', 'nameField')).toStrictEqual({
      [FIELD_KEY_DIRTY]: FIELD_DEFAULT_DIRTY,
      [FIELD_KEY_ERROR]: FIELD_DEFAULT_ERROR,
      [FIELD_KEY_FOCUS]: FIELD_DEFAULT_FOCUS,
      [FIELD_KEY_TOUCHED]: FIELD_DEFAULT_TOUCHED,
      [FIELD_KEY_VALID]: FIELD_DEFAULT_VALID,
      [FIELD_KEY_VALUE]: FIELD_DEFAULT_VALUE,
      [FIELD_KEY_VALUE_ON_FOCUS]: FIELD_DEFAULT_VALUE_ON_FOCUS,
      [FIELD_KEY_DEFAULT_VALUE]: FIELD_DEFAULT_DEFAULT_VALUE,
      [FIELD_KEY_DEFAULT_VALUE_ERROR]: FIELD_DEFAULT_DEFAULT_VALUE_ERROR,
    })
  })

  it('should clear a field with default value and no error', () => {
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_DEFAULT_VALUE]: 'foobar',
      [FIELD_KEY_DEFAULT_VALUE_ERROR]: false,
    }))

    clearNamespace('spaceName', 'nameField')
    expect(getFieldState('spaceName', 'nameField')).toStrictEqual({
      [FIELD_KEY_DIRTY]: FIELD_DEFAULT_DIRTY,
      [FIELD_KEY_ERROR]: FIELD_DEFAULT_ERROR,
      [FIELD_KEY_FOCUS]: FIELD_DEFAULT_FOCUS,
      [FIELD_KEY_TOUCHED]: FIELD_DEFAULT_TOUCHED,
      [FIELD_KEY_VALID]: FIELD_DEFAULT_VALID,
      [FIELD_KEY_VALUE]: FIELD_DEFAULT_VALUE,
      [FIELD_KEY_VALUE_ON_FOCUS]: FIELD_DEFAULT_VALUE_ON_FOCUS,
      [FIELD_KEY_DEFAULT_VALUE]: FIELD_DEFAULT_DEFAULT_VALUE,
      [FIELD_KEY_DEFAULT_VALUE_ERROR]: FIELD_DEFAULT_DEFAULT_VALUE_ERROR,
    })
  })

  it('should clear a field with default value and error', () => {
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_DEFAULT_VALUE]: 'foobar',
      [FIELD_KEY_DEFAULT_VALUE_ERROR]: 'error-string',
    }))

    clearNamespace('spaceName', 'nameField')
    expect(getFieldState('spaceName', 'nameField')).toStrictEqual({
      [FIELD_KEY_DIRTY]: FIELD_DEFAULT_DIRTY,
      [FIELD_KEY_ERROR]: FIELD_DEFAULT_ERROR,
      [FIELD_KEY_FOCUS]: FIELD_DEFAULT_FOCUS,
      [FIELD_KEY_TOUCHED]: FIELD_DEFAULT_TOUCHED,
      [FIELD_KEY_VALID]: FIELD_DEFAULT_VALID,
      [FIELD_KEY_VALUE]: FIELD_DEFAULT_VALUE,
      [FIELD_KEY_VALUE_ON_FOCUS]: FIELD_DEFAULT_VALUE_ON_FOCUS,
      [FIELD_KEY_DEFAULT_VALUE]: FIELD_DEFAULT_DEFAULT_VALUE,
      [FIELD_KEY_DEFAULT_VALUE_ERROR]: FIELD_DEFAULT_DEFAULT_VALUE_ERROR,
    })
  })
})

describe('resetNamespace', () => {
  beforeEach(() => {
    updateFieldStateWithCallback('spaceName1', 'nameField1', () => ({
      [FIELD_KEY_DIRTY]: true,
      [FIELD_KEY_ERROR]: true,
      [FIELD_KEY_FOCUS]: true,
      [FIELD_KEY_TOUCHED]: true,
      [FIELD_KEY_VALID]: false,
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALUE_ON_FOCUS]: 'barfoo',
      [FIELD_KEY_DEFAULT_VALUE]: undefined,
      [FIELD_KEY_DEFAULT_VALUE_ERROR]: undefined,
    }))
    updateFieldStateWithCallback('spaceName1', 'nameField2', () => ({
      [FIELD_KEY_DIRTY]: true,
      [FIELD_KEY_ERROR]: true,
      [FIELD_KEY_FOCUS]: true,
      [FIELD_KEY_TOUCHED]: true,
      [FIELD_KEY_VALID]: false,
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALUE_ON_FOCUS]: 'barfoo',
      [FIELD_KEY_DEFAULT_VALUE]: undefined,
      [FIELD_KEY_DEFAULT_VALUE_ERROR]: undefined,
    }))
    updateFieldStateWithCallback('spaceName2', 'nameField3', () => ({
      [FIELD_KEY_DIRTY]: true,
      [FIELD_KEY_ERROR]: true,
      [FIELD_KEY_FOCUS]: true,
      [FIELD_KEY_TOUCHED]: true,
      [FIELD_KEY_VALID]: false,
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALUE_ON_FOCUS]: 'barfoo',
      [FIELD_KEY_DEFAULT_VALUE]: undefined,
      [FIELD_KEY_DEFAULT_VALUE_ERROR]: undefined,
    }))
  })

  it('should reset a field without default value', () => {
    resetNamespace('spaceName1')
    expect(getFieldState('spaceName1', 'nameField1')).toStrictEqual({
      [FIELD_KEY_DIRTY]: FIELD_DEFAULT_DIRTY,
      [FIELD_KEY_ERROR]: FIELD_DEFAULT_ERROR,
      [FIELD_KEY_FOCUS]: FIELD_DEFAULT_FOCUS,
      [FIELD_KEY_TOUCHED]: FIELD_DEFAULT_TOUCHED,
      [FIELD_KEY_VALID]: FIELD_DEFAULT_VALID,
      [FIELD_KEY_VALUE]: FIELD_DEFAULT_VALUE,
      [FIELD_KEY_VALUE_ON_FOCUS]: FIELD_DEFAULT_VALUE_ON_FOCUS,
      [FIELD_KEY_DEFAULT_VALUE]: FIELD_DEFAULT_DEFAULT_VALUE,
      [FIELD_KEY_DEFAULT_VALUE_ERROR]: FIELD_DEFAULT_DEFAULT_VALUE_ERROR,
    })
    expect(getFieldState('spaceName1', 'nameField2')).toStrictEqual({
      [FIELD_KEY_DIRTY]: FIELD_DEFAULT_DIRTY,
      [FIELD_KEY_ERROR]: FIELD_DEFAULT_ERROR,
      [FIELD_KEY_FOCUS]: FIELD_DEFAULT_FOCUS,
      [FIELD_KEY_TOUCHED]: FIELD_DEFAULT_TOUCHED,
      [FIELD_KEY_VALID]: FIELD_DEFAULT_VALID,
      [FIELD_KEY_VALUE]: FIELD_DEFAULT_VALUE,
      [FIELD_KEY_VALUE_ON_FOCUS]: FIELD_DEFAULT_VALUE_ON_FOCUS,
      [FIELD_KEY_DEFAULT_VALUE]: FIELD_DEFAULT_DEFAULT_VALUE,
      [FIELD_KEY_DEFAULT_VALUE_ERROR]: FIELD_DEFAULT_DEFAULT_VALUE_ERROR,
    })
    expect(getFieldState('spaceName2', 'nameField3')).toStrictEqual({
      [FIELD_KEY_DIRTY]: true,
      [FIELD_KEY_ERROR]: true,
      [FIELD_KEY_FOCUS]: true,
      [FIELD_KEY_TOUCHED]: true,
      [FIELD_KEY_VALID]: false,
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALUE_ON_FOCUS]: 'barfoo',
      [FIELD_KEY_DEFAULT_VALUE]: undefined,
      [FIELD_KEY_DEFAULT_VALUE_ERROR]: undefined,
    })
  })

  it('should reset a field with default value and no error', () => {
    updateFieldStateWithCallback('spaceName1', 'nameField2', () => ({
      [FIELD_KEY_DEFAULT_VALUE]: 'foobar',
      [FIELD_KEY_DEFAULT_VALUE_ERROR]: false,
    }))

    resetNamespace('spaceName1')
    expect(getFieldState('spaceName1', 'nameField1')).toStrictEqual({
      [FIELD_KEY_DIRTY]: FIELD_DEFAULT_DIRTY,
      [FIELD_KEY_ERROR]: FIELD_DEFAULT_ERROR,
      [FIELD_KEY_FOCUS]: FIELD_DEFAULT_FOCUS,
      [FIELD_KEY_TOUCHED]: FIELD_DEFAULT_TOUCHED,
      [FIELD_KEY_VALID]: FIELD_DEFAULT_VALID,
      [FIELD_KEY_VALUE]: FIELD_DEFAULT_VALUE,
      [FIELD_KEY_VALUE_ON_FOCUS]: FIELD_DEFAULT_VALUE_ON_FOCUS,
      [FIELD_KEY_DEFAULT_VALUE]: FIELD_DEFAULT_DEFAULT_VALUE,
      [FIELD_KEY_DEFAULT_VALUE_ERROR]: FIELD_DEFAULT_DEFAULT_VALUE_ERROR,
    })
    expect(getFieldState('spaceName1', 'nameField2')).toStrictEqual({
      [FIELD_KEY_DIRTY]: FIELD_DEFAULT_DIRTY,
      [FIELD_KEY_ERROR]: FIELD_DEFAULT_ERROR,
      [FIELD_KEY_FOCUS]: FIELD_DEFAULT_FOCUS,
      [FIELD_KEY_TOUCHED]: FIELD_DEFAULT_TOUCHED,
      [FIELD_KEY_VALID]: FIELD_DEFAULT_VALID,
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALUE_ON_FOCUS]: FIELD_DEFAULT_VALUE_ON_FOCUS,
      [FIELD_KEY_DEFAULT_VALUE]: FIELD_DEFAULT_DEFAULT_VALUE,
      [FIELD_KEY_DEFAULT_VALUE_ERROR]: FIELD_DEFAULT_DEFAULT_VALUE_ERROR,
    })
    expect(getFieldState('spaceName2', 'nameField3')).toStrictEqual({
      [FIELD_KEY_DIRTY]: true,
      [FIELD_KEY_ERROR]: true,
      [FIELD_KEY_FOCUS]: true,
      [FIELD_KEY_TOUCHED]: true,
      [FIELD_KEY_VALID]: false,
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALUE_ON_FOCUS]: 'barfoo',
      [FIELD_KEY_DEFAULT_VALUE]: undefined,
      [FIELD_KEY_DEFAULT_VALUE_ERROR]: undefined,
    })
  })

  it('should reset a field with default value and error', () => {
    updateFieldStateWithCallback('spaceName1', 'nameField2', () => ({
      [FIELD_KEY_DEFAULT_VALUE]: 'foobar',
      [FIELD_KEY_DEFAULT_VALUE_ERROR]: 'error-string',
    }))

    resetNamespace('spaceName1')
    expect(getFieldState('spaceName1', 'nameField1')).toStrictEqual({
      [FIELD_KEY_DIRTY]: FIELD_DEFAULT_DIRTY,
      [FIELD_KEY_ERROR]: FIELD_DEFAULT_ERROR,
      [FIELD_KEY_FOCUS]: FIELD_DEFAULT_FOCUS,
      [FIELD_KEY_TOUCHED]: FIELD_DEFAULT_TOUCHED,
      [FIELD_KEY_VALID]: FIELD_DEFAULT_VALID,
      [FIELD_KEY_VALUE]: FIELD_DEFAULT_VALUE,
      [FIELD_KEY_VALUE_ON_FOCUS]: FIELD_DEFAULT_VALUE_ON_FOCUS,
      [FIELD_KEY_DEFAULT_VALUE]: FIELD_DEFAULT_DEFAULT_VALUE,
      [FIELD_KEY_DEFAULT_VALUE_ERROR]: FIELD_DEFAULT_DEFAULT_VALUE_ERROR,
    })
    expect(getFieldState('spaceName1', 'nameField2')).toStrictEqual({
      [FIELD_KEY_DIRTY]: FIELD_DEFAULT_DIRTY,
      [FIELD_KEY_ERROR]: 'error-string',
      [FIELD_KEY_FOCUS]: FIELD_DEFAULT_FOCUS,
      [FIELD_KEY_TOUCHED]: FIELD_DEFAULT_TOUCHED,
      [FIELD_KEY_VALID]: false,
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALUE_ON_FOCUS]: FIELD_DEFAULT_VALUE_ON_FOCUS,
      [FIELD_KEY_DEFAULT_VALUE]: FIELD_DEFAULT_DEFAULT_VALUE,
      [FIELD_KEY_DEFAULT_VALUE_ERROR]: FIELD_DEFAULT_DEFAULT_VALUE_ERROR,
    })
    expect(getFieldState('spaceName2', 'nameField3')).toStrictEqual({
      [FIELD_KEY_DIRTY]: true,
      [FIELD_KEY_ERROR]: true,
      [FIELD_KEY_FOCUS]: true,
      [FIELD_KEY_TOUCHED]: true,
      [FIELD_KEY_VALID]: false,
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALUE_ON_FOCUS]: 'barfoo',
      [FIELD_KEY_DEFAULT_VALUE]: undefined,
      [FIELD_KEY_DEFAULT_VALUE_ERROR]: undefined,
    })
  })
})
