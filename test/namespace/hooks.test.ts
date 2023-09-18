import { act, renderHook } from '@testing-library/react-hooks'
import {
  FIELD_DEFAULT_ERROR,
  FIELD_DEFAULT_VALUE,
  FIELD_DEFAULT_VALUE_ON_FOCUS,
  FIELD_KEY_DIRTY,
  FIELD_KEY_ERROR,
  FIELD_KEY_FOCUS,
  FIELD_KEY_TOUCHED,
  FIELD_KEY_VALID,
  FIELD_KEY_VALUE,
  FIELD_KEY_VALUE_ON_FOCUS,
  FIELD_STATE_DEFAULT,
  removeField,
  updateFieldStateWithCallback,
  useNamespaceErrors,
  useNamespaceHasFocus,
  useNamespaceIsDirty,
  useNamespaceIsTouched,
  useNamespaceIsValid,
  useNamespaceKeyIsEvery,
  useNamespaceKeyIsSome,
  useNamespaceState,
  useNamespaceValues,
  useNamespaceValuesOnFocus,
} from '../../src'
import { initFieldState } from '../../src/state'

// reset modules to be sure that we have a clean state for every test
beforeEach(() => {
  removeField('spaceName', 'nameField1')
  removeField('spaceName', 'nameField2')

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.console = {
    error: jest.fn(),
  }
})

describe('useNamespaceState', () => {
  it('should log a console error when namespace is too short', () => {
    renderHook(() => useNamespaceState(''))

    expect(global.console.error).toHaveBeenCalledWith('Expected string with a minimal length of 1 for `namespace`')
  })

  it('should return the default value if field key is not set', () => {
    initFieldState('spaceName', 'nameField1', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({}))

    const { result } = renderHook(() => useNamespaceState('spaceName'))
    expect(result.current).toStrictEqual({
      nameField1: FIELD_STATE_DEFAULT,
    })
  })

  it('should return the current state on initial render', () => {
    initFieldState('spaceName', 'nameField1', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_VALUE]: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceState('spaceName'))
    expect(result.current).toStrictEqual({
      nameField1: {
        ...FIELD_STATE_DEFAULT,
        value: 'foobar',
      },
    })
  })

  it('should return the state and renders the component when the state updates', async () => {
    initFieldState('spaceName', 'nameField1', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_VALUE]: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceState('spaceName'))
    expect(result.current).toStrictEqual({
      nameField1: {
        ...FIELD_STATE_DEFAULT,
        value: 'foobar',
      },
    })
    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
        [FIELD_KEY_VALUE]: 'barfoo',
      })),
    )

    expect(result.current).toStrictEqual({
      nameField1: {
        ...FIELD_STATE_DEFAULT,
        value: 'barfoo',
      },
    })
  })
})

describe('useNamespaceKeyIsEvery', () => {
  it('should log a console error when namespace is too short', () => {
    const { result } = renderHook(() => useNamespaceKeyIsEvery('', FIELD_KEY_VALUE))

    expect(global.console.error).toHaveBeenCalledWith('Expected string with a minimal length of 1 for `namespace`')

    expect(result.current).not.toBeDefined()
  })

  it('should return undefined if namespace is not initialized', () => {
    const { result } = renderHook(() => useNamespaceKeyIsEvery('spaceName', FIELD_KEY_VALUE))
    expect(result.current).not.toBeDefined()
  })

  it('should return the current state on initial render', () => {
    initFieldState('spaceName', 'nameField1', '', null)
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_VALUE]: true,
    }))

    const { result: result1 } = renderHook(() => useNamespaceKeyIsEvery('spaceName', FIELD_KEY_VALUE))
    expect(result1.current).toEqual(true)

    initFieldState('spaceName', 'nameField2', '', null)
    updateFieldStateWithCallback('spaceName', 'nameField2', () => ({
      [FIELD_KEY_VALUE]: false,
    }))

    const { result: result2 } = renderHook(() => useNamespaceKeyIsEvery('spaceName', FIELD_KEY_VALUE))
    expect(result2.current).toEqual(false)
  })

  it('should return the state and renders the component when the state updates', async () => {
    initFieldState('spaceName', 'nameField1', '', null)
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_VALUE]: true,
    }))

    const { result } = renderHook(() => useNamespaceKeyIsEvery('spaceName', FIELD_KEY_VALUE))
    expect(result.current).toEqual(true)

    initFieldState('spaceName', 'nameField2', '', null)

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField2', () => ({
        [FIELD_KEY_VALUE]: false,
      })),
    )

    expect(result.current).toEqual(false)
  })
})

