import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { BFMHooksContext } from './context'
import { defaultEventToValue, defaultValueToInput } from './helpers'

/**
 * Helper function to omit keys from a object.
 *
 * @param {object} original
 * @param {string[]} keysToOmit
 * @return {object}
 */
const omitKeys = (original, keysToOmit) =>
  (keysToOmit || []).reduce((result, key) => {
    if (key in result) {
      delete result[key]
    }

    return result
  }, original)

/**
 * @callback validatorCallback
 *
 * Function used to validate the input value.
 * Should return a falsy value if the input value is valid.
 * If the input value is not valid. any truthy value can be returned, for example a string of array with error message(s).
 *
 * @param {string|number|Array|Object|boolean} value - Input value, transformed from event or the defaultValue (if set)
 * @param {object} props - All props set on the input, except the callback functions: validator, dirtyCheck,
 *                         transformValueToInput, transformEventToValue, onChange, onFocus, onBlur.
 * @return {*}
 */

/**
 * @callback dirtyCheckCallback
 *
 * Function to check if the field is value has been modified (dirty).
 *
 * @param {string|number|Array|Object|boolean} newValue - The new input value, transformed from event
 * @param {string|number|Array|Object|boolean} valueOnFocus - The state value when the input got focus
 */

/**
 * @param {object} props
 * @param {string} props.namespace - The form namespace
 * @param {string} props.fieldName - The unique input field name within the namespace
 * @param {string} [props.defaultValue] - The default starting value of the field.
 * @param {validatorCallback} [props.validator]
 * @param {dirtyCheckCallback} [props.dirtyCheck]
 * @param {function(value)} [props.transformValueToInput] - Transform state value to input value.
 *                                                          When not given: the value will not be transformed.
 * @param {function(...args)} [props.transformEventToValue] - Transform onChange event to state value.
 *                                                          When not given: the event.target.value will be used.
 * @param {function(event)} [props.onFocus] - Called on an onFocus event. It can't be used to override the input prop.
 * @param {function(...args)} [props.onChange] - Called on an onChange event. It can't be used to override the input prop.
 * @param {function(event)} [props.onBlur] - Called on an onBlur event. It can't be used to override the input prop.
 * @param {string[]} [omitProps] - Prop keys that should not be returned.
 * @return {object} - Props for the input field.
 *                    Excluded are props only used for the hook: namespace, fieldName, defaultValue, validator, dirtyCheck, transformValueToInput and transformEventToValue
 *                    Excluded are keys given by the omitProps.
 *                    Included are onFocus, onChange and onBlur to handle the input field state.
 */
export const useConnectField = (props, omitProps) => {
  const { blurField, changeField, defaultValueField, focusField, initField, removeField, subscribeToField } =
    useContext(BFMHooksContext)
  const {
    validator,
    dirtyCheck,
    transformValueToInput = defaultValueToInput,
    transformEventToValue = defaultEventToValue,
    onChange,
    onFocus,
    onBlur,
    ...staticProps
  } = props

  // For storing static props see bellow.
  const propsRef = useRef(null)

  // Hook specific props.
  const { namespace, fieldName, defaultValue = '', ...otherProps } = staticProps

  // Throw an error if namespace and/or fieldName changes after first rendering, because it's not supported
  // Dynamically changing these values can result in strange side effects. It's better to render a new component.
  const namesRef = useRef({ namespace, fieldName })
  useEffect(() => {
    if (namesRef.current.namespace !== namespace || namesRef.current.fieldName !== fieldName) {
      throw new Error('Changing the namespace and/or fieldName of an already rendered component is not supported.')
    }
  }, [namespace, fieldName])

  // Store static props for use in the validator callback.
  // This way you can (re-)use for example: required, minlength, maxlength, etc. in the validator
  propsRef.current = staticProps

  const getError = useCallback((_value) => validator && validator(_value, propsRef.current), [validator])

  // init field and state on first rendering
  const [{ value, ...fieldProps }, setFieldState] = useState(() =>
    initField(namespace, fieldName, defaultValue, getError(defaultValue))
  )

  useEffect(() => {
    const unsubscribe = subscribeToField(namespace, fieldName, setFieldState)

    // unsubscribe and remove field on unmount
    return () => {
      unsubscribe()
      removeField(namespace, fieldName)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // update defaultValue on change, see `defaultValueField` function for more info
  useEffect(() => {
    defaultValueField(namespace, fieldName, defaultValue, getError(defaultValue))
  }, [defaultValue, defaultValueField, fieldName, getError, namespace])

  const _props = omitKeys(
    {
      ...otherProps,
      ...fieldProps,
    },
    omitProps
  )
  _props.value = transformValueToInput(value)
  _props.onFocus = useCallback(
    (event) => {
      focusField(namespace, fieldName)
      onFocus && onFocus(event)
    },
    [fieldName, namespace, onFocus, focusField]
  )

  _props.onChange = useCallback(
    (...args) => {
      const value = transformEventToValue(...args)
      const error = getError(value)
      changeField(namespace, fieldName, value, error, dirtyCheck)
      onChange && onChange(...args)
    },
    [transformEventToValue, getError, changeField, namespace, fieldName, dirtyCheck, onChange]
  )

  _props.onBlur = useCallback(
    (event) => {
      blurField(namespace, fieldName)
      onBlur && onBlur(event)
    },
    [fieldName, namespace, onBlur, blurField]
  )

  return _props
}
