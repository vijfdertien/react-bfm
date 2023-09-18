import { act, renderHook } from '@testing-library/react-hooks'
import {
  useFieldError,
  useFieldHasFocus,
  FIELD_KEY_DIRTY,
  FIELD_KEY_ERROR,
  FIELD_KEY_FOCUS,
  FIELD_KEY_TOUCHED,
  FIELD_KEY_VALID,
  FIELD_KEY_VALUE,
  FIELD_KEY_VALUE_ON_FOCUS,
  initFieldState,
  updateFieldStateWithCallback,
  removeField,
  useFieldIsDirty,
  useFieldIsTouched,
  useFieldIsValid,
  useFieldValue,
  useFieldValueOnFocus,
  useFieldState,
  FIELD_STATE_DEFAULT,
} from '../../src'

// reset modules to be sure that we have a clean state for every test
beforeEach(() => {
  removeField('spaceName', 'nameField')
})

describe('useFieldState', () => {
  it('should throw error when namespace is too short', () => {
    const { result } = renderHook(() => useFieldState('', 'nameField'))

    expect(result.error?.message).toBe('Expected string with a minimal length of 1 for `namespace`')
  })

  it('should log a console error when fieldName is too short', () => {
    const { result } = renderHook(() => useFieldState('spaceName', ''))

    expect(result.error?.message).toBe('Expected string with a minimal length of 1 for `fieldName`')
  })

  it('should return the default value if field is not initialized', () => {
    const { result } = renderHook(() => useFieldState('spaceName', 'nameField'))
    expect(result.current).not.toBeDefined()
  })

  it('should return the current state on initial render', () => {
    initFieldState('spaceName', 'nameField', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_VALUE]: 'foobar',
    }))

    const { result } = renderHook(() => useFieldState('spaceName', 'nameField'))
    expect(result.current).toStrictEqual({
      ...FIELD_STATE_DEFAULT,
      value: 'foobar',
    })
  })

  it('should return the state and renders the component when the state updates', async () => {
    initFieldState('spaceName', 'nameField', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_VALUE]: 'foobar',
    }))

    const { result } = renderHook(() => useFieldState('spaceName', 'nameField'))
    expect(result.current).toStrictEqual({
      ...FIELD_STATE_DEFAULT,
      value: 'foobar',
    })

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField', () => ({
        [FIELD_KEY_VALUE]: 'barfoo',
      })),
    )

    expect(result.current).toStrictEqual({
      ...FIELD_STATE_DEFAULT,
      value: 'barfoo',
    })
  })
})

describe('useFieldError', () => {
  it('should return the default value if field is not initialized', () => {
    const { result } = renderHook(() => useFieldError('spaceName', 'nameField'))
    expect(result.current).not.toBeDefined()
  })

  it('should return the current state on initial render', () => {
    initFieldState('spaceName', 'nameField', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_ERROR]: 'foobar',
    }))

    const { result } = renderHook(() => useFieldError('spaceName', 'nameField'))
    expect(result.current).toBe('foobar')
  })

  it('should return the state and renders the component when the store updates', async () => {
    initFieldState('spaceName', 'nameField', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_ERROR]: 'foobar',
    }))

    const { result } = renderHook(() => useFieldError('spaceName', 'nameField'))
    expect(result.current).toBe('foobar')

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField', () => ({
        [FIELD_KEY_ERROR]: 'barfoo',
      })),
    )

    expect(result.current).toBe('barfoo')
  })
})

describe('useFieldHasFocus', () => {
  it('should return the default value if field is not initialized', () => {
    const { result } = renderHook(() => useFieldHasFocus('spaceName', 'nameField'))
    expect(result.current).not.toBeDefined()
  })

  it('should return the current state on initial render', () => {
    initFieldState('spaceName', 'nameField', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_FOCUS]: true,
    }))

    const { result } = renderHook(() => useFieldHasFocus('spaceName', 'nameField'))
    expect(result.current).toBe(true)
  })

  it('should return the state and renders the component when the store updates', async () => {
    initFieldState('spaceName', 'nameField', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_FOCUS]: true,
    }))

    const { result } = renderHook(() => useFieldHasFocus('spaceName', 'nameField'))
    expect(result.current).toBe(true)

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField', () => ({
        [FIELD_KEY_FOCUS]: false,
      })),
    )

    expect(result.current).toBe(false)
  })
})

