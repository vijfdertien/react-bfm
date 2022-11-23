import { DirtyCheckFunction, EventToValueFunction, TransformValueToInput } from './general.d'

export function checkedEventToValue(): EventToValueFunction<boolean>
export function defaultEventToValue(): EventToValueFunction
export function defaultDirtyCheck(): DirtyCheckFunction
export function defaultValueToInput(): TransformValueToInput
export function mapFieldValueAndError<T, E>(value: T, error: E): object
export function validateFieldName(value: unknown): boolean
export function validateNamespace(value: unknown): boolean
