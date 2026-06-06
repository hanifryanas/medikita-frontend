import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './dashboard-section.module.scss';

interface DashboardSectionProps {
  title: string;
  actionLabel?: string;
  actionHref?: string;
  children: ReactNode;
}

export const DashboardSection = ({
  title,
  actionLabel,
  actionHref,
  children,
}: DashboardSectionProps) => (
  <section className={styles.card}>
    <header className={styles.head}>
      <h2 className={styles.title}>{title}</h2>
      {actionLabel && actionHref && (
        <Link className={styles.action} href={actionHref}>
          {actionLabel}
        </Link>
      )}
    </header>
    <div className={styles.body}>{children}</div>
  </section>
);
