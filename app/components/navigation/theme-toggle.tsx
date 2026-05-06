'use client';

import { MoonIcon, SunIcon } from '@/app/icons';
import { useTheme } from '@/lib/theme';
import styles from './theme-toggle.module.scss';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type='button'
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      <span className={styles.icon} aria-hidden='true'>
        {isDark ? <SunIcon /> : <MoonIcon />}
      </span>
    </button>
  );
};
