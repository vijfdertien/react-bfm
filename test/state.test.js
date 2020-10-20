import {
  FIELD_KEY_ERROR,
  FIELD_KEY_FOCUS,
  FIELD_KEY_VALID,
  FIELD_KEY_VALUE,
  FIELD_STATE_DEFAULT,
  NAMESPACE_STATE_DEFAULT,
} from '../src'

// reset modules to be sure that we have a clean state for every test
beforeEach(() => {
  jest.resetModules()
})

describe('getFieldState', () => {
  it('should return the field state, or an empty state', () => {
    // instead of a global import we use require to have a clean state for every test
    const { getFieldState, updateFieldStateWithCallback } = require('../src/state')

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
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALID]: true,
    })

    expect(getFieldState('namespace1', 'barfoo')).toEqual({
      [FIELD_KEY_VALUE]: 'barfoo',
      [FIELD_KEY_VALID]: true,
    })

    expect(getFieldState('namespace1', 'bfaoro')).toStrictEqual(FIELD_STATE_DEFAULT)

    expect(getFieldState('namespace2', 'foobar')).toStrictEqual(FIELD_STATE_DEFAULT)

    expect(getFieldState('namespace2', 'barfoo')).toStrictEqual(FIELD_STATE_DEFAULT)

    expect(getFieldState('namespace2', 'bfaoro')).toEqual({
      [FIELD_KEY_VALUE]: 'bfaoro',
      [FIELD_KEY_VALID]: false,
    })
  })
})

describe('getNamespaceState', () => {
  it('should return the namespace state, or an empty state', () => {
    // instead of a global import we use require to have a clean state for every test
    const { getNamespaceState, updateFieldStateWithCallback } = require('../src/state')

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
        [FIELD_KEY_VALUE]: 'foobar',
        [FIELD_KEY_VALID]: true,
      },
      barfoo: {
        [FIELD_KEY_VALUE]: 'barfoo',
        [FIELD_KEY_VALID]: true,
      },
    })
    expect(getNamespaceState('namespace2')).toStrictEqual(NAMESPACE_STATE_DEFAULT)
    expect(getNamespaceState('namespace3')).toEqual({
      bfaoro: {
        [FIELD_KEY_VALUE]: 'bfaoro',
        [FIELD_KEY_VALID]: false,
      },
    })
  })
})

describe('removeField', () => {
  it('should be possible to remove the field state', () => {
    // instead of a global import we use require to have a clean state for every test
    const { getFieldState, getNamespaceState, removeField, updateFieldStateWithCallback } = require('../src/state')

    updateFieldStateWithCallback('namespace1', 'foobar', () => ({
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALID]: false,
    }))
    updateFieldStateWithCallback('namespace2', 'foobar', () => ({
      [FIELD_KEY_VALUE]: 'barfoo',
      [FIELD_KEY_VALID]: true,
    }))

    expect(getFieldState('namespace1', 'foobar')).toEqual({
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALID]: false,
    })

    expect(getFieldState('namespace2', 'foobar')).toEqual({
      [FIELD_KEY_VALUE]: 'barfoo',
      [FIELD_KEY_VALID]: true,
    })

    removeField('namespace1', 'foobar')

    expect(getFieldState('namespace1', 'foobar')).toStrictEqual(FIELD_STATE_DEFAULT)

    expect(getFieldState('namespace2', 'foobar')).toEqual({
      [FIELD_KEY_VALUE]: 'barfoo',
      [FIELD_KEY_VALID]: true,
    })

    expect(getNamespaceState('namespace1')).toStrictEqual(NAMESPACE_STATE_DEFAULT)

    expect(getNamespaceState('namespace2')).toEqual({
      foobar: {
        [FIELD_KEY_VALUE]: 'barfoo',
        [FIELD_KEY_VALID]: true,
      },
    })
  })
})

describe('subscribeToField', () => {
  it('should be possible to subscribe to a field state change', () => {
    // instead of a global import we use require to have a clean state for every test
    const { getFieldState, subscribeToField, updateFieldStateWithCallback } = require('../src/state')

    const mockCallback1 = jest.fn()
    const mockCallback2 = jest.fn()

    const unsubscribe1 = subscribeToField('namespace1', 'foobar', mockCallback1)

    updateFieldStateWithCallback('namespace1', 'foobar', () => ({
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALID]: false,
    }))

    const unsubscribe2 = subscribeToField('namespace1', 'foobar', mockCallback2)

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

    expect(mockCallback1).toHaveBeenNthCalledWith(1, {
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALID]: false,
    })

    const afterSecondUpdate = {
      [FIELD_KEY_ERROR]: 'barfoo',
      [FIELD_KEY_FOCUS]: true,
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALID]: false,
    }
    expect(mockCallback1).toHaveBeenNthCalledWith(2, afterSecondUpdate)

    expect(mockCallback2).toHaveBeenNthCalledWith(2, {
      [FIELD_KEY_ERROR]: null,
      [FIELD_KEY_FOCUS]: true,
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALID]: true,
    })

    expect(getFieldState('namespace1', 'foobar')).toEqual({
      [FIELD_KEY_ERROR]: null,
      [FIELD_KEY_FOCUS]: false,
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALID]: true,
    })
  })
})

