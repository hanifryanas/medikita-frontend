import { FormValidationResult } from '../types/validations';

const ValidFormValidationResult: FormValidationResult<unknown> = { errors: {} };

export const validFormValidationResult = () => ValidFormValidationResult;
