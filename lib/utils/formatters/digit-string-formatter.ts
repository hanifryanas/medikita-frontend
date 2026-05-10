/**
 * Strips all non-digit characters from a string, leaving only [0-9].
 * Useful for inputs that should accept digits only (e.g. identity number, phone number).
 */
export const digitStringFormatter = (value: string): string => value.replace(/\D/g, '');
