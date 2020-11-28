/**
 * Function to get the checked value from a event
 * @param event
 * @return {*}
 */
export const checkedEventToValue = (event) => event?.target?.checked

/**
 * Default function to get the input value from the event
 * @param event
 * @return {*}
 */
export const defaultEventToValue = (event) => event?.target?.value

/**
 * Default function used to check if input value is modified (dirty)
 * @param newValue
 * @param valueOnFocus
 * @return {boolean}
 */
export const defaultDirtyCheck = (newValue, valueOnFocus) => newValue !== valueOnFocus

/**
 * Default function used to transform state value to input value
 * @param value
 * @return {*}
 */
export const defaultValueToInput = (value) => value

const validateString = (value) => typeof value === 'string' && value.length > 0

/**
 * Validate fieldName
 * @param value
 * @returns {boolean}
 */
export const validateFieldName = validateString

/**
 * Validate namespace
 * @param value
 * @returns {boolean}
 */
export const validateNamespace = validateString
