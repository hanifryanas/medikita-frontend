'use client';

import { PublicNav } from '@/app/components/navigation';
import styles from './placeholder-page.module.scss';

interface PlaceholderPageProps {
  title: string;
  subtitle?: string;
}

export const PlaceholderPage = ({ title, subtitle }: PlaceholderPageProps) => {
  return (
    <div className={styles.page}>
      <PublicNav />
      <main className={styles.content}>
        <h1 className={styles.heading}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        <div className={styles.empty}>Coming soon.</div>
      </main>
    </div>
  );
};
