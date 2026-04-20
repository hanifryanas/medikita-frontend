import { SigninPayload } from '@/lib/types/auth';
import { FormValidationResult } from '@/lib/types/validations';
import { validFormValidationResult } from '../valid-form-validation-result';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateSignin = (
  signinPayload: Partial<SigninPayload>
): FormValidationResult<Partial<SigninPayload>> => {
  const validationResult: FormValidationResult<Partial<SigninPayload>> = {
    errors: {},
  };

  if (!signinPayload.password) {
    validationResult.errors.password = 'Password is required.';
  }

  if (!signinPayload.identifier?.trim()) {
    validationResult.errors.identifier = 'Email, username, or phone number is required.';
  } else if (
    signinPayload.identifier.includes('@') &&
    !EMAIL_REGEX.test(signinPayload.identifier)
  ) {
    validationResult.errors.identifier = 'Enter a valid email address.';
  }

  return Object.keys(validationResult.errors).length > 0
    ? validationResult
    : validFormValidationResult();
};
