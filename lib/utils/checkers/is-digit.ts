const DIGITS_REGEX = /^\d+$/;

export const isDigit = (value: string): boolean => DIGITS_REGEX.test(value);
