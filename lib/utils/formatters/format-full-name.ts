interface NameParts {
  firstName?: string | null;
  lastName?: string | null;
}

/**
 * Render a person's full name without `undefined`/`null` leaking into the
 * output. Trims whitespace and falls back to the given placeholder when no
 * name parts are available.
 */
export const formatFullName = (name: NameParts, fallback = 'Unnamed patient'): string => {
  const parts = [name.firstName, name.lastName]
    .map((p) => p?.trim())
    .filter((p): p is string => Boolean(p));
  return parts.length > 0 ? parts.join(' ') : fallback;
};
