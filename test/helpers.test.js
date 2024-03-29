import { SUPPORTED_VALUES, TEST_MAP_VALUE } from './constants'
import {
  checkedEventToValue,
  defaultDirtyCheck,
  defaultEventToValue,
  defaultValueToInput,
  FIELD_KEY_ERROR,
  FIELD_KEY_VALID,
  FIELD_KEY_VALUE,
  mapFieldValueAndError,
  validateFieldName,
  validateNamespace,
} from '../src'

describe('defaultValueToInput', () => {
  it('should always return the same value when converting state value to input value', () => {
    SUPPORTED_VALUES.forEach((value) => {
      expect(defaultValueToInput(value)).toBe(value)
    })
  })
})

describe('defaultEventToValue', () => {
  it('should return the target value of a event', () => {
    const event = {
      target: {
        value: 'foobar',
      },
    }
    expect(defaultEventToValue(event)).toBe('foobar')
  })

  it('should return undefined if the target value is not set on a event', () => {
    const event = {
      target: {},
    }
    expect(defaultEventToValue(event)).toBe(undefined)
  })

  it('should return undefined if the target is not set on a event', () => {
    const event = {}
    expect(defaultEventToValue(event)).toBe(undefined)
  })

  it('should return the checked value of a event', () => {
    const event = {
      target: {
        checked: true,
      },
    }
    expect(checkedEventToValue(event)).toBe(true)
    event.target.checked = false
    expect(checkedEventToValue(event)).toBe(false)
  })

  it('should return undefined if the target checked value is not set on a event', () => {
    const event = {
      target: {},
    }
    expect(checkedEventToValue(event)).toBe(undefined)
  })

  it('should return undefined if the target is not set on a event (checked)', () => {
    const event = {}
    expect(checkedEventToValue(event)).toBe(undefined)
  })
})

describe('defaultDirtyCheck', () => {
  it('should check if a string value is `dirty`', () => {
    const newValue = 'foobar'
    let valueOnFocus = newValue
    expect(defaultDirtyCheck(newValue, valueOnFocus)).toBe(false)
    valueOnFocus = 'barfoo'
    expect(defaultDirtyCheck(newValue, valueOnFocus)).toBe(true)
  })

  it('should check if a number value is `dirty`', () => {
    const newValue = 123
    let valueOnFocus = newValue
    expect(defaultDirtyCheck(newValue, valueOnFocus)).toBe(false)
    valueOnFocus = 321
    expect(defaultDirtyCheck(newValue, valueOnFocus)).toBe(true)
  })

  it('should check if a boolean value is `dirty`', () => {
    const newValue = true
    let valueOnFocus = newValue
    expect(defaultDirtyCheck(newValue, valueOnFocus)).toBe(false)
    valueOnFocus = false
    expect(defaultDirtyCheck(newValue, valueOnFocus)).toBe(true)
  })

  it('should check if a array value is `dirty`', () => {
    const newValue = ['foo', 'bar']
    let valueOnFocus = newValue
    expect(defaultDirtyCheck(newValue, valueOnFocus)).toBe(false)
    valueOnFocus = ['bar', 'foo']
    expect(defaultDirtyCheck(newValue, valueOnFocus)).toBe(true)
  })

  it('should check if a object value is `dirty`', () => {
    const newValue = { foo: 'bar' }
    let valueOnFocus = newValue
    expect(defaultDirtyCheck(newValue, valueOnFocus)).toBe(false)
    valueOnFocus = { bar: 'foo' }
    expect(defaultDirtyCheck(newValue, valueOnFocus)).toBe(true)
  })
})

describe('validateFieldName', () => {
  it('should validate field name', () => {
    ;[
      undefined,
      null,
      NaN,
      true,
      false,
      Symbol('foobar'),
      456n,
      123.45,
      123,
      -123.45,
      -123,
      { foo: 'bar' },
      ['foo', 'bar'],
      TEST_MAP_VALUE,
    ].forEach((value) => {
      expect(validateFieldName(value)).toBe(false)
    })
    expect(validateFieldName('a')).toBe(true)
    expect(validateFieldName('longName')).toBe(true)
  })
})

describe('validateNamespace', () => {
  it('should validate namespace', () => {
    ;[
      undefined,
      null,
      NaN,
      true,
      false,
      Symbol('foobar'),
      456n,
      123.45,
      123,
      -123.45,
      -123,
      { foo: 'bar' },
      ['foo', 'bar'],
      TEST_MAP_VALUE,
    ].forEach((value) => {
      expect(validateNamespace(value)).toBe(false)
    })
    expect(validateNamespace('a')).toBe(true)
    expect(validateNamespace('longName')).toBe(true)
  })
})

describe('mapFieldValueAndError', () => {
  it('should map value and error', () => {
    expect(mapFieldValueAndError('foobar', 'error-string')).toEqual({
      [FIELD_KEY_ERROR]: 'error-string',
      [FIELD_KEY_VALID]: false,
      [FIELD_KEY_VALUE]: 'foobar',
    })
  })

  it('should null value for error when not defined', () => {
    expect(mapFieldValueAndError('foobar')).toEqual({
      [FIELD_KEY_ERROR]: null,
      [FIELD_KEY_VALID]: true,
      [FIELD_KEY_VALUE]: 'foobar',
    })
  })

  it('should map any truthy value for error', () => {
    ;[
      true,
      Symbol('foobar'),
      456n,
      123.45,
      123,
      -123.45,
      -123,
      'foobar',
      { foo: 'bar' },
      ['foo', 'bar'],
      TEST_MAP_VALUE,
    ].forEach((error) =>
      expect(mapFieldValueAndError('foobar', error)).toEqual({
        [FIELD_KEY_ERROR]: error,
        [FIELD_KEY_VALID]: false,
        [FIELD_KEY_VALUE]: 'foobar',
      })
    )
  })

  it('should map any falsy value for error', () => {
    ;[undefined, false, 0, -0, 0n, NaN, '', null].forEach((error) =>
      expect(mapFieldValueAndError('foobar', error)).toEqual({
        [FIELD_KEY_ERROR]: null,
        [FIELD_KEY_VALID]: true,
        [FIELD_KEY_VALUE]: 'foobar',
      })
    )
  })

  it('should map supported values', () => {
    SUPPORTED_VALUES.forEach((value) =>
      expect(mapFieldValueAndError(value, null)).toEqual({
        [FIELD_KEY_ERROR]: null,
        [FIELD_KEY_VALID]: true,
        [FIELD_KEY_VALUE]: value,
      })
    )
  })
})
