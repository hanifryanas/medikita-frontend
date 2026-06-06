import type { ReactNode } from 'react';
import styles from './stat-tile.module.scss';

interface StatTileProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
}

export const StatTile = ({ label, value, hint, icon }: StatTileProps) => (
  <article className={styles.tile}>
    <header className={styles.head}>
      <span className={styles.label}>{label}</span>
      {icon && (
        <span className={styles.icon} aria-hidden>
          {icon}
        </span>
      )}
    </header>
    <span className={styles.value}>{value}</span>
    {hint && <p className={styles.hint}>{hint}</p>}
  </article>
);
