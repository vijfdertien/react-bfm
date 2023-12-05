/* eslint-disable @typescript-eslint/no-var-requires */
import { FIELD_KEY_ERROR, FIELD_KEY_FOCUS, FIELD_KEY_VALID, FIELD_KEY_VALUE, FIELD_STATE_DEFAULT } from '../src'

// reset modules to be sure that we have a clean state for every test
beforeEach(() => {
  jest.resetModules()
})

describe('getFieldState', () => {
  it('should return the field state, or an empty state', () => {
    // instead of a global import we use require to have a clean state for every test
    const { getFieldState, updateFieldStateWithCallback, initFieldState } = require('../src/state')

    initFieldState('namespace1', 'foobar', '', null)
    initFieldState('namespace1', 'barfoo', '', null)
    initFieldState('namespace2', 'bfaoro', '', null)

    updateFieldStateWithCallback('namespace1', 'foobar', () => ({
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALID]: true,
    }))
    updateFieldStateWithCallback('namespace1', 'barfoo', () => ({
      [FIELD_KEY_VALUE]: 'barfoo',
      [FIELD_KEY_VALID]: true,
    }))
    updateFieldStateWithCallback('namespace2', 'bfaoro', () => ({
      [FIELD_KEY_VALUE]: 'bfaoro',
      [FIELD_KEY_VALID]: false,
    }))

    expect(getFieldState('namespace1', 'foobar')).toEqual({
      ...FIELD_STATE_DEFAULT,
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALID]: true,
    })

    expect(getFieldState('namespace1', 'barfoo')).toEqual({
      ...FIELD_STATE_DEFAULT,
      [FIELD_KEY_VALUE]: 'barfoo',
      [FIELD_KEY_VALID]: true,
    })

    expect(getFieldState('namespace1', 'bfaoro')).not.toBeDefined()

    expect(getFieldState('namespace2', 'foobar')).not.toBeDefined()

    expect(getFieldState('namespace2', 'barfoo')).not.toBeDefined()

    expect(getFieldState('namespace2', 'bfaoro')).toEqual({
      ...FIELD_STATE_DEFAULT,
      [FIELD_KEY_VALUE]: 'bfaoro',
      [FIELD_KEY_VALID]: false,
    })
  })
})

describe('getNamespaceState', () => {
  it('should return the namespace state, or an empty state', () => {
    // instead of a global import we use require to have a clean state for every test
    const { getNamespaceState, updateFieldStateWithCallback, initFieldState } = require('../src/state')

    initFieldState('namespace1', 'foobar', '', null)
    initFieldState('namespace1', 'barfoo', '', null)
    initFieldState('namespace3', 'bfaoro', '', null)

    updateFieldStateWithCallback('namespace1', 'foobar', () => ({
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALID]: true,
    }))
    updateFieldStateWithCallback('namespace1', 'barfoo', () => ({
      [FIELD_KEY_VALUE]: 'barfoo',
      [FIELD_KEY_VALID]: true,
    }))
    updateFieldStateWithCallback('namespace3', 'bfaoro', () => ({
      [FIELD_KEY_VALUE]: 'bfaoro',
      [FIELD_KEY_VALID]: false,
    }))

    expect(getNamespaceState('namespace1')).toEqual({
      foobar: {
        ...FIELD_STATE_DEFAULT,
        [FIELD_KEY_VALUE]: 'foobar',
        [FIELD_KEY_VALID]: true,
      },
      barfoo: {
        ...FIELD_STATE_DEFAULT,
        [FIELD_KEY_VALUE]: 'barfoo',
        [FIELD_KEY_VALID]: true,
      },
    })
    expect(getNamespaceState('namespace2')).not.toBeDefined()
    expect(getNamespaceState('namespace3')).toEqual({
      bfaoro: {
        ...FIELD_STATE_DEFAULT,
        [FIELD_KEY_VALUE]: 'bfaoro',
        [FIELD_KEY_VALID]: false,
      },
    })
  })
})

describe('removeField', () => {
  it('should be possible to remove the field state', () => {
    // instead of a global import we use require to have a clean state for every test
    const {
      getFieldState,
      getNamespaceState,
      removeField,
      updateFieldStateWithCallback,
      initFieldState,
    } = require('../src/state')

    initFieldState('namespace1', 'foobar', '', null)
    initFieldState('namespace2', 'foobar', '', null)

    updateFieldStateWithCallback('namespace1', 'foobar', () => ({
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALID]: false,
    }))
    updateFieldStateWithCallback('namespace2', 'foobar', () => ({
      [FIELD_KEY_VALUE]: 'barfoo',
      [FIELD_KEY_VALID]: true,
    }))

    expect(getFieldState('namespace1', 'foobar')).toEqual({
      ...FIELD_STATE_DEFAULT,
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALID]: false,
    })

    expect(getFieldState('namespace2', 'foobar')).toEqual({
      ...FIELD_STATE_DEFAULT,
      [FIELD_KEY_VALUE]: 'barfoo',
      [FIELD_KEY_VALID]: true,
    })

    removeField('namespace1', 'foobar')

    expect(getFieldState('namespace1', 'foobar')).not.toBeDefined()

    expect(getFieldState('namespace2', 'foobar')).toEqual({
      ...FIELD_STATE_DEFAULT,
      [FIELD_KEY_VALUE]: 'barfoo',
      [FIELD_KEY_VALID]: true,
    })

    expect(getNamespaceState('namespace1')).not.toBeDefined()

    expect(getNamespaceState('namespace2')).toEqual({
      foobar: {
        ...FIELD_STATE_DEFAULT,
        [FIELD_KEY_VALUE]: 'barfoo',
        [FIELD_KEY_VALID]: true,
      },
    })
  })
})

