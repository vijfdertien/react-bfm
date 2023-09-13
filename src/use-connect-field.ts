import { ChangeEventHandler, FocusEventHandler, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { DirtyCheckFunction, EventToValueFunction, TransformValueToInputFunction, ValidatorFunction } from './types'
import { BFMHooksContext } from './context'
import { defaultEventToValue, defaultValueToInput } from './helpers'

interface ConnectFieldEventHandlerProps {
  onFocus: FocusEventHandler<HTMLInputElement>
  onChange: ChangeEventHandler<HTMLInputElement>
  onBlur: FocusEventHandler<HTMLInputElement>
}
export interface ConnectFieldReturnProps extends ConnectFieldEventHandlerProps {
  readonly value: any
}

export interface ConnectFieldProps extends Partial<ConnectFieldEventHandlerProps> {
  namespace: string
  fieldName: string
  defaultValue?: unknown
  validator?: ValidatorFunction
  dirtyCheck?: DirtyCheckFunction
  transformValueToInput?: TransformValueToInputFunction
  transformEventToValue?: EventToValueFunction
}

export type FactoryWithoutConnectFieldProps<P> = Omit<P, keyof ConnectFieldProps>

export const useConnectField = <P>(
  props: ConnectFieldProps,
): FactoryWithoutConnectFieldProps<P> & ConnectFieldReturnProps => {
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
  const propsRef = useRef<object>({})

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

  const getError = useCallback((_value: any) => validator && validator(_value, propsRef.current), [validator])

  // init field and state on first rendering
  const [{ value }, setFieldState] = useState(() =>
    initField(namespace, fieldName, defaultValue, getError(defaultValue)),
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

  const handleFocus = useCallback<FocusEventHandler<HTMLInputElement>>(
    (event) => {
      focusField(namespace, fieldName)
      onFocus && onFocus(event)
    },
    [fieldName, namespace, onFocus, focusField],
  )

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const value = transformEventToValue(event)
      const error = getError(value)
      changeField(namespace, fieldName, value, error, dirtyCheck)
      onChange && onChange(event)
    },
    [transformEventToValue, getError, changeField, namespace, fieldName, dirtyCheck, onChange],
  )

  const handleBlur = useCallback<FocusEventHandler<HTMLInputElement>>(
    (event) => {
      blurField(namespace, fieldName)
      onBlur && onBlur(event)
    },
    [fieldName, namespace, onBlur, blurField],
  )

  return {
    ...otherProps,
    value: transformValueToInput(value),
    onFocus: handleFocus,
    onChange: handleChange,
    onBlur: handleBlur,
  } as FactoryWithoutConnectFieldProps<P> & ConnectFieldReturnProps
}