describe('subscribeToNamespace', () => {
  it('should be possible to subscribe to a namespace state change', () => {
    // instead of a global import we use require to have a clean state for every test
    const { getNamespaceState, subscribeToNamespace, updateFieldStateWithCallback } = require('../src/state')

    const mockCallback1 = jest.fn()
    const mockCallback2 = jest.fn()

    const unsubscribe1 = subscribeToNamespace('namespace1', mockCallback1)

    updateFieldStateWithCallback('namespace1', 'foobar1', () => ({
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_VALID]: false,
    }))

    const unsubscribe2 = subscribeToNamespace('namespace1', mockCallback2)

    updateFieldStateWithCallback('namespace1', 'foobar2', () => ({
      [FIELD_KEY_ERROR]: 'barfoo',
      [FIELD_KEY_FOCUS]: true,
    }))

    unsubscribe1()

    updateFieldStateWithCallback('namespace1', 'foobar3', () => ({
      [FIELD_KEY_ERROR]: null,
      [FIELD_KEY_VALID]: true,
      [FIELD_KEY_FOCUS]: true,
    }))

    unsubscribe2()

    updateFieldStateWithCallback('namespace1', 'foobar4', () => ({
      [FIELD_KEY_FOCUS]: false,
    }))

    expect(mockCallback1).toHaveBeenCalledTimes(2)
    expect(mockCallback2).toHaveBeenCalledTimes(2)

    // expect(mockCallback1).toHaveBeenNthCalledWith(1, {})
    expect(mockCallback1).toHaveBeenNthCalledWith(1, {
      foobar1: {
        [FIELD_KEY_VALUE]: 'foobar',
        [FIELD_KEY_VALID]: false,
      },
    })
    // expect(mockCallback2).toHaveBeenNthCalledWith(1, {
    //   foobar1: {
    //     [FIELD_KEY_VALUE]: 'foobar',
    //     [FIELD_KEY_VALID]: false,
    //   },
    // })
    const afterSecondUpdate = {
      foobar1: {
        [FIELD_KEY_VALUE]: 'foobar',
        [FIELD_KEY_VALID]: false,
      },
      foobar2: {
        [FIELD_KEY_ERROR]: 'barfoo',
        [FIELD_KEY_FOCUS]: true,
      },
    }
    expect(mockCallback1).toHaveBeenNthCalledWith(2, afterSecondUpdate)

    expect(mockCallback2).toHaveBeenNthCalledWith(2, {
      foobar1: {
        [FIELD_KEY_VALUE]: 'foobar',
        [FIELD_KEY_VALID]: false,
      },
      foobar2: {
        [FIELD_KEY_ERROR]: 'barfoo',
        [FIELD_KEY_FOCUS]: true,
      },
      foobar3: {
        [FIELD_KEY_ERROR]: null,
        [FIELD_KEY_FOCUS]: true,
        [FIELD_KEY_VALID]: true,
      },
    })

    expect(getNamespaceState('namespace1', 'foobar')).toEqual({
      foobar1: {
        [FIELD_KEY_VALUE]: 'foobar',
        [FIELD_KEY_VALID]: false,
      },
      foobar2: {
        [FIELD_KEY_ERROR]: 'barfoo',
        [FIELD_KEY_FOCUS]: true,
      },
      foobar3: {
        [FIELD_KEY_ERROR]: null,
        [FIELD_KEY_FOCUS]: true,
        [FIELD_KEY_VALID]: true,
      },
      foobar4: {
        [FIELD_KEY_FOCUS]: false,
      },
    })
  })
})

describe('updateFieldStateWithCallback', () => {
  it('should be possible to update the field state with a callback', () => {
    // instead of a global import we use require to have a clean state for every test
    const { getFieldState, updateFieldStateWithCallback } = require('../src/state')

    expect(getFieldState('namespace1', 'foobar')).toStrictEqual(FIELD_STATE_DEFAULT)

    updateFieldStateWithCallback('namespace1', 'foobar', () => ({
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_ERROR]: 'error-text',
      [FIELD_KEY_VALID]: false,
    }))

    expect(getFieldState('namespace1', 'foobar')).toEqual({
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_ERROR]: 'error-text',
      [FIELD_KEY_VALID]: false,
    })

    updateFieldStateWithCallback('namespace1', 'foobar', () => ({
      [FIELD_KEY_VALUE]: 'barfoo',
      [FIELD_KEY_FOCUS]: true,
    }))

    expect(getFieldState('namespace1', 'foobar')).toEqual({
      [FIELD_KEY_VALUE]: 'barfoo',
      [FIELD_KEY_ERROR]: 'error-text',
      [FIELD_KEY_VALID]: false,
      [FIELD_KEY_FOCUS]: true,
    })
  })

  it('should only update the field state when the callback returns object', () => {
    // instead of a global import we use require to have a clean state for every test
    const { getFieldState, subscribeToField, updateFieldStateWithCallback } = require('../src/state')

    const mockCallback = jest.fn()
    subscribeToField('namespace1', 'foobar', mockCallback)

    updateFieldStateWithCallback('namespace1', 'foobar', () => ({
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_ERROR]: 'error-text',
      [FIELD_KEY_VALID]: false,
    }))

    expect(getFieldState('namespace1', 'foobar')).toEqual({
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_ERROR]: 'error-text',
      [FIELD_KEY_VALID]: false,
    })

    updateFieldStateWithCallback('namespace1', 'foobar', () => false)
    updateFieldStateWithCallback('namespace1', 'foobar', () => '')
    updateFieldStateWithCallback('namespace1', 'foobar', () => null)

    expect(getFieldState('namespace1', 'foobar')).toEqual({
      [FIELD_KEY_VALUE]: 'foobar',
      [FIELD_KEY_ERROR]: 'error-text',
      [FIELD_KEY_VALID]: false,
    })
    expect(mockCallback).toHaveBeenCalledTimes(1)
  })
})
