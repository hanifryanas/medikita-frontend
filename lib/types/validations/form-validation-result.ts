export interface FormValidationResult<T> {
  errors: { [P in keyof T]?: string };
}
