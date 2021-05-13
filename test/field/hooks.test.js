import { act, renderHook } from '@testing-library/react-hooks'
import {
  creatorUseField,
  useFieldError,
  useFieldHasFocus,
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
  updateFieldStateWithCallback,
  removeField,
  useFieldIsDirty,
  useFieldIsTouched,
  useFieldIsValid,
  useFieldValue,
  useFieldValueOnFocus,
} from '../../src'

// reset modules to be sure that we have a clean state for every test
beforeEach(() => {
  removeField('spaceName', 'nameField')
})

describe('creatorUseField', () => {
  const DUMMY_KEY = 'dummy-key'
  const DUMMY_DEFAULT = 'default-value'

  let useFieldTest

  beforeEach(() => {
    useFieldTest = creatorUseField(DUMMY_KEY, DUMMY_DEFAULT)
  })

  it('should log a console error when namespace is too short', () => {
    global.console.error = jest.fn()

    const { result } = renderHook(() => useFieldTest('', 'nameField'))

    expect(global.console.error).toHaveBeenCalledWith('Expected string with a minimal length of 1 for `namespace`')

    // should still return a value
    expect(result.current).toBe(DUMMY_DEFAULT)
  })

  it('should log a console error when fieldName is too short', () => {
    global.console.error = jest.fn()
    const { result } = renderHook(() => useFieldTest('spaceName', ''))

    expect(global.console.error).toHaveBeenCalledWith('Expected string with a minimal length of 1 for `fieldName`')

    // should still return a value
    expect(result.current).toBe(DUMMY_DEFAULT)
  })

  it('should return the default value if field is not initialized', () => {
    const { result } = renderHook(() => useFieldTest('spaceName', 'nameField'))
    expect(result.current).toBe(DUMMY_DEFAULT)
  })

  it('should return the current state on initial render', () => {
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [DUMMY_KEY]: 'foobar',
    }))

    const { result } = renderHook(() => useFieldTest('spaceName', 'nameField'))
    expect(result.current).toBe('foobar')
  })

  it('should return the state and renders the component when the state updates', async () => {
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [DUMMY_KEY]: 'foobar',
    }))

    const { result } = renderHook(() => useFieldTest('spaceName', 'nameField'))
    expect(result.current).toBe('foobar')

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField', () => ({
        [DUMMY_KEY]: 'barfoo',
      }))
    )

    expect(result.current).toBe('barfoo')
  })
})

describe('useFieldError', () => {
  it('should return the default value if field is not initialized', () => {
    const { result } = renderHook(() => useFieldError('spaceName', 'nameField'))
    expect(result.current).toBe(FIELD_DEFAULT_ERROR)
  })

  it('should return the current state on initial render', () => {
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_ERROR]: 'foobar',
    }))

    const { result } = renderHook(() => useFieldError('spaceName', 'nameField'))
    expect(result.current).toBe('foobar')
  })

  it('should return the state and renders the component when the store updates', async () => {
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_ERROR]: 'foobar',
    }))

    const { result } = renderHook(() => useFieldError('spaceName', 'nameField'))
    expect(result.current).toBe('foobar')

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField', () => ({
        [FIELD_KEY_ERROR]: 'barfoo',
      }))
    )

    expect(result.current).toBe('barfoo')
  })
})

describe('useFieldHasFocus', () => {
  it('should return the default value if field is not initialized', () => {
    const { result } = renderHook(() => useFieldHasFocus('spaceName', 'nameField'))
    expect(result.current).toBe(FIELD_DEFAULT_FOCUS)
  })

  it('should return the current state on initial render', () => {
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_FOCUS]: true,
    }))

    const { result } = renderHook(() => useFieldHasFocus('spaceName', 'nameField'))
    expect(result.current).toBe(true)
  })

  it('should return the state and renders the component when the store updates', async () => {
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_FOCUS]: true,
    }))

    const { result } = renderHook(() => useFieldHasFocus('spaceName', 'nameField'))
    expect(result.current).toBe(true)

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField', () => ({
        [FIELD_KEY_FOCUS]: false,
      }))
    )

    expect(result.current).toBe(false)
  })
})