describe('subscribeToField', () => {
  it('should be possible to subscribe to a field state change', () => {
    // instead of a global import we use require to have a clean state for every test
    const { createSubscribeToField, updateFieldStateWithCallback, initFieldState } = require('../src/state')

    const subscribeToField = createSubscribeToField('namespace1', 'foobar')

    const mockCallback1 = jest.fn()
    const mockCallback2 = jest.fn()

    const unsubscribe1 = subscribeToField(mockCallback1)

    initFieldState('namespace1', 'foobar', 'foobar', 'field-is-not-valid')

    const unsubscribe2 = subscribeToField(mockCallback2)

    updateFieldStateWithCallback('namespace1', 'foobar', () => ({
      [FIELD_KEY_ERROR]: 'barfoo',
      [FIELD_KEY_FOCUS]: true,
    }))

    unsubscribe1()

    updateFieldStateWithCallback('namespace1', 'foobar', () => ({
      [FIELD_KEY_ERROR]: null,
      [FIELD_KEY_VALID]: true,
      [FIELD_KEY_FOCUS]: true,
    }))

    unsubscribe2()

    updateFieldStateWithCallback('namespace1', 'foobar', () => ({
      [FIELD_KEY_FOCUS]: false,
    }))

    expect(mockCallback1).toHaveBeenCalledTimes(2)
    expect(mockCallback2).toHaveBeenCalledTimes(2)
  })
})

describe('subscribeToNamespace', () => {
  it('should be possible to subscribe to a namespace state change', () => {
    // instead of a global import we use require to have a clean state for every test
    const { createSubscribeToNamespace, updateFieldStateWithCallback, initFieldState } = require('../src/state')

    const subscribeToNamespace = createSubscribeToNamespace('namespace1')

    const mockCallback1 = jest.fn()
    const mockCallback2 = jest.fn()

    const unsubscribe1 = subscribeToNamespace(mockCallback1)

    initFieldState('namespace1', 'foobar1', 'foobar', 'field-is-not-valid')

    const unsubscribe2 = subscribeToNamespace(mockCallback2)

    initFieldState('namespace1', 'foobar2', '', null)
    updateFieldStateWithCallback('namespace1', 'foobar2', () => ({
      [FIELD_KEY_ERROR]: 'barfoo',
      [FIELD_KEY_FOCUS]: true,
    }))

    unsubscribe1()

    initFieldState('namespace1', 'foobar3', '', null)
    updateFieldStateWithCallback('namespace1', 'foobar3', () => ({
      [FIELD_KEY_ERROR]: null,
      [FIELD_KEY_VALID]: true,
      [FIELD_KEY_FOCUS]: true,
    }))

    unsubscribe2()

    initFieldState('namespace1', 'foobar4', '', null)
    updateFieldStateWithCallback('namespace1', 'foobar4', () => ({
      [FIELD_KEY_FOCUS]: false,
    }))

    expect(mockCallback1).toHaveBeenCalledTimes(3)
    expect(mockCallback2).toHaveBeenCalledTimes(4)
  })
})

describe('updateFieldStateWithCallback', () => {
  it('should be possible to update the field state with a callback', () => {
    // instead of a global import we use require to have a clean state for every test
    const { getFieldState, updateFieldStateWithCallback, initFieldState } = require('../src/state')

    expect(getFieldState('namespace1', 'foobar')).not.toBeDefined()

    initFieldState('namespace1', 'foobar', '', null)
    updateFieldStateWithCallback('namespace1', 'foobar', () => ({
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_ERROR]: 'error-text',
      [FIELD_KEY_VALID]: false,
    }))

    expect(getFieldState('namespace1', 'foobar')).toEqual({
      ...FIELD_STATE_DEFAULT,
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_ERROR]: 'error-text',
      [FIELD_KEY_VALID]: false,
    })

    updateFieldStateWithCallback('namespace1', 'foobar', () => ({
      [FIELD_KEY_VALUE]: 'barfoo',
      [FIELD_KEY_FOCUS]: true,
    }))

    expect(getFieldState('namespace1', 'foobar')).toEqual({
      ...FIELD_STATE_DEFAULT,
      [FIELD_KEY_VALUE]: 'barfoo',
      [FIELD_KEY_ERROR]: 'error-text',
      [FIELD_KEY_VALID]: false,
      [FIELD_KEY_FOCUS]: true,
    })
  })

  it('should only update the field state when the callback returns object', () => {
    // instead of a global import we use require to have a clean state for every test
    const {
      getFieldState,
      createSubscribeToField,
      updateFieldStateWithCallback,
      initFieldState,
    } = require('../src/state')

    const subscribeToField = createSubscribeToField('namespace1', 'foobar')

    const mockCallback = jest.fn()
    subscribeToField(mockCallback)

    initFieldState('namespace1', 'foobar', '', null)
    updateFieldStateWithCallback('namespace1', 'foobar', () => ({
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_ERROR]: 'error-text',
      [FIELD_KEY_VALID]: false,
    }))

    expect(getFieldState('namespace1', 'foobar')).toEqual({
      ...FIELD_STATE_DEFAULT,
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_ERROR]: 'error-text',
      [FIELD_KEY_VALID]: false,
    })

    updateFieldStateWithCallback('namespace1', 'foobar', () => false)
    updateFieldStateWithCallback('namespace1', 'foobar', () => '')
    updateFieldStateWithCallback('namespace1', 'foobar', () => null)

    expect(getFieldState('namespace1', 'foobar')).toEqual({
      ...FIELD_STATE_DEFAULT,
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_ERROR]: 'error-text',
      [FIELD_KEY_VALID]: false,
    })
    expect(mockCallback).toHaveBeenCalledTimes(2)
  })
})
