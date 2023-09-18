import {
  FIELD_DEFAULT_DEFAULT_VALUE,
  FIELD_DEFAULT_ERROR,
  FIELD_DEFAULT_VALUE,
  FIELD_DEFAULT_VALUE_ON_FOCUS,
  FIELD_KEY_DEFAULT_VALUE,
  FIELD_KEY_DIRTY,
  FIELD_KEY_ERROR,
  FIELD_KEY_FOCUS,
  FIELD_KEY_TOUCHED,
  FIELD_KEY_VALID,
  FIELD_KEY_VALUE,
  FIELD_KEY_VALUE_ON_FOCUS,
  FIELD_STATE_DEFAULT,
  getNamespaceDefaultValues,
  getNamespaceErrors,
  getNamespaceKeyIsEvery,
  getNamespaceKeyIsSome,
  getNamespaceKeyValues,
  getNamespaceState,
  getNamespaceValues,
  getNamespaceValuesOnFocus,
  hasNamespaceFocus,
  isNamespaceDirty,
  isNamespaceTouched,
  isNamespaceValid,
} from '../../src'
import { SUPPORTED_VALUES } from '../constants'
import mocked = jest.mocked

jest.mock('../../src/state')

describe('creatorGetNamespace', () => {
  it('should always return the correct value, if defined', () => {
    SUPPORTED_VALUES.forEach((value) => {
      mocked(getNamespaceState).mockReturnValueOnce({
        field1: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_VALUE]: value },
        field2: FIELD_STATE_DEFAULT,
      })
      const values = getNamespaceKeyValues('spaceName', FIELD_KEY_VALUE)
      expect(values?.field1).toBe(value)
      expect(values?.field2).toBe(FIELD_DEFAULT_VALUE)
    })
  })
})

describe('getNamespaceKeyIsSome', () => {
  it('should return true when one or more field key values are true', () => {
    SUPPORTED_VALUES.forEach((value) => {
      mocked(getNamespaceState).mockReturnValueOnce({
        field1: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_VALUE]: value },
        field2: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_VALUE]: !value },
      })
      const namespaceIsSome = getNamespaceKeyIsSome('spaceName', FIELD_KEY_VALUE)
      expect(namespaceIsSome).toBe(true)
    })
  })
})

describe('creatorIsEveryNamespace', () => {
  it('should return true when every field key values are true', () => {
    SUPPORTED_VALUES.forEach((value) => {
      mocked(getNamespaceState).mockReturnValueOnce({
        field1: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_VALUE]: value },
        field2: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_VALUE]: value },
      })
      const namespaceIsEvery = getNamespaceKeyIsEvery('spaceName', FIELD_KEY_VALUE)
      expect(namespaceIsEvery).toBe(Boolean(value))
    })
  })

  it('should return false when not every field key values are true', () => {
    SUPPORTED_VALUES.forEach((value) => {
      mocked(getNamespaceState).mockReturnValueOnce({
        field1: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_VALUE]: value },
        field2: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_VALUE]: !value },
      })
      const namespaceIsEvery = getNamespaceKeyIsEvery('spaceName', FIELD_KEY_VALUE)
      expect(namespaceIsEvery).toBe(false)
    })
  })
})

describe('getNamespaceDefaultValues', () => {
  it('should return the correct value per field', () => {
    mocked(getNamespaceState).mockReturnValueOnce({
      field1: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_DEFAULT_VALUE]: 'correct-value' },
      field2: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_VALUE]: 'other-value' },
    })
    const values = getNamespaceDefaultValues('spaceName')
    expect(values?.field1).toBe('correct-value')
    expect(values?.field2).toBe(FIELD_DEFAULT_DEFAULT_VALUE)
  })
})

describe('getNamespaceErrors', () => {
  it('should return the correct value per field', () => {
    mocked(getNamespaceState).mockReturnValueOnce({
      field1: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_ERROR]: 'correct-value' },
      field2: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_VALUE]: 'other-value' },
    })
    const values = getNamespaceErrors('spaceName')
    expect(values?.field1).toBe('correct-value')
    expect(values?.field2).toBe(FIELD_DEFAULT_ERROR)
  })
})

describe('getNamespaceValues', () => {
  it('should return the correct value per field', () => {
    mocked(getNamespaceState).mockReturnValueOnce({
      field1: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_VALUE]: 'correct-value' },
      field2: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_ERROR]: 'other-value' },
    })
    const values = getNamespaceValues('spaceName')
    expect(values?.field1).toBe('correct-value')
    expect(values?.field2).toBe(FIELD_DEFAULT_VALUE)
  })
})

describe('getNamespaceValuesOnFocus', () => {
  it('should return the correct value per field', () => {
    mocked(getNamespaceState).mockReturnValueOnce({
      field1: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_VALUE_ON_FOCUS]: 'correct-value' },
      field2: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_VALUE]: 'other-value' },
    })
    const values = getNamespaceValuesOnFocus('spaceName')
    expect(values?.field1).toBe('correct-value')
    expect(values?.field2).toBe(FIELD_DEFAULT_VALUE_ON_FOCUS)
  })
})

describe('hasNamespaceFocus', () => {
  it('should return the true when one field has focus', () => {
    mocked(getNamespaceState).mockReturnValueOnce({
      field1: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_FOCUS]: true },
      field2: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_VALUE]: 'other-value' },
    })
    expect(hasNamespaceFocus('spaceName')).toBe(true)
  })
  it('should return the false when no field has focus', () => {
    mocked(getNamespaceState).mockReturnValueOnce({
      field1: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_FOCUS]: false },
      field2: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_VALUE]: 'other-value' },
    })
    expect(hasNamespaceFocus('spaceName')).toBe(false)
  })
})

describe('isNamespaceDirty', () => {
  it('should return the true when one field is dirty', () => {
    mocked(getNamespaceState).mockReturnValueOnce({
      field1: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_DIRTY]: true },
      field2: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_VALUE]: 'other-value' },
    })
    expect(isNamespaceDirty('spaceName')).toBe(true)
  })
  it('should return the false when no field is dirty', () => {
    mocked(getNamespaceState).mockReturnValueOnce({
      field1: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_DIRTY]: false },
      field2: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_VALUE]: 'other-value' },
    })
    expect(isNamespaceDirty('spaceName')).toBe(false)
  })
})

describe('isNamespaceTouched', () => {
  it('should return the true when one field is touched', () => {
    mocked(getNamespaceState).mockReturnValueOnce({
      field1: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_TOUCHED]: true },
      field2: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_VALUE]: 'other-value' },
    })
    expect(isNamespaceTouched('spaceName')).toBe(true)
  })
  it('should return the false when no field is touched', () => {
    mocked(getNamespaceState).mockReturnValueOnce({
      field1: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_TOUCHED]: false },
      field2: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_VALUE]: 'other-value' },
    })
    expect(isNamespaceTouched('spaceName')).toBe(false)
  })
})

describe('isNamespaceValid', () => {
  it('should return the true when all fields are valid', () => {
    mocked(getNamespaceState).mockReturnValueOnce({
      field1: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_VALID]: true },
      field2: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_VALID]: true },
    })
    expect(isNamespaceValid('spaceName')).toBe(true)
  })
  it('should return the false when not all fields are valid', () => {
    mocked(getNamespaceState).mockReturnValueOnce({
      field1: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_VALID]: false },
      field2: { ...FIELD_STATE_DEFAULT, [FIELD_KEY_VALID]: true },
    })
    expect(isNamespaceValid('spaceName')).toBe(false)
  })
})
