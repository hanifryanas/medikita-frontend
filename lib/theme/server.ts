import { cookies } from 'next/headers';

export type Theme = 'light' | 'dark';

export const THEME_COOKIE = 'medikita-theme';
export const DEFAULT_THEME: Theme = 'dark';

export const getServerTheme = async (): Promise<Theme> => {
  const store = await cookies();
  const value = store.get(THEME_COOKIE)?.value;
  return value === 'light' || value === 'dark' ? value : DEFAULT_THEME;
};
