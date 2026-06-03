export const isSafeRedirectPath = (value: string | null | undefined): value is string => {
  if (!value) return false;

  return value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\');
};
