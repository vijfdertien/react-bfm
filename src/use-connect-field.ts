import { FocusEventHandler, HTMLAttributes, useCallback, useContext, useEffect, useRef } from 'react'
import {
  ConnectFieldChangeHandler,
  DirtyCheckFunction,
  TransformEventToValueFunction,
  TransformValueToInputFunction,
  ValidatorFunction,
} from './common'
import { BFMHooksContext } from './context'
import { defaultEventToValue, defaultValueToInput } from './helpers'
import { useFieldValue } from './field/hooks'

interface ConnectFieldEventHandlerProps<T = unknown> {
  onFocus: FocusEventHandler<T>
  onChange: ConnectFieldChangeHandler
  onBlur: FocusEventHandler<T>
}
export interface ConnectFieldReturnProps<T = HTMLInputElement> extends ConnectFieldEventHandlerProps<T> {
  readonly value: any
}

export interface ConnectFieldProps<T = HTMLInputElement>
  extends Partial<ConnectFieldEventHandlerProps<T>>,
    Pick<HTMLAttributes<T>, 'defaultValue'> {
  namespace: string
  fieldName: string
  validator?: ValidatorFunction
  dirtyCheck?: DirtyCheckFunction
  transformValueToInput?: TransformValueToInputFunction
  transformEventToValue?: TransformEventToValueFunction
}

export type FactoryWithoutConnectFieldProps<P> = Omit<P, keyof ConnectFieldProps>

export const useConnectField = <P = unknown, T = HTMLInputElement>(
  props: ConnectFieldProps<T>,
): FactoryWithoutConnectFieldProps<P> & ConnectFieldReturnProps<T> => {
  const { blurField, changeField, defaultValueField, focusField, initField, removeField } = useContext(BFMHooksContext)
  const {
    validator,
    dirtyCheck,
    transformValueToInput = defaultValueToInput,
    transformEventToValue,
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

  const value = useFieldValue(namespace, fieldName)

  useEffect(() => {
    // init field on mount
    initField(namespace, fieldName, defaultValue, getError(defaultValue))

    // remove field on unmount
    return () => {
      removeField(namespace, fieldName)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // update defaultValue on change, see `defaultValueField` function for more info
  useEffect(() => {
    defaultValueField(namespace, fieldName, defaultValue, getError(defaultValue))
  }, [defaultValue, defaultValueField, fieldName, getError, namespace])

  const handleFocus = useCallback<FocusEventHandler<T>>(
    (event) => {
      focusField(namespace, fieldName)
      onFocus && onFocus(event)
    },
    [fieldName, namespace, onFocus, focusField],
  )

  const handleChange = useCallback<ConnectFieldChangeHandler>(
    (arg1, arg2, arg3, arg4, arg5) => {
      const value = transformEventToValue
        ? transformEventToValue(arg1, arg2, arg3, arg4, arg5)
        : defaultEventToValue(arg1)
      const error = getError(value)
      changeField(namespace, fieldName, value, error, dirtyCheck)
      onChange && onChange(arg1, arg2, arg3, arg4, arg5)
    },
    [transformEventToValue, getError, changeField, namespace, fieldName, dirtyCheck, onChange],
  )

  const handleBlur = useCallback<FocusEventHandler<T>>(
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
  } as FactoryWithoutConnectFieldProps<P> & ConnectFieldReturnProps<T>
}
