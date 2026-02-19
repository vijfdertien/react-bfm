# React BFM

A basic field (or form) state manager for React using hooks.

Version 1.x is no longer maintained. Please upgrade to version 2.x; it is compatible with React 18.2 and above.

> **Migration Guide:** Upgrading from v1.x? See [MIGRATION.md](./MIGRATION.md) for a complete guide.

# Features

- Initialize fields on rendering
- Configuration by using props
- Only hooks and state functions: no components
- Can be used with any component, and customize to your needs, see examples.
- Dynamically change your form based on rendered components. No need to update your form state/configuration beforehand.
- No strict formats on validators you want to use. Validators can return strings, array, object, etc. as long a falsy value is returned when the value is valid.
- The value in the state can be formatted to your needs.

# Installation

Installing is simple:

```bash
$ yarn add react-bfm
# or
$ npm install react-bfm
# or
$ bun add react-bfm
```

Now you can import the most important hook and create your forms: `useConnectField()`

# Documentation

## Hooks / Functions

**useConnectField( props )**  
Connects a field to a form namespace. The `props` object must include `namespace` and `fieldName`.

Extended `props` are returned by the hook, with the following remarks:

- Excluded are props only used for the hook: `namespace`, `fieldName`, `initialValue`, `validator`, `dirtyCheck`, `transformValueToInput` and `transformEventToValue`
- Included are `onFocus`, `onChange` and `onBlur` to handle the input field state.

Add the `validator` prop to validate the field value. This function gets two arguments: `value` and `props`.
It should return a falsy value if the input value is valid.
If the input value is not valid, any truthy value can be returned, for example a string or array with error message(s).

**useFieldError( namespace, fieldName )  
getFieldError( namespace, fieldName )**  
The error for a field, as returned by the `validator`. Returns `null` if field is valid.

**useFieldHasFocus( namespace, fieldName )  
hasFieldFocus( namespace, fieldName )**  
Returns a boolean, `true` if the field has focus.

**useFieldIsDirty( namespace, fieldName )  
isFieldDirty( namespace, fieldName )**  
Returns a boolean, `true` if the field value has been changed.

**useFieldIsTouched( namespace, fieldName )  
isFieldTouched( namespace, fieldName )**  
Returns a boolean, `true` if the field value has been touched (after first `onFocus` event).

**useFieldIsValid( namespace, fieldName )  
isFieldValid( namespace, fieldName )**  
Returns a boolean, `true` if the field value is valid (error is `null`).

**useFieldValue( namespace, fieldName )  
getFieldValue( namespace, fieldName )**  
Returns the field state value.

**useFieldValueOnFocus( namespace, fieldName )  
getFieldValueOnFocus( namespace, fieldName )**  
Returns the field value what it was before the field got focus. Only available if the field has focus, otherwise `null`.

**useNamespaceErrors( namespace )  
getNamespaceErrors( namespace )**  
Returns an object with the `error` value of every field in the namespace.

**useNamespaceHasFocus( namespace )  
hasNamespaceFocus( namespace )**  
Returns a boolean, `true` if one field in the namespace has `focus`.

**useNamespaceIsDirty( namespace )  
isNamespaceDirty( namespace )**  
Returns a boolean, `true` if one or more fields in the namespace is `dirty`.

**useNamespaceIsTouched( namespace )  
isNamespaceTouched( namespace )**  
Returns a boolean, `true` if one or more fields in the namespace are `touched`.

**useNamespaceIsValid( namespace )  
isNamespaceValid( namespace )**  
Returns a boolean, `true` if all fields in the namespace are `valid`.

**useNamespaceValues( namespace )  
getNamespaceValues( namespace )**  
Returns an object with the state value of every field in the namespace.

**useNamespaceValuesOnFocus( namespace )  
getNamespaceValuesOnFocus( namespace )**  
Returns an object with the `valueOnFocus` value for every field in the namespace. Notice that only one field will have a value and all others are `null`, because only one field can have focus.

**clearField( namespace, fieldName )**  
Reset field, but ignoring default value.  
See also `resetField`

**resetField( namespace, fieldName )**  
Reset field to default state and setting last provided default value, if applicable.  
See also `clearField`

**clearNamespace( namespace )**  
Reset namespace, but ignoring the default values of the fields  
See also `resetNamespace`

