import { SignupFormPayload } from '@/lib/types/auth';
import { FormValidationResult } from '@/lib/types/validations';
import { isDigit, isEmail } from '@/lib/utils/checkers';
import { isValid } from 'date-fns';

export const validateSignupForm = (
  signupPayload: Partial<SignupFormPayload>
): FormValidationResult<Partial<SignupFormPayload>> => {
  const validationResult: FormValidationResult<Partial<SignupFormPayload>> = {
    errors: {},
  };

  if (!signupPayload.identityNumber?.trim()) {
    validationResult.errors.identityNumber = 'Identity number is required.';
  } else if (!isDigit(signupPayload.identityNumber)) {
    validationResult.errors.identityNumber = 'Identity number must contain digits only.';
  }

  if (!signupPayload.userName?.trim()) {
    validationResult.errors.userName = 'Username is required.';
  }

  if (!signupPayload.firstName?.trim()) {
    validationResult.errors.firstName = 'First name is required.';
  }

  if (!signupPayload.lastName?.trim()) {
    validationResult.errors.lastName = 'Last name is required.';
  }

  if (!signupPayload.email) {
    validationResult.errors.email = 'Email is required.';
  } else if (!isEmail(signupPayload.email)) {
    validationResult.errors.email = 'Enter a valid email address.';
  }

  if (!signupPayload.gender) {
    validationResult.errors.gender = 'Gender is required.';
  }

  if (!signupPayload.dateOfBirth) {
    validationResult.errors.dateOfBirth = 'Date of birth is required.';
  } else if (!isValid(new Date(signupPayload.dateOfBirth))) {
    validationResult.errors.dateOfBirth = 'Enter a valid date of birth.';
  }

  if (!signupPayload.phoneNumber?.trim()) {
    validationResult.errors.phoneNumber = 'Phone number is required.';
  } else if (!isDigit(signupPayload.phoneNumber)) {
    validationResult.errors.phoneNumber = 'Phone number must contain digits only.';
  }

  if (!signupPayload.address?.trim()) {
    validationResult.errors.address = 'Address is required.';
  }

  if (!signupPayload.password) {
    validationResult.errors.password = 'Password is required.';
  } else if (signupPayload.password.length < 8) {
    validationResult.errors.password = 'Password must be at least 8 characters.';
  }

  if (!signupPayload.confirmPassword) {
    validationResult.errors.confirmPassword = 'Please confirm your password.';
  } else if (signupPayload.password !== signupPayload.confirmPassword) {
    validationResult.errors.confirmPassword = 'Passwords do not match.';
  }

  return validationResult;
};
