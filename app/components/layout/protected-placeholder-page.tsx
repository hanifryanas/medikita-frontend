'use client';

import { useRequireAuth } from '@/lib/hooks';
import { AuthStatus } from '@/lib/stores';
import { AccountShell } from './account-shell';
import styles from './placeholder-page.module.scss';

interface ProtectedPlaceholderPageProps {
  title: string;
  subtitle?: string;
}

export const ProtectedPlaceholderPage = ({ title, subtitle }: ProtectedPlaceholderPageProps) => {
  const status = useRequireAuth();
  if (status !== AuthStatus.Authenticated) return null;

  return (
    <AccountShell>
      <h1 className={styles.heading}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      <div className={styles.empty}>Coming soon.</div>
    </AccountShell>
  );
};
