import { act, renderHook } from '@testing-library/react-hooks'
import { getFieldValue, getNamespaceState, hasFieldFocus, removeField, useConnectField } from '../src'

const TEST_FIELD_NAME = 'nameField'
const TEST_FIELD_NAME_NEW = 'nameFieldNew'
const TEST_NAMESPACE = 'spaceName'

describe('useConnectField', () => {
  beforeEach(() => {
    // reset modules to be sure that we have a clean state for every test
    removeField(TEST_NAMESPACE, TEST_FIELD_NAME)
    removeField(TEST_NAMESPACE, TEST_FIELD_NAME_NEW)
  })

  it('should throw error when namespace changes', () => {
    const { result, rerender } = renderHook(({ props }) => useConnectField(props), {
      initialProps: { props: { namespace: TEST_NAMESPACE, fieldName: TEST_FIELD_NAME } },
    })

    rerender({ props: { namespace: TEST_FIELD_NAME_NEW, fieldName: TEST_FIELD_NAME } })
    expect(result.error.message).toBe(
      'Changing the namespace and/or fieldName of an already rendered component is not supported.'
    )
  })

  it('should throw error when fieldName changes', () => {
    const { result, rerender } = renderHook(({ props }) => useConnectField(props), {
      initialProps: { props: { namespace: TEST_NAMESPACE, fieldName: TEST_FIELD_NAME } },
    })

    rerender({ props: { namespace: TEST_NAMESPACE, fieldName: TEST_FIELD_NAME_NEW } })
    expect(result.error.message).toBe(
      'Changing the namespace and/or fieldName of an already rendered component is not supported.'
    )
  })

  it('should throw error when namespace not valid', () => {
    const { result } = renderHook(({ props }) => useConnectField(props), {
      initialProps: { props: { fieldName: TEST_FIELD_NAME } },
    })

    expect(result.error.message).toBe('Expected string with a minimal length of 1 for `namespace`')
  })

  it('should throw error when fieldName not valid', () => {
    const { result } = renderHook(({ props }) => useConnectField(props), {
      initialProps: { props: { namespace: TEST_NAMESPACE } },
    })

    expect(result.error.message).toBe('Expected string with a minimal length of 1 for `fieldName`')
  })

  it('should use the defaultValue', () => {
    const { result } = renderHook(({ props }) => useConnectField(props), {
      initialProps: { props: { namespace: TEST_NAMESPACE, fieldName: TEST_FIELD_NAME, defaultValue: 'foobar' } },
    })

    expect(result.current.value).toBe('foobar')
  })

  it('should be able to update the defaultValue when field is not touched or has focus', () => {
    const { result, rerender } = renderHook(({ props }) => useConnectField(props), {
      initialProps: { props: { namespace: TEST_NAMESPACE, fieldName: TEST_FIELD_NAME, defaultValue: 'foobar' } },
    })

    expect(result.current.value).toBe('foobar')

    rerender({ props: { namespace: TEST_NAMESPACE, fieldName: TEST_FIELD_NAME, defaultValue: 'barfoo' } })

    expect(result.current.value).toBe('barfoo')
  })

  it('should be able to update the error when field has default value and message has changed by validator', () => {
    const { result, rerender } = renderHook(({ props }) => useConnectField(props), {
      initialProps: {
        props: {
          namespace: TEST_NAMESPACE,
          fieldName: TEST_FIELD_NAME,
          defaultValue: 'foobar',
          validator: () => 'first error',
        },
      },
    })

    expect(result.current.error).toBe('first error')

    rerender({
      props: {
        namespace: TEST_NAMESPACE,
        fieldName: TEST_FIELD_NAME,
        defaultValue: 'foobar',
        validator: () => 'second error',
      },
    })

    expect(result.current.error).toBe('second error')
  })

  it('should not update the defaultValue when field has focus', () => {
    const { result, rerender } = renderHook(({ props }) => useConnectField(props), {
      initialProps: { props: { namespace: TEST_NAMESPACE, fieldName: TEST_FIELD_NAME, defaultValue: 'foobar' } },
    })

    expect(result.current.value).toBe('foobar')
    act(() => result.current.onFocus({ target: {} }))
    expect(result.current.focus).toBe(true)

    rerender({ props: { namespace: TEST_NAMESPACE, fieldName: TEST_FIELD_NAME, defaultValue: 'barfoo' } })
    expect(result.current.focus).toBe(true)

    expect(result.current.value).toBe('foobar')
  })

  it('should not update the defaultValue when field is touched', () => {
    const { result, rerender } = renderHook(({ props }) => useConnectField(props), {
      initialProps: { props: { namespace: TEST_NAMESPACE, fieldName: TEST_FIELD_NAME, defaultValue: 'foobar' } },
    })

    expect(result.current.value).toBe('foobar')
    act(() => result.current.onFocus({}))
    expect(result.current.focus).toBe(true)
    act(() => result.current.onBlur({}))
    expect(result.current.focus).toBe(false)

    rerender({ props: { namespace: TEST_NAMESPACE, fieldName: TEST_FIELD_NAME, defaultValue: 'barfoo' } })
    expect(result.current.focus).toBe(false)

    expect(result.current.value).toBe('foobar')
  })

  it('should validate the defaultValue', () => {
    const validator = (value) => (value === 'barfoo' ? 'valid' : 'not-valid')

    const { result, rerender } = renderHook(({ props }) => useConnectField(props), {
      initialProps: {
        props: { namespace: TEST_NAMESPACE, fieldName: TEST_FIELD_NAME, defaultValue: 'foobar', validator },
      },
    })

    expect(result.current.value).toBe('foobar')
    expect(result.current.error).toBe('not-valid')

    rerender({ props: { namespace: TEST_NAMESPACE, fieldName: TEST_FIELD_NAME, defaultValue: 'barfoo', validator } })

    expect(result.current.value).toBe('barfoo')
    expect(result.current.error).toBe('valid')
  })

  it('should use the default the transform value to input', () => {
    const value = Symbol('should-not-change')
    const { result } = renderHook(({ props }) => useConnectField(props), {
      initialProps: {
        props: { namespace: TEST_NAMESPACE, fieldName: TEST_FIELD_NAME, defaultValue: value },
      },
    })

    expect(result.current.value).toBe(value)
  })

  it('should transform value to input', () => {
    // transform array to first string value
    const transformValueToInput = (value) => value[0]

    const { result } = renderHook(({ props }) => useConnectField(props), {
      initialProps: {
        props: {
          namespace: TEST_NAMESPACE,
          fieldName: TEST_FIELD_NAME,
          defaultValue: ['foobar'],
          transformValueToInput,
        },
      },
    })

    expect(result.current.value).toBe('foobar')
  })

  it('should update the field state when focused', () => {
    const { result } = renderHook(({ props }) => useConnectField(props), {
      initialProps: {
        props: { namespace: TEST_NAMESPACE, fieldName: TEST_FIELD_NAME },
      },
    })

    expect(hasFieldFocus(TEST_NAMESPACE, TEST_FIELD_NAME)).toBe(false)

    act(() => result.current.onFocus({}))

    expect(hasFieldFocus(TEST_NAMESPACE, TEST_FIELD_NAME)).toBe(true)
  })

  it('should call the onFocus prop when focused', () => {
    const onFocusProp = jest.fn()
    const mockEvent = {}

    const { result } = renderHook(({ props }) => useConnectField(props), {
      initialProps: {
        props: { namespace: TEST_NAMESPACE, fieldName: TEST_FIELD_NAME, onFocus: onFocusProp },
      },
    })
    act(() => result.current.onFocus(mockEvent))

    expect(onFocusProp).toHaveBeenCalledTimes(1)
    expect(onFocusProp).toHaveBeenCalledWith(mockEvent)
  })

  it('should use the default the transform event to value', () => {
    const { result } = renderHook(({ props }) => useConnectField(props), {
      initialProps: {
        props: { namespace: TEST_NAMESPACE, fieldName: TEST_FIELD_NAME },
      },
    })
    act(() => result.current.onChange({ target: { value: 'foobar' } }))

    expect(getFieldValue(TEST_NAMESPACE, TEST_FIELD_NAME)).toEqual('foobar')
  })

  it('should transform event to value', () => {
    // transform value to array
    const transformEventToValue = (event) => [event.target.value]

    const { result } = renderHook(({ props }) => useConnectField(props), {
      initialProps: {
        props: { namespace: TEST_NAMESPACE, fieldName: TEST_FIELD_NAME, transformEventToValue },
      },
    })
    act(() => result.current.onChange({ target: { value: 'foobar' } }))

    expect(getFieldValue(TEST_NAMESPACE, TEST_FIELD_NAME)).toEqual(['foobar'])
  })

  it('should validate transformed value on change', () => {
    // transform value to array
    const transformEventToValue = (event) => [event.target.value]
    const validator = (value) => (value[0] === 'barfoo' ? 'valid' : 'not-valid')

    const { result } = renderHook(({ props }) => useConnectField(props), {
      initialProps: {
        props: { namespace: TEST_NAMESPACE, fieldName: TEST_FIELD_NAME, transformEventToValue, validator },
      },
    })
    act(() => result.current.onChange({ target: { value: 'foobar' } }))

    expect(result.current.value).toEqual(['foobar'])
    expect(result.current.error).toBe('not-valid')

    act(() => result.current.onChange({ target: { value: 'barfoo' } }))

    expect(result.current.value).toEqual(['barfoo'])
    expect(result.current.error).toBe('valid')
  })

  it('should call the onChange prop after change', () => {
    const onChangeProp = jest.fn()
    const mockEvent = {}

    const { result } = renderHook(({ props }) => useConnectField(props), {
      initialProps: {
        props: { namespace: TEST_NAMESPACE, fieldName: TEST_FIELD_NAME, onChange: onChangeProp },
      },
    })
    act(() => result.current.onChange(mockEvent))

    expect(onChangeProp).toHaveBeenCalledTimes(1)
    expect(onChangeProp).toHaveBeenCalledWith(mockEvent)
  })

  it('should update the field state after blur', () => {
    const { result } = renderHook(({ props }) => useConnectField(props), {
      initialProps: {
        props: { namespace: TEST_NAMESPACE, fieldName: TEST_FIELD_NAME },
      },
    })

    act(() => result.current.onFocus({}))

    expect(hasFieldFocus(TEST_NAMESPACE, TEST_FIELD_NAME)).toBe(true)

    act(() => result.current.onBlur({}))

    expect(hasFieldFocus(TEST_NAMESPACE, TEST_FIELD_NAME)).toBe(false)
  })

  it('should call the onBlur prop after blur', () => {
    const onBlurProp = jest.fn()
    const mockEvent = {}

    const { result } = renderHook(({ props }) => useConnectField(props), {
      initialProps: {
        props: { namespace: TEST_NAMESPACE, fieldName: TEST_FIELD_NAME, onBlur: onBlurProp },
      },
    })
    act(() => result.current.onBlur(mockEvent))

    expect(onBlurProp).toHaveBeenCalledTimes(1)
    expect(onBlurProp).toHaveBeenCalledWith(mockEvent)
  })

  it('should remove field from state on unmount', () => {
    const { unmount } = renderHook(() => useConnectField({ namespace: TEST_NAMESPACE, fieldName: TEST_FIELD_NAME }))

    expect(getNamespaceState(TEST_NAMESPACE)).toHaveProperty(TEST_FIELD_NAME)
    expect(Object.keys(getNamespaceState(TEST_NAMESPACE))).toHaveLength(1)

    unmount()

    expect(getNamespaceState(TEST_NAMESPACE)).not.toHaveProperty(TEST_FIELD_NAME)
    expect(Object.keys(getNamespaceState(TEST_NAMESPACE))).toHaveLength(0)
  })
})
