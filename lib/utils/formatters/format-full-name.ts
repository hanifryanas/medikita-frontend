interface NameParts {
  firstName?: string | null;
  lastName?: string | null;
}

export const formatFullName = (name: NameParts, fallback = ''): string => {
  const parts = [name.firstName, name.lastName]
    .map((p) => p?.trim())
    .filter((p): p is string => Boolean(p));
  return parts.length > 0 ? parts.join(' ') : fallback;
};
