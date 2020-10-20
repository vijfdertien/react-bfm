import { checkedEventToValue, defaultDirtyCheck, defaultEventToValue, defaultValueToInput } from '../src'
import { SUPPORTED_VALUES } from './constants'

it('should always return the same value when converting state value to input value', () => {
  SUPPORTED_VALUES.forEach((value) => {
    expect(defaultValueToInput(value)).toBe(value)
  })
})

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
