export function creatorGetField<T>(key: string | symbol, defaultValue: T): (namespace: string, fieldName: string) => T
export function getFieldError<T>(namespace: string, fieldName: string): T
export function getFieldValue<T>(namespace: string, fieldName: string): T
export function getFieldDefaultValue<T>(namespace: string, fieldName: string): T
export function getFieldValueOnFocus<T>(namespace: string, fieldName: string): T
export function hasFieldFocus<T>(namespace: string, fieldName: string): T
export function isFieldDirty<T>(namespace: string, fieldName: string): T
export function isFieldTouched<T>(namespace: string, fieldName: string): T
export function isFieldValid<T>(namespace: string, fieldName: string): T
