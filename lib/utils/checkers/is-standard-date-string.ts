import { isValid } from 'date-fns';

export const standardDateStringPattern = /^\d{4}-\d{2}-\d{2}$/;

export const isStandardDateString = (value: unknown): value is string => {
  if (typeof value !== 'string') return false;
  if (!standardDateStringPattern.test(value)) return false;
  return isValid(new Date(value));
};
