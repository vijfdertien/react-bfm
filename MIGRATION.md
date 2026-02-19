# Migration Guide: v1 to v2

This guide will help you upgrade from react-bfm v1.x to v2.x.

## Overview

Version 2.0 is a major rewrite with TypeScript, improved performance using React 18's `useSyncExternalStore`, and some breaking API changes. The core concepts remain the same, but several props and features have been renamed or removed.

## Prerequisites

- **React 18.2+** is now required (v1 supported React 16.8+)
- **Node.js 14+** recommended

## Breaking Changes

### 1. `defaultValue` → `initialValue`

The `defaultValue` prop has been renamed to `initialValue` for clarity.

**v1:**

```jsx
<Input namespace="form" fieldName="username" defaultValue="John" />
```

**v2:**

```jsx
<Input namespace="form" fieldName="username" initialValue="John" />
```

**Migration:** Find and replace `defaultValue=` with `initialValue=` in your form components.

---

### 2. `omitProps` Parameter Removed

The second parameter `omitProps` in `useConnectField()` has been removed. Instead, you should destructure the props you need.

**v1:**

```jsx
const Input = (props) => {
  // omitProps as second parameter
  return <input {...useConnectField(props, ['dirty', 'touched', 'valid', 'error', 'focus'])} />
}
```

**v2:**

```jsx
const Input = (props) => {
  // Destructure what you need, spread the rest
  const { dirty, touched, valid, error, focus, ...fieldProps } = useConnectField(props)
  return <input {...fieldProps} />
}
```

**Why?** This gives you more control and is more explicit about which props you're using.

---

### 3. `keepFieldStateOnUnmount` Removed

The `keepFieldStateOnUnmount` prop (added in v1.2.0) has been removed in v2. Fields are now always cleaned up on unmount.

**v1:**

```jsx
<Input
  namespace="form"
  fieldName="username"
  keepFieldStateOnUnmount // No longer supported
/>
```

**v2:**
If you need to preserve form state, implement your own persistence layer:

```jsx
// Example: Save/restore from localStorage or state management
const savedValues = getNamespaceValues('form')
localStorage.setItem('formState', JSON.stringify(savedValues))
```

---

### 4. Default Field Value Changed

In v1, the default field value was an empty string `""`. In v2, it's `undefined`.

**v1 behavior:**

```javascript
getFieldValue('form', 'username') // Returns "" if not set
```

**v2 behavior:**

```javascript
getFieldValue('form', 'username') // Returns undefined if not set
```

**Migration:** If your code depends on empty strings, use the `initialValue` prop:

```jsx
<Input namespace="form" fieldName="username" initialValue="" />
```

Or handle `undefined` in your components:

```jsx
const value = getFieldValue('form', 'username') ?? ''
```

---

### 5. TypeScript Support

v2 is fully written in TypeScript with complete type definitions.

**Benefits:**

- Full type inference for props
- Better IDE autocomplete
- Type-safe validators and transformers

**v2 with TypeScript:**

```typescript
import { useConnectField, ConnectFieldProps } from 'react-bfm'

interface InputProps extends ConnectFieldProps {
  placeholder?: string
}

const Input = (props: InputProps) => {
  const { dirty, touched, valid, error, focus, ...fieldProps } = useConnectField(props)
  return <input {...fieldProps} />
}
```

---

### 6. Internal Refactoring: `useSyncExternalStore`

v2 uses React 18's `useSyncExternalStore` for better performance and SSR support.

**What this means for you:**

- Better React 18+ concurrent mode support
- Improved SSR/Next.js compatibility (added in beta.18)
- No changes needed in your code

---

## New Features in v2

### 1. Server-Side Rendering Support

v2 now supports SSR frameworks like Next.js (added in beta.18).

```jsx
// Works in Next.js App Router, Pages Router, etc.
export default function Page() {
  return (
    <form>
      <Input namespace="form" fieldName="email" type="email" />
    </form>
  )
}
```

### 2. Better TypeScript Experience

Full type safety throughout:

```typescript
import type { ValidatorFunction } from 'react-bfm'

const emailValidator: ValidatorFunction = (value, props) => {
  if (!value) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email'
  return null // Valid
}
```

### 3. New Exported Types

v2 exports many more types for better TypeScript integration:

- `FieldStateType`
- `NamespaceStateType`
- `ValidatorFunction`
- `DirtyCheckFunction`
- `TransformEventToValueFunction`
- `TransformValueToInputFunction`
- And more...

---

## Step-by-Step Migration