describe('useFieldIsDirty', () => {
  it('should return the default value if field is not initialized', () => {
    const { result } = renderHook(() => useFieldIsDirty('spaceName', 'nameField'))
    expect(result.current).not.toBeDefined()
  })

  it('should return the current state on initial render', () => {
    initFieldState('spaceName', 'nameField', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_DIRTY]: true,
    }))

    const { result } = renderHook(() => useFieldIsDirty('spaceName', 'nameField'))
    expect(result.current).toBe(true)
  })

  it('should return the state and renders the component when the store updates', async () => {
    initFieldState('spaceName', 'nameField', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_DIRTY]: true,
    }))

    const { result } = renderHook(() => useFieldIsDirty('spaceName', 'nameField'))
    expect(result.current).toBe(true)

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField', () => ({
        [FIELD_KEY_DIRTY]: false,
      })),
    )

    expect(result.current).toBe(false)
  })
})

describe('useFieldIsTouched', () => {
  it('should return undefined if field is not initialized', () => {
    const { result } = renderHook(() => useFieldIsTouched('spaceName', 'nameField'))
    expect(result.current).not.toBeDefined()
  })

  it('should return the current state on initial render', () => {
    initFieldState('spaceName', 'nameField', '', null)
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_TOUCHED]: true,
    }))

    const { result } = renderHook(() => useFieldIsTouched('spaceName', 'nameField'))
    expect(result.current).toBe(true)
  })

  it('should return the state and renders the component when the store updates', async () => {
    initFieldState('spaceName', 'nameField', '', null)
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_TOUCHED]: true,
    }))

    const { result } = renderHook(() => useFieldIsTouched('spaceName', 'nameField'))
    expect(result.current).toBe(true)

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField', () => ({
        [FIELD_KEY_TOUCHED]: false,
      })),
    )

    expect(result.current).toBe(false)
  })
})

describe('useFieldIsValid', () => {
  it('should return the default value if field is not initialized', () => {
    const { result } = renderHook(() => useFieldIsValid('spaceName', 'nameField'))
    expect(result.current).not.toBeDefined()
  })

  it('should return the current state on initial render', () => {
    initFieldState('spaceName', 'nameField', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_VALID]: false,
    }))

    const { result } = renderHook(() => useFieldIsValid('spaceName', 'nameField'))
    expect(result.current).toBe(false)
  })

  it('should return the state and renders the component when the store updates', async () => {
    initFieldState('spaceName', 'nameField', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_VALID]: true,
    }))

    const { result } = renderHook(() => useFieldIsValid('spaceName', 'nameField'))
    expect(result.current).toBe(true)

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField', () => ({
        [FIELD_KEY_VALID]: false,
      })),
    )

    expect(result.current).toBe(false)
  })
})

describe('useFieldValue', () => {
  it('should return the default value if field is not initialized', () => {
    const { result } = renderHook(() => useFieldValue('spaceName', 'nameField'))
    expect(result.current).not.toBeDefined()
  })

  it('should return the current state on initial render', () => {
    initFieldState('spaceName', 'nameField', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_VALUE]: 'barfoo',
    }))

    const { result } = renderHook(() => useFieldValue('spaceName', 'nameField'))
    expect(result.current).toBe('barfoo')
  })

  it('should return the state and renders the component when the store updates', async () => {
    initFieldState('spaceName', 'nameField', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_VALUE]: 'foobar',
    }))

    const { result } = renderHook(() => useFieldValue('spaceName', 'nameField'))
    expect(result.current).toBe('foobar')

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField', () => ({
        [FIELD_KEY_VALUE]: 'fboaor',
      })),
    )

    expect(result.current).toBe('fboaor')
  })
})

describe('useFieldValueOnFocus', () => {
  it('should return the default value if field is not initialized', () => {
    const { result } = renderHook(() => useFieldValueOnFocus('spaceName', 'nameField'))
    expect(result.current).not.toBeDefined()
  })

  it('should return the current state on initial render', () => {
    initFieldState('spaceName', 'nameField', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_VALUE_ON_FOCUS]: 'barfoo',
    }))

    const { result } = renderHook(() => useFieldValueOnFocus('spaceName', 'nameField'))
    expect(result.current).toBe('barfoo')
  })

  it('should return the state and renders the component when the store updates', async () => {
    initFieldState('spaceName', 'nameField', '', null)

    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_VALUE_ON_FOCUS]: 'foobar',
    }))

    const { result } = renderHook(() => useFieldValueOnFocus('spaceName', 'nameField'))
    expect(result.current).toBe('foobar')

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField', () => ({
        [FIELD_KEY_VALUE_ON_FOCUS]: 'fboaor',
      })),
    )

    expect(result.current).toBe('fboaor')
  })
})