describe('useNamespaceKeyIsSome', () => {
  it('should log a console error when namespace is too short', () => {
    const { result } = renderHook(() => useNamespaceKeyIsSome('', FIELD_KEY_VALUE))

    expect(global.console.error).toHaveBeenCalledWith('Expected string with a minimal length of 1 for `namespace`')

    expect(result.current).not.toBeDefined()
  })

  it('should return undefined if namespace is not initialized', () => {
    const { result } = renderHook(() => useNamespaceKeyIsSome('spaceName', FIELD_KEY_VALUE))
    expect(result.current).not.toBeDefined()
  })

  it('should return undefined if field key is not set', () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({}))

    const { result } = renderHook(() => useNamespaceKeyIsSome('spaceName', FIELD_KEY_VALUE))
    expect(result.current).not.toBeDefined()
  })

  it('should return the current state on initial render', () => {
    initFieldState('spaceName', 'nameField1', '', null)
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_VALUE]: true,
    }))

    const { result: result1 } = renderHook(() => useNamespaceKeyIsSome('spaceName', FIELD_KEY_VALUE))
    expect(result1.current).toEqual(true)

    initFieldState('spaceName', 'nameField2', '', null)
    updateFieldStateWithCallback('spaceName', 'nameField2', () => ({
      [FIELD_KEY_VALUE]: false,
    }))

    const { result: result2 } = renderHook(() => useNamespaceKeyIsSome('spaceName', FIELD_KEY_VALUE))
    expect(result2.current).toEqual(true)
  })

  it('should return the state and renders the component when the state updates', async () => {
    initFieldState('spaceName', 'nameField1', '', null)
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_VALUE]: true,
    }))

    const { result } = renderHook(() => useNamespaceKeyIsSome('spaceName', FIELD_KEY_VALUE))
    expect(result.current).toEqual(true)

    initFieldState('spaceName', 'nameField2', '', null)

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField2', () => ({
        [FIELD_KEY_VALUE]: false,
      })),
    )

    expect(result.current).toEqual(true)
  })
})

describe('useNamespaceErrors', () => {
  it('should log a console error when namespace is too short', () => {
    const { result } = renderHook(() => useNamespaceErrors(''))

    expect(global.console.error).toHaveBeenCalledWith('Expected string with a minimal length of 1 for `namespace`')

    expect(result.current).not.toBeDefined()
  })

  it('should return undefined if namespace is not initialized', () => {
    const { result } = renderHook(() => useNamespaceErrors('spaceName'))
    expect(result.current).not.toBeDefined()
  })

  it('should return the default value if field key is not set', () => {
    initFieldState('spaceName', 'nameField1', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({}))

    const { result } = renderHook(() => useNamespaceErrors('spaceName'))
    expect(result.current).toEqual({ nameField1: FIELD_DEFAULT_ERROR })
  })

  it('should return the current state on initial render', () => {
    initFieldState('spaceName', 'nameField1', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_ERROR]: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceErrors('spaceName'))
    expect(result.current).toEqual({ nameField1: 'foobar' })
  })

  it('should return the state and renders the component when the state updates', async () => {
    initFieldState('spaceName', 'nameField1', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_ERROR]: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceErrors('spaceName'))
    expect(result.current).toEqual({ nameField1: 'foobar' })

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
        [FIELD_KEY_ERROR]: 'barfoo',
      })),
    )

    expect(result.current).toEqual({ nameField1: 'barfoo' })
  })
})