describe('useFieldIsDirty', () => {
  it('should return the default value if field is not initialized', () => {
    const { result } = renderHook(() => useFieldIsDirty('spaceName', 'nameField'))
    expect(result.current).toBe(FIELD_DEFAULT_DIRTY)
  })

  it('should return the current state on initial render', () => {
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_DIRTY]: true,
    }))

    const { result } = renderHook(() => useFieldIsDirty('spaceName', 'nameField'))
    expect(result.current).toBe(true)
  })

  it('should return the state and renders the component when the store updates', async () => {
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_DIRTY]: true,
    }))

    const { result } = renderHook(() => useFieldIsDirty('spaceName', 'nameField'))
    expect(result.current).toBe(true)

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField', () => ({
        [FIELD_KEY_DIRTY]: false,
      }))
    )

    expect(result.current).toBe(false)
  })
})

describe('useFieldIsTouched', () => {
  it('should return the default value if field is not initialized', () => {
    const { result } = renderHook(() => useFieldIsTouched('spaceName', 'nameField'))
    expect(result.current).toBe(FIELD_DEFAULT_TOUCHED)
  })

  it('should return the current state on initial render', () => {
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_TOUCHED]: true,
    }))

    const { result } = renderHook(() => useFieldIsTouched('spaceName', 'nameField'))
    expect(result.current).toBe(true)
  })

  it('should return the state and renders the component when the store updates', async () => {
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_TOUCHED]: true,
    }))

    const { result } = renderHook(() => useFieldIsTouched('spaceName', 'nameField'))
    expect(result.current).toBe(true)

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField', () => ({
        [FIELD_KEY_TOUCHED]: false,
      }))
    )

    expect(result.current).toBe(false)
  })
})

describe('useFieldIsValid', () => {
  it('should return the default value if field is not initialized', () => {
    const { result } = renderHook(() => useFieldIsValid('spaceName', 'nameField'))
    expect(result.current).toBe(FIELD_DEFAULT_VALID)
  })

  it('should return the current state on initial render', () => {
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_VALID]: true,
    }))

    const { result } = renderHook(() => useFieldIsValid('spaceName', 'nameField'))
    expect(result.current).toBe(true)
  })

  it('should return the state and renders the component when the store updates', async () => {
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_VALID]: true,
    }))

    const { result } = renderHook(() => useFieldIsValid('spaceName', 'nameField'))
    expect(result.current).toBe(true)

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField', () => ({
        [FIELD_KEY_VALID]: false,
      }))
    )

    expect(result.current).toBe(false)
  })
})

describe('useFieldValue', () => {
  it('should return the default value if field is not initialized', () => {
    const { result } = renderHook(() => useFieldValue('spaceName', 'nameField'))
    expect(result.current).toBe(FIELD_DEFAULT_VALUE)
  })

  it('should return the current state on initial render', () => {
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_VALUE]: 'barfoo',
    }))

    const { result } = renderHook(() => useFieldValue('spaceName', 'nameField'))
    expect(result.current).toBe('barfoo')
  })

  it('should return the state and renders the component when the store updates', async () => {
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_VALUE]: 'foobar',
    }))

    const { result } = renderHook(() => useFieldValue('spaceName', 'nameField'))
    expect(result.current).toBe('foobar')

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField', () => ({
        [FIELD_KEY_VALUE]: 'fboaor',
      }))
    )

    expect(result.current).toBe('fboaor')
  })
})

describe('useFieldValueOnFocus', () => {
  it('should return the default value if field is not initialized', () => {
    const { result } = renderHook(() => useFieldValueOnFocus('spaceName', 'nameField'))
    expect(result.current).toBe(FIELD_DEFAULT_VALUE_ON_FOCUS)
  })

  it('should return the current state on initial render', () => {
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_VALUE_ON_FOCUS]: 'barfoo',
    }))

    const { result } = renderHook(() => useFieldValueOnFocus('spaceName', 'nameField'))
    expect(result.current).toBe('barfoo')
  })

  it('should return the state and renders the component when the store updates', async () => {
    updateFieldStateWithCallback('spaceName', 'nameField', () => ({
      [FIELD_KEY_VALUE_ON_FOCUS]: 'foobar',
    }))

    const { result } = renderHook(() => useFieldValueOnFocus('spaceName', 'nameField'))
    expect(result.current).toBe('foobar')

    act(() =>
      updateFieldStateWithCallback('spaceName', 'nameField', () => ({
        [FIELD_KEY_VALUE_ON_FOCUS]: 'fboaor',
      }))
    )

    expect(result.current).toBe('fboaor')
  })
})
