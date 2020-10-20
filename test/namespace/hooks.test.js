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
  creatorUseGetNamespace,
  creatorUseIsEveryNamespace,
  creatorUseIsSomeNamespace,
  creatorUseNamespace,
  removeField,
  updateFieldStateWithCallback,
  useNamespaceErrors,
  useNamespaceHasFocus,
  useNamespaceIsDirty,
  useNamespaceIsTouched,
  useNamespaceIsValid,
  useNamespaceValues,
  useNamespaceValuesOnFocus,
} from '../../src'

// reset modules to be sure that we have a clean state for every test
beforeEach(() => {
  removeField('spaceName', 'nameField1')
  removeField('spaceName', 'nameField2')

  global.console = {
    error: jest.fn(),
  }
})

describe('creatorUseNamespace', () => {
  const DUMMY_KEY = 'dummy-key'
  const DUMMY_DEFAULT = 'default-value'

  let useNamespaceTest

  beforeEach(() => {
    useNamespaceTest = creatorUseNamespace((namespaceState) => namespaceState.nameField1?.[DUMMY_KEY] || DUMMY_DEFAULT)
  })

  it('should log a console error when namespace is too short', () => {
    const { result } = renderHook(() => useNamespaceTest(''))

    expect(global.console.error).toHaveBeenCalledWith('Expected string with a minimal length of 1 for `namespace`')

    // should still return a value
    expect(result.current).toBe(DUMMY_DEFAULT)
  })

  it('should return the current state on initial render', () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [DUMMY_KEY]: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceTest('spaceName'))
    expect(result.current).toBe('foobar')
  })

  it('should return the state and renders the component when the state updates', async () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [DUMMY_KEY]: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceTest('spaceName'))
    expect(result.current).toBe('foobar')

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
        [DUMMY_KEY]: 'barfoo',
      }))
    )

    expect(result.current).toBe('barfoo')
  })
})

describe('creatorUseGetNamespace', () => {
  const DUMMY_KEY = 'dummy-key'
  const DUMMY_DEFAULT = 'default-value'

  let useNamespaceTest

  beforeEach(() => {
    useNamespaceTest = creatorUseGetNamespace(DUMMY_KEY, DUMMY_DEFAULT)
  })

  it('should log a console error when namespace is too short', () => {
    const { result } = renderHook(() => useNamespaceTest(''))

    expect(global.console.error).toHaveBeenCalledWith('Expected string with a minimal length of 1 for `namespace`')

    // should still return a value
    expect(result.current).toEqual({})
  })

  it('should return empty object if namespace is not initialized', () => {
    const { result } = renderHook(() => useNamespaceTest('spaceName'))
    expect(result.current).toEqual({})
  })

  it('should return the default value if field key is not set', () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      otherKey: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceTest('spaceName'))
    expect(result.current).toEqual({ nameField1: DUMMY_DEFAULT })
  })

  it('should return the current state on initial render', () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [DUMMY_KEY]: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceTest('spaceName'))
    expect(result.current).toEqual({ nameField1: 'foobar' })
  })

  it('should return the state and renders the component when the state updates', async () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [DUMMY_KEY]: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceTest('spaceName'))
    expect(result.current).toEqual({ nameField1: 'foobar' })

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
        [DUMMY_KEY]: 'barfoo',
      }))
    )

    expect(result.current).toEqual({ nameField1: 'barfoo' })
  })
})

