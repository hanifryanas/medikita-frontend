import { SignupPayload } from '@/lib/types/auth';
import { FormValidationResult } from '@/lib/types/validations';
import { validFormValidationResult } from '../valid-form-validation-result';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateSignup = (
  signupPayload: SignupPayload
): FormValidationResult<Partial<SignupPayload>> => {
  const validationResult: FormValidationResult<Partial<SignupPayload>> = {
    errors: {},
  };

  if (!signupPayload.firstName.trim()) {
    validationResult.errors.firstName = 'First name is required.';
  }

  if (!signupPayload.lastName.trim()) {
    validationResult.errors.lastName = 'Last name is required.';
  }

  if (!signupPayload.email) {
    validationResult.errors.email = 'Email is required.';
  } else if (!EMAIL_REGEX.test(signupPayload.email)) {
    validationResult.errors.email = 'Enter a valid email address.';
  }

  if (!signupPayload.password) {
    validationResult.errors.password = 'Password is required.';
  } else if (signupPayload.password.length < 8) {
    validationResult.errors.password =
      'Password must be at least 8 characters.';
  }

  if (!signupPayload.confirmPassword) {
    validationResult.errors.confirmPassword = 'Please confirm your password.';
  } else if (signupPayload.password !== signupPayload.confirmPassword) {
    validationResult.errors.confirmPassword = 'Passwords do not match.';
  }

  return Object.keys(validationResult.errors).length > 0
    ? validationResult
    : validFormValidationResult();
};
