export interface FormValidationResult<T> {
  errors: { [P in keyof T]?: string };
}

export const isValidationResultValid = <T>(result: FormValidationResult<T>): boolean =>
  Object.keys(result.errors).length === 0;
