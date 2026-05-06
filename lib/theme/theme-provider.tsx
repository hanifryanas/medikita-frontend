'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { writeThemeCookie, type Theme } from './shared';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  initial: Theme;
  children: ReactNode;
}

export const ThemeProvider = ({ initial, children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(initial);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = next;
      writeThemeCookie(next);
    }
  };

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};