describe('creatorUseIsEveryNamespace', () => {
  const DUMMY_KEY = 'dummy-key'

  let useNamespaceTest

  beforeEach(() => {
    useNamespaceTest = creatorUseIsEveryNamespace(DUMMY_KEY)
  })

  it('should log a console error when namespace is too short', () => {
    const { result } = renderHook(() => useNamespaceTest(''))

    expect(global.console.error).toHaveBeenCalledWith('Expected string with a minimal length of 1 for `namespace`')

    // should still return a value
    expect(result.current).toEqual(true)
  })

  it('should return true if namespace is not initialized', () => {
    const { result } = renderHook(() => useNamespaceTest('spaceName'))
    expect(result.current).toEqual(true)
  })

  it('should return false if field key is not set', () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      otherKey: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceTest('spaceName'))
    expect(result.current).toEqual(false)
  })

  it('should return the current state on initial render', () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [DUMMY_KEY]: true,
    }))

    const { result: result1 } = renderHook(() => useNamespaceTest('spaceName'))
    expect(result1.current).toEqual(true)

    updateFieldStateWithCallback('spaceName', 'nameField2', () => ({
      [DUMMY_KEY]: false,
    }))

    const { result: result2 } = renderHook(() => useNamespaceTest('spaceName'))
    expect(result2.current).toEqual(false)
  })

  it('should return the state and renders the component when the state updates', async () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [DUMMY_KEY]: true,
    }))

    const { result } = renderHook(() => useNamespaceTest('spaceName'))
    expect(result.current).toEqual(true)

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField2', () => ({
        [DUMMY_KEY]: false,
      }))
    )

    expect(result.current).toEqual(false)
  })
})

describe('creatorUseIsSomeNamespace', () => {
  const DUMMY_KEY = 'dummy-key'

  let useNamespaceTest

  beforeEach(() => {
    useNamespaceTest = creatorUseIsSomeNamespace(DUMMY_KEY)
  })

  it('should log a console error when namespace is too short', () => {
    const { result } = renderHook(() => useNamespaceTest(''))

    expect(global.console.error).toHaveBeenCalledWith('Expected string with a minimal length of 1 for `namespace`')

    // should still return a value
    expect(result.current).toEqual(false)
  })

  it('should return false if namespace is not initialized', () => {
    const { result } = renderHook(() => useNamespaceTest('spaceName'))
    expect(result.current).toEqual(false)
  })

  it('should return false if field key is not set', () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      otherKey: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceTest('spaceName'))
    expect(result.current).toEqual(false)
  })

  it('should return the current state on initial render', () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [DUMMY_KEY]: true,
    }))

    const { result: result1 } = renderHook(() => useNamespaceTest('spaceName'))
    expect(result1.current).toEqual(true)

    updateFieldStateWithCallback('spaceName', 'nameField2', () => ({
      [DUMMY_KEY]: false,
    }))

    const { result: result2 } = renderHook(() => useNamespaceTest('spaceName'))
    expect(result2.current).toEqual(true)
  })

  it('should return the state and renders the component when the state updates', async () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [DUMMY_KEY]: true,
    }))

    const { result } = renderHook(() => useNamespaceTest('spaceName'))
    expect(result.current).toEqual(true)

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField2', () => ({
        [DUMMY_KEY]: false,
      }))
    )

    expect(result.current).toEqual(true)
  })
})

describe('useNamespaceErrors', () => {
  it('should log a console error when namespace is too short', () => {
    const { result } = renderHook(() => useNamespaceErrors(''))

    expect(global.console.error).toHaveBeenCalledWith('Expected string with a minimal length of 1 for `namespace`')

    // should still return a value
    expect(result.current).toEqual({})
  })

  it('should return empty object if namespace is not initialized', () => {
    const { result } = renderHook(() => useNamespaceErrors('spaceName'))
    expect(result.current).toEqual({})
  })

  it('should return the default value if field key is not set', () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      otherKey: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceErrors('spaceName'))
    expect(result.current).toEqual({ nameField1: FIELD_DEFAULT_ERROR })
  })

  it('should return the current state on initial render', () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_ERROR]: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceErrors('spaceName'))
    expect(result.current).toEqual({ nameField1: 'foobar' })
  })

  it('should return the state and renders the component when the state updates', async () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_ERROR]: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceErrors('spaceName'))
    expect(result.current).toEqual({ nameField1: 'foobar' })

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
        [FIELD_KEY_ERROR]: 'barfoo',
      }))
    )

    expect(result.current).toEqual({ nameField1: 'barfoo' })
  })
})

