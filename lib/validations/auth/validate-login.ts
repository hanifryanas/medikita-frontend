import { LoginPayload } from '@/lib/types/auth';
import { FormValidationResult } from '@/lib/types/validations';
import { validFormValidationResult } from '../valid-form-validation-result';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateLogin = (
  loginPayload: LoginPayload
): FormValidationResult<Partial<LoginPayload>> => {
  const validationResult: FormValidationResult<Partial<LoginPayload>> = {
    errors: {},
  };

  if (!loginPayload.password) {
    validationResult.errors.password = 'Password is required.';
  }

  if (!loginPayload.identifier.trim()) {
    validationResult.errors.identifier = 'Email, username, or phone number is required.';
  } else if (loginPayload.identifier.includes('@') && !EMAIL_REGEX.test(loginPayload.identifier)) {
    validationResult.errors.identifier = 'Enter a valid email address.';
  }

  return Object.keys(validationResult.errors).length > 0
    ? validationResult
    : validFormValidationResult();
};
