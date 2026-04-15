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

  if (
    !loginPayload.email &&
    !loginPayload.username &&
    !loginPayload.phoneNumber
  ) {
    validationResult.errors.email =
      'Email, username, or phone number is required.';
  }

  if (loginPayload.email && !EMAIL_REGEX.test(loginPayload.email)) {
    validationResult.errors.email = 'Enter a valid email address.';
  }

  return Object.keys(validationResult.errors).length > 0
    ? validationResult
    : validFormValidationResult();
};