describe('useNamespaceHasFocus', () => {
  it('should log a console error when namespace is too short', () => {
    const { result } = renderHook(() => useNamespaceHasFocus(''))

    expect(global.console.error).toHaveBeenCalledWith('Expected string with a minimal length of 1 for `namespace`')

    // should still return a value
    expect(result.current).toEqual(false)
  })

  it('should return false if namespace is not initialized', () => {
    const { result } = renderHook(() => useNamespaceHasFocus('spaceName'))
    expect(result.current).toEqual(false)
  })

  it('should return false if field key is not set', () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      otherKey: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceHasFocus('spaceName'))
    expect(result.current).toEqual(false)
  })

  it('should return the current state on initial render', () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_FOCUS]: true,
    }))

    const { result: result1 } = renderHook(() => useNamespaceHasFocus('spaceName'))
    expect(result1.current).toEqual(true)

    updateFieldStateWithCallback('spaceName', 'nameField2', () => ({
      [FIELD_KEY_FOCUS]: false,
    }))

    const { result: result2 } = renderHook(() => useNamespaceHasFocus('spaceName'))
    expect(result2.current).toEqual(true)
  })

  it('should return the state and renders the component when the state updates', async () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_FOCUS]: true,
    }))

    const { result } = renderHook(() => useNamespaceHasFocus('spaceName'))
    expect(result.current).toEqual(true)

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField2', () => ({
        [FIELD_KEY_FOCUS]: false,
      }))
    )

    expect(result.current).toEqual(true)
  })
})

describe('useNamespaceIsDirty', () => {
  it('should log a console error when namespace is too short', () => {
    const { result } = renderHook(() => useNamespaceIsDirty(''))

    expect(global.console.error).toHaveBeenCalledWith('Expected string with a minimal length of 1 for `namespace`')

    // should still return a value
    expect(result.current).toEqual(false)
  })

  it('should return false if namespace is not initialized', () => {
    const { result } = renderHook(() => useNamespaceIsDirty('spaceName'))
    expect(result.current).toEqual(false)
  })

  it('should return false if field key is not set', () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      otherKey: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceIsDirty('spaceName'))
    expect(result.current).toEqual(false)
  })

  it('should return the current state on initial render', () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_DIRTY]: true,
    }))

    const { result: result1 } = renderHook(() => useNamespaceIsDirty('spaceName'))
    expect(result1.current).toEqual(true)

    updateFieldStateWithCallback('spaceName', 'nameField2', () => ({
      [FIELD_KEY_DIRTY]: false,
    }))

    const { result: result2 } = renderHook(() => useNamespaceIsDirty('spaceName'))
    expect(result2.current).toEqual(true)
  })

  it('should return the state and renders the component when the state updates', async () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_DIRTY]: true,
    }))

    const { result } = renderHook(() => useNamespaceIsDirty('spaceName'))
    expect(result.current).toEqual(true)

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField2', () => ({
        [FIELD_KEY_DIRTY]: false,
      }))
    )

    expect(result.current).toEqual(true)
  })
})

describe('useNamespaceIsTouched', () => {
  it('should log a console error when namespace is too short', () => {
    const { result } = renderHook(() => useNamespaceIsTouched(''))

    expect(global.console.error).toHaveBeenCalledWith('Expected string with a minimal length of 1 for `namespace`')

    // should still return a value
    expect(result.current).toEqual(false)
  })

  it('should return false if namespace is not initialized', () => {
    const { result } = renderHook(() => useNamespaceIsTouched('spaceName'))
    expect(result.current).toEqual(false)
  })

  it('should return false if field key is not set', () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      otherKey: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceIsTouched('spaceName'))
    expect(result.current).toEqual(false)
  })

  it('should return the current state on initial render', () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_TOUCHED]: true,
    }))

    const { result: result1 } = renderHook(() => useNamespaceIsTouched('spaceName'))
    expect(result1.current).toEqual(true)

    updateFieldStateWithCallback('spaceName', 'nameField2', () => ({
      [FIELD_KEY_TOUCHED]: false,
    }))

    const { result: result2 } = renderHook(() => useNamespaceIsTouched('spaceName'))
    expect(result2.current).toEqual(true)
  })

  it('should return the state and renders the component when the state updates', async () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_TOUCHED]: true,
    }))

    const { result } = renderHook(() => useNamespaceIsTouched('spaceName'))
    expect(result.current).toEqual(true)

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField2', () => ({
        [FIELD_KEY_TOUCHED]: false,
      }))
    )

    expect(result.current).toEqual(true)
  })
})

