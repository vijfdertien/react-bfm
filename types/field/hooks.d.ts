export function creatorUseField<T>(key: string | symbol, defaultValue: T): (namespace: string, fieldName: string) => T
export function useFieldError<T>(namespace: string, fieldName: string): T
export function useFieldHasFocus<T>(namespace: string, fieldName: string): T
export function useFieldIsDirty<T>(namespace: string, fieldName: string): T
export function useFieldIsTouched<T>(namespace: string, fieldName: string): T
export function useFieldIsValid<T>(namespace: string, fieldName: string): T
export function useFieldValue<T>(namespace: string, fieldName: string): T
export function useFieldValueOnFocus<T>(namespace: string, fieldName: string): T
