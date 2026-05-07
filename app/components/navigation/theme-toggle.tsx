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
      role='switch'
      aria-checked={isDark}
      className={`${styles.toggle} ${isDark ? styles.toggleDark : styles.toggleLight}`}
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      <span className={styles.track} aria-hidden='true'>
        <span className={`${styles.iconSlot} ${styles.iconSun}`}>
          <SunIcon />
        </span>
        <span className={`${styles.iconSlot} ${styles.iconMoon}`}>
          <MoonIcon />
        </span>
        <span className={styles.thumb} />
      </span>
    </button>
  );
};
