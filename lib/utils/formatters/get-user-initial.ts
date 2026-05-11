const HONORIFIC_PREFIXES = ['dr', 'drg', 'drh', 'prof', 'ns', 'mr', 'mrs', 'ms', 'sr', 'br'];
const HONORIFIC_REGEX = new RegExp(`^(?:(?:${HONORIFIC_PREFIXES.join('|')})\\.?\\s+)+`, 'i');

const extractInitialsFromFullName = (fullName: string): string => {
  const withoutSuffix = fullName.split(',')[0];
  const withoutPrefix = withoutSuffix.replace(HONORIFIC_REGEX, '');

  const parts = withoutPrefix.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
};

export const getUserInitial = (name: {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  fallback?: string;
}): string => {
  const firstInitial = name.firstName?.charAt(0).toUpperCase() ?? '';
  const lastInitial = name.lastName?.charAt(0).toUpperCase() ?? '';
  const fromParts = `${firstInitial}${lastInitial}`;
  if (fromParts) return fromParts;

  if (name.fullName) {
    const fromFullName = extractInitialsFromFullName(name.fullName);
    if (fromFullName) return fromFullName;
  }

  return name.fallback ?? '';
};
