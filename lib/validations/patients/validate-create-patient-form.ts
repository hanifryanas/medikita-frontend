import type { CreatePatientFormPayload } from '@/lib/types/patients';
import type { FormValidationResult } from '@/lib/types/validations';
import { isDigit, isStandardDateString } from '@/lib/utils/checkers';

export const validateCreatePatientForm = (
  payload: Partial<CreatePatientFormPayload>
): FormValidationResult<Partial<CreatePatientFormPayload>> => {
  const result: FormValidationResult<Partial<CreatePatientFormPayload>> = { errors: {} };

  if (!payload.relationship) {
    result.errors.relationship = 'Relationship is required.';
  }

  if (!payload.identityNumber?.trim()) {
    result.errors.identityNumber = 'Identity number is required.';
  } else if (!isDigit(payload.identityNumber)) {
    result.errors.identityNumber = 'Identity number must contain digits only.';
  }

  if (!payload.firstName?.trim()) {
    result.errors.firstName = 'First name is required.';
  }

  if (!payload.gender) {
    result.errors.gender = 'Gender is required.';
  }

  if (!payload.phoneNumber?.trim()) {
    result.errors.phoneNumber = 'Phone number is required.';
  } else if (!isDigit(payload.phoneNumber)) {
    result.errors.phoneNumber = 'Phone number must contain digits only.';
  }

  if (!payload.dateOfBirth) {
    result.errors.dateOfBirth = 'Date of birth is required.';
  } else if (!isStandardDateString(payload.dateOfBirth)) {
    result.errors.dateOfBirth = 'Enter a valid date (YYYY-MM-DD).';
  }

  return result;
};