describe('useNamespaceHasFocus', () => {
  it('should log a console error when namespace is too short', () => {
    const { result } = renderHook(() => useNamespaceHasFocus(''))

    expect(global.console.error).toHaveBeenCalledWith('Expected string with a minimal length of 1 for `namespace`')

    expect(result.current).not.toBeDefined()
  })

  it('should return undefined if namespace is not initialized', () => {
    const { result } = renderHook(() => useNamespaceHasFocus('spaceName'))
    expect(result.current).not.toBeDefined()
  })

  it('should return undefined if field key is not set', () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({}))

    const { result } = renderHook(() => useNamespaceHasFocus('spaceName'))
    expect(result.current).not.toBeDefined()
  })

  it('should return the current state on initial render', () => {
    initFieldState('spaceName', 'nameField1', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_FOCUS]: true,
    }))

    const { result: result1 } = renderHook(() => useNamespaceHasFocus('spaceName'))
    expect(result1.current).toEqual(true)

    initFieldState('spaceName', 'nameField2', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField2', () => ({
      [FIELD_KEY_FOCUS]: false,
    }))

    const { result: result2 } = renderHook(() => useNamespaceHasFocus('spaceName'))
    expect(result2.current).toEqual(true)
  })

  it('should return the state and renders the component when the state updates', async () => {
    initFieldState('spaceName', 'nameField1', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_FOCUS]: true,
    }))

    const { result } = renderHook(() => useNamespaceHasFocus('spaceName'))
    expect(result.current).toEqual(true)

    initFieldState('spaceName', 'nameField2', '', null)

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField2', () => ({
        [FIELD_KEY_FOCUS]: false,
      })),
    )

    expect(result.current).toEqual(true)
  })
})

describe('useNamespaceIsDirty', () => {
  it('should log a console error when namespace is too short', () => {
    const { result } = renderHook(() => useNamespaceIsDirty(''))

    expect(global.console.error).toHaveBeenCalledWith('Expected string with a minimal length of 1 for `namespace`')

    expect(result.current).not.toBeDefined()
  })

  it('should return undefined if namespace is not initialized', () => {
    const { result } = renderHook(() => useNamespaceIsDirty('spaceName'))
    expect(result.current).not.toBeDefined()
  })

  it('should return undefined if field key is not set', () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({}))

    const { result } = renderHook(() => useNamespaceIsDirty('spaceName'))
    expect(result.current).not.toBeDefined()
  })

  it('should return the current state on initial render', () => {
    initFieldState('spaceName', 'nameField1', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_DIRTY]: true,
    }))

    const { result: result1 } = renderHook(() => useNamespaceIsDirty('spaceName'))
    expect(result1.current).toEqual(true)

    initFieldState('spaceName', 'nameField2', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField2', () => ({
      [FIELD_KEY_DIRTY]: false,
    }))

    const { result: result2 } = renderHook(() => useNamespaceIsDirty('spaceName'))
    expect(result2.current).toEqual(true)
  })

  it('should return the state and renders the component when the state updates', async () => {
    initFieldState('spaceName', 'nameField1', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_DIRTY]: true,
    }))

    const { result } = renderHook(() => useNamespaceIsDirty('spaceName'))
    expect(result.current).toEqual(true)

    initFieldState('spaceName', 'nameField2', '', null)

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField2', () => ({
        [FIELD_KEY_DIRTY]: false,
      })),
    )

    expect(result.current).toEqual(true)
  })
})

describe('useNamespaceIsTouched', () => {
  it('should log a console error when namespace is too short', () => {
    const { result } = renderHook(() => useNamespaceIsTouched(''))

    expect(global.console.error).toHaveBeenCalledWith('Expected string with a minimal length of 1 for `namespace`')

    expect(result.current).not.toBeDefined()
  })

  it('should return false if namespace is not initialized', () => {
    const { result } = renderHook(() => useNamespaceIsTouched('spaceName'))

    expect(result.current).not.toBeDefined()
  })

  it('should return false if field key is not set', () => {
    initFieldState('spaceName', 'nameField1', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({}))

    const { result } = renderHook(() => useNamespaceIsTouched('spaceName'))
    expect(result.current).toEqual(false)
  })

  it('should return the current state on initial render', () => {
    initFieldState('spaceName', 'nameField1', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_TOUCHED]: true,
    }))

    const { result: result1 } = renderHook(() => useNamespaceIsTouched('spaceName'))
    expect(result1.current).toEqual(true)

    initFieldState('spaceName', 'nameField2', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField2', () => ({
      [FIELD_KEY_TOUCHED]: false,
    }))

    const { result: result2 } = renderHook(() => useNamespaceIsTouched('spaceName'))
    expect(result2.current).toEqual(true)
  })

  it('should return the state and renders the component when the state updates', async () => {
    initFieldState('spaceName', 'nameField1', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_TOUCHED]: true,
    }))

    const { result } = renderHook(() => useNamespaceIsTouched('spaceName'))
    expect(result.current).toEqual(true)

    initFieldState('spaceName', 'nameField2', '', null)

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField2', () => ({
        [FIELD_KEY_TOUCHED]: false,
      })),
    )

    expect(result.current).toEqual(true)
  })
})