**resetNamespace( namespace )**
Reset namespace to default state and setting last provided default value per field
See also `clearNamespace`

## Deprecation Notices

The following exports are deprecated and will be removed in v3.0.0:

- **`BFMHooksContext`** - Internal React context
- **`BFMHookContextType`** - Internal context type
- **`FIELD_KEY_INITIAL_VALUE_ERROR`** - Internal field key constant
- **`FIELD_DEFAULT_DEFAULT_VALUE_ERROR`** - Internal field default constant
- **`mapFieldValueAndError`** - Internal helper function

# Examples

## Basic usages

```javascript
const Input = (props) => <input {...useConnectField(props)} />

const BasicForm = () => (
  <form>
    <Input namespace="basic" fieldName="username" type="text" />
    <Input namespace="basic" fieldName="password" type="password" />
  </form>
)
```

## Recommended usages

```javascript
const Input = (props) => {
  const { dirty, touched, valid, error, focus, ...fieldProps } = useConnectField(props)

  // just a simple example how you can style the input based on the props, there are better ways to do this
  const inputStyle = useMemo(() => {
    const style = {}
    if (touched) {
      style.borderColor = valid ? 'green' : 'red'
    }
    if (focus) {
      style.backgroundColor = 'lightgrey'
    }

    return style
  }, [focus, touched, valid])

  return (
    <>
      <input {...fieldProps} style={inputStyle} />
      {error && touched && dirty && <span>{error}</span>}
    </>
  )
}

const simpleTextLengthValidator = (value) =>
  value && value.length > 2 && value.length < 10 ? null : 'Text should be between 2 and 10 chars'

const simplePasswordValidator = (value) => (value && /\d/.test(value) ? null : 'Password should contain a number')

const RecommendedForm = () => (
  <form>
    <Input namespace="recommended" fieldName="username" type="text" validator={simpleTextLengthValidator} />
    <Input namespace="recommended" fieldName="password" type="password" validator={simplePasswordValidator} />
  </form>
)
```

## Advanced usages

```javascript
// see recommended example
const Input = (props) => {
  ...
  return (
    <>
      <input {...fieldProps} style={inputStyle} />
      {error?.length && touched && dirty && error.map((message, index) => <span key={index}>{message}</span>)}
    </>
  )
}

const textValidator = (value, props) => {
  const errors = []
  if (!value && props.required) {
    errors.push('This field is required')
  }

  if (value && props.required && props.minLength > 0 && value.length < props.minLength) {
    errors.push('Too short')
  }

  if (value && props.maxLength > 0 && value.length > props.maxLength) {
    errors.push('Too long')
  }

  return errors.length ? errors : null
}

const passwordValidator = (value, props) => {
  const errors = []

  if (value && props.minLength > 0 && value.length < props.minLength) {
    errors.push('Too short')
  }

  if (value && props.containNumbers && !/\d/.test(value)) {
    errors.push('Should contain at least one number')
  }

  if (value && props.containUpperCase && !/[A-Z]/.test(value)) {
    errors.push('Should contain at least upper case char')
  }

  return errors
}

const UsernameInput = () => {
  // Additional actions (these are executed after field state is updated).
  const handleFocus = useCallback((event) => {...}, [...])
  const handleChange = useCallback((event) => {...}, [...])
  const handleBlur = useCallback((event) => {...}, [...])

  return (
    <Input
      namespace="advanced"
      fieldName="username"
      type="text"
      initialValue="fooBar"
      required
      minLength={2}
      maxLength={15}
      validator={textValidator}
      onFocus={handleFocus}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  )
}

const NicknameInput = () => (
  <Input
    namespace="advanced"
    fieldName="nickname"
    type="text"
    initialValue="barFoo"
    minLength={5}
    maxLength={25}
    validator={textValidator}
  />
)

const PasswordInput = () => (
  <Input
    namespace="advanced"
    fieldName="password"
    type="password"
    required
    minLength={8}
    containNumbers
    validator={passwordValidator}
  />
)

const SubmitButton = () => <button type="submit" disabled={!useNamespaceIsValid('advanced')} />

const Form = () => <form style={{ backgroundColor: useNamespaceHasFocus('advanced') ? 'lightblue' : 'inherit' }} />

const AdvancedForm = () => (
  <Form>
    <UsernameInput />
    <NicknameInput />
    <PasswordInput />
    <SubmitButton />
  </Form>
)
```