describe('useNamespaceIsValid', () => {
  it('should log a console error when namespace is too short', () => {
    const { result } = renderHook(() => useNamespaceIsValid(''))

    expect(global.console.error).toHaveBeenCalledWith('Expected string with a minimal length of 1 for `namespace`')

    // should still return a value
    expect(result.current).toEqual(true)
  })

  it('should return true if namespace is not initialized', () => {
    const { result } = renderHook(() => useNamespaceIsValid('spaceName'))
    expect(result.current).toEqual(true)
  })

  it('should return false if field key is not set', () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      otherKey: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceIsValid('spaceName'))
    expect(result.current).toEqual(false)
  })

  it('should return the current state on initial render', () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_VALID]: true,
    }))

    const { result: result1 } = renderHook(() => useNamespaceIsValid('spaceName'))
    expect(result1.current).toEqual(true)

    updateFieldStateWithCallback('spaceName', 'nameField2', () => ({
      [FIELD_KEY_VALID]: false,
    }))

    const { result: result2 } = renderHook(() => useNamespaceIsValid('spaceName'))
    expect(result2.current).toEqual(false)
  })

  it('should return the state and renders the component when the state updates', async () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_VALID]: true,
    }))

    const { result } = renderHook(() => useNamespaceIsValid('spaceName'))
    expect(result.current).toEqual(true)

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField2', () => ({
        [FIELD_KEY_VALID]: false,
      }))
    )

    expect(result.current).toEqual(false)
  })
})

describe('useNamespaceValues', () => {
  it('should log a console value when namespace is too short', () => {
    const { result } = renderHook(() => useNamespaceValues(''))

    expect(global.console.error).toHaveBeenCalledWith('Expected string with a minimal length of 1 for `namespace`')

    // should still return a value
    expect(result.current).toEqual({})
  })

  it('should return empty object if namespace is not initialized', () => {
    const { result } = renderHook(() => useNamespaceValues('spaceName'))
    expect(result.current).toEqual({})
  })

  it('should return the default value if field key is not set', () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      otherKey: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceValues('spaceName'))
    expect(result.current).toEqual({ nameField1: FIELD_DEFAULT_VALUE })
  })

  it('should return the current state on initial render', () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_VALUE]: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceValues('spaceName'))
    expect(result.current).toEqual({ nameField1: 'foobar' })
  })

  it('should return the state and renders the component when the state updates', async () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_VALUE]: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceValues('spaceName'))
    expect(result.current).toEqual({ nameField1: 'foobar' })

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
        [FIELD_KEY_VALUE]: 'barfoo',
      }))
    )

    expect(result.current).toEqual({ nameField1: 'barfoo' })
  })
})

describe('useNamespaceValuesOnFocus', () => {
  it('should log a console value when namespace is too short', () => {
    const { result } = renderHook(() => useNamespaceValuesOnFocus(''))

    expect(global.console.error).toHaveBeenCalledWith('Expected string with a minimal length of 1 for `namespace`')

    // should still return a value
    expect(result.current).toEqual({})
  })

  it('should return empty object if namespace is not initialized', () => {
    const { result } = renderHook(() => useNamespaceValuesOnFocus('spaceName'))
    expect(result.current).toEqual({})
  })

  it('should return the default value if field key is not set', () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      otherKey: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceValuesOnFocus('spaceName'))
    expect(result.current).toEqual({ nameField1: FIELD_DEFAULT_VALUE_ON_FOCUS })
  })

  it('should return the current state on initial render', () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_VALUE_ON_FOCUS]: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceValuesOnFocus('spaceName'))
    expect(result.current).toEqual({ nameField1: 'foobar' })
  })

  it('should return the state and renders the component when the state updates', async () => {
    updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
      [FIELD_KEY_VALUE_ON_FOCUS]: 'foobar',
    }))

    const { result } = renderHook(() => useNamespaceValuesOnFocus('spaceName'))
    expect(result.current).toEqual({ nameField1: 'foobar' })

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField1', () => ({
        [FIELD_KEY_VALUE_ON_FOCUS]: 'barfoo',
      }))
    )

    expect(result.current).toEqual({ nameField1: 'barfoo' })
  })
})