describe('useNamespaceIsValid', () => {
  it('should log a console error when namespace is too short', () => {
    const { result } = renderHook(() => useNamespaceIsValid(''))

    expect(global.console.error).toHaveBeenCalledWith('Expected string with a minimal length of 1 for `namespace`')

    expect(result.current).not.toBeDefined()
  })

  it('should return true if namespace is not initialized', () => {
    const { result } = renderHook(() => useNamespaceIsValid('spaceName'))
    expect(result.current).not.toBeDefined()
  })

  it('should return the current state on initial render', () => {
    initFieldState('spaceName', 'nameField1', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_VALID]: true,
    }))

    const { result: result1 } = renderHook(() => useNamespaceIsValid('spaceName'))
    expect(result1.current).toEqual(true)

    initFieldState('spaceName', 'nameField2', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField2', () => ({
      [FIELD_KEY_VALID]: false,
    }))

    const { result: result2 } = renderHook(() => useNamespaceIsValid('spaceName'))
    expect(result2.current).toEqual(false)
  })

  it('should return the state and renders the component when the state updates', async () => {
    initFieldState('spaceName', 'nameField1', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_VALID]: true,
    }))

    const { result } = renderHook(() => useNamespaceIsValid('spaceName'))
    expect(result.current).toEqual(true)

    initFieldState('spaceName', 'nameField2', '', null)

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField2', () => ({
        [FIELD_KEY_VALID]: false,
      })),
    )

    expect(result.current).toEqual(false)
  })
})

describe('useNamespaceValues', () => {
  it('should log a console value when namespace is too short', () => {
    const { result } = renderHook(() => useNamespaceValues(''))

    expect(global.console.error).toHaveBeenCalledWith('Expected string with a minimal length of 1 for `namespace`')

    expect(result.current).not.toBeDefined()
  })

  it('should return empty object if namespace is not initialized', () => {
    const { result } = renderHook(() => useNamespaceValues('spaceName'))
    expect(result.current).not.toBeDefined()
  })

  it('should return the default value if field key is not set', () => {
    initFieldState('spaceName', 'nameField1', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({}))

    const { result } = renderHook(() => useNamespaceValues('spaceName'))
    expect(result.current).toEqual({ nameField1: FIELD_DEFAULT_VALUE })
  })

  it('should return the current state on initial render', () => {
    initFieldState('spaceName', 'nameField1', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_VALUE]: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceValues('spaceName'))
    expect(result.current).toEqual({ nameField1: 'foobar' })
  })

  it('should return the state and renders the component when the state updates', async () => {
    initFieldState('spaceName', 'nameField1', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_VALUE]: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceValues('spaceName'))
    expect(result.current).toEqual({ nameField1: 'foobar' })

    initFieldState('spaceName', 'nameField1', '', null)

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
        [FIELD_KEY_VALUE]: 'barfoo',
      })),
    )

    expect(result.current).toEqual({ nameField1: 'barfoo' })
  })
})

describe('useNamespaceValuesOnFocus', () => {
  it('should log a console value when namespace is too short', () => {
    const { result } = renderHook(() => useNamespaceValuesOnFocus(''))

    expect(global.console.error).toHaveBeenCalledWith('Expected string with a minimal length of 1 for `namespace`')

    expect(result.current).not.toBeDefined()
  })

  it('should return empty object if namespace is not initialized', () => {
    const { result } = renderHook(() => useNamespaceValuesOnFocus('spaceName'))
    expect(result.current).not.toBeDefined()
  })

  it('should return the default value if field key is not set', () => {
    initFieldState('spaceName', 'nameField1', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({}))

    const { result } = renderHook(() => useNamespaceValuesOnFocus('spaceName'))
    expect(result.current).toEqual({ nameField1: FIELD_DEFAULT_VALUE_ON_FOCUS })
  })

  it('should return the current state on initial render', () => {
    initFieldState('spaceName', 'nameField1', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_VALUE_ON_FOCUS]: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceValuesOnFocus('spaceName'))
    expect(result.current).toEqual({ nameField1: 'foobar' })
  })

  it('should return the state and renders the component when the state updates', async () => {
    initFieldState('spaceName', 'nameField1', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_VALUE_ON_FOCUS]: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceValuesOnFocus('spaceName'))
    expect(result.current).toEqual({ nameField1: 'foobar' })

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
        [FIELD_KEY_VALUE_ON_FOCUS]: 'barfoo',
      })),
    )

    expect(result.current).toEqual({ nameField1: 'barfoo' })
  })
})