### Step 1: Update Dependencies

```bash
# Using npm
npm install react-bfm@^2.0.0 react@^18.2.0

# Using yarn
yarn add react-bfm@^2.0.0 react@^18.2.0

# Using bun
bun add react-bfm@^2.0.0 react@^18.2.0
```

### Step 2: Update React to 18.2+

If you're not already on React 18:

```bash
npm install react@^18.2.0 react-dom@^18.2.0
```

See [React 18 upgrade guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide) for details.

### Step 3: Rename `defaultValue` to `initialValue`

Search and replace in your codebase:

```bash
# Using grep to find occurrences
grep -r "defaultValue=" src/

# If using VS Code, search for: defaultValue=
# Replace with: initialValue=
```

### Step 4: Remove `omitProps` Usage

Find all uses of `useConnectField` with two parameters:

**Before:**

```jsx
const Input = (props) => <input {...useConnectField(props, ['dirty', 'touched'])} />
```

**After:**

```jsx
const Input = (props) => {
  const { dirty, touched, ...fieldProps } = useConnectField(props)
  return <input {...fieldProps} />
}
```

### Step 5: Remove `keepFieldStateOnUnmount`

If you were using this prop, implement your own state persistence:

```jsx
import { getNamespaceValues } from 'react-bfm'

// Save before unmount
const FormWrapper = () => {
  const values = getNamespaceValues('myForm')

  useEffect(() => {
    return () => {
      // Save to localStorage, Redux, etc.
      localStorage.setItem('formState', JSON.stringify(values))
    }
  }, [values])

  return <MyForm />
}
```

### Step 6: Handle Undefined Default Values

If your validators or components expect empty strings:

```jsx
// Option 1: Set initialValue
;<Input namespace="form" fieldName="username" initialValue="" />

// Option 2: Use nullish coalescing
const value = getFieldValue('form', 'username') ?? ''

// Option 3: Update validator
const validator = (value) => {
  const val = value ?? '' // Handle undefined
  if (val.length < 3) return 'Too short'
  return null
}
```

### Step 7: Add TypeScript (Optional but Recommended)

If you want to adopt TypeScript:

1. Rename files from `.js` to `.tsx`
2. Add types to your components:

```typescript
import type { ConnectFieldProps, ValidatorFunction } from 'react-bfm'

interface MyInputProps extends ConnectFieldProps {
  placeholder?: string
  className?: string
}

const MyInput = (props: MyInputProps) => {
  const { dirty, touched, valid, error, ...fieldProps } = useConnectField(props)
  return <input {...fieldProps} />
}
```

---

## Testing Your Migration

After migrating, test these scenarios:

1. **Form initialization** - Fields should initialize with `initialValue`
2. **Validation** - Validators should work as before
3. **Field state** - dirty, touched, focus, valid should work correctly
4. **Namespace functions** - `clearNamespace`, `resetNamespace`, etc.
5. **Multiple forms** - Different namespaces should remain independent
6. **Unmounting** - Fields should clean up properly

---

## Common Issues

### Issue: Empty strings instead of undefined

**Problem:** My code expects `""` but gets `undefined`

**Solution:**

```jsx
// Set initialValue explicitly
;<Input initialValue="" />

// Or handle in your code
const displayValue = value ?? ''
```

### Issue: TypeScript errors with props

**Problem:** TypeScript complains about spreading props

**Solution:**

```typescript
import type { FactoryWithoutConnectFieldProps } from 'react-bfm'

interface MyProps {
  customProp: string
}

const MyInput = (props: ConnectFieldProps & MyProps) => {
  const fieldProps = useConnectField<MyProps>(props)
  return <input {...fieldProps} />
}
```

### Issue: Forms not working in Next.js

**Problem:** SSR hydration errors

**Solution:** Make sure you're on react-bfm v2.0.0-beta.18 or later (SSR support was added here)

---

## Need Help?

- **Documentation:** [README.md](./README.md)
- **Issues:** [GitHub Issues](https://github.com/vijfdertien/react-bfm/issues)
- **Changelog:** [CHANGELOG.md](./CHANGELOG.md)

---

## Benefits of Upgrading

✅ **React 18 Support** - Concurrent mode, Suspense, SSR improvements
✅ **TypeScript** - Full type safety and better DX
✅ **Performance** - Using `useSyncExternalStore` for better React integration
✅ **SSR/Next.js** - Production-ready server-side rendering
✅ **Modern Codebase** - Up-to-date dependencies and best practices
✅ **Better Testing** - Improved test coverage and reliability
