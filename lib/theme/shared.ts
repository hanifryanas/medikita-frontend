export type Theme = 'light' | 'dark';

export const THEME_COOKIE = 'medikita-theme';
export const DEFAULT_THEME: Theme = 'dark';

// 1 year, root path, lax — preference cookie, not auth.
export const writeThemeCookie = (theme: Theme): void => {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=${maxAge}; samesite=lax`;
};
