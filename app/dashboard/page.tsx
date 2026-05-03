'use client';

import { AccountShell } from '@/app/components/layout';
import { useRequireAuth } from '@/lib/hooks';
import { AuthStatus } from '@/lib/stores';
import styles from './page.module.scss';

export default function DashboardPage() {
  const status = useRequireAuth();

  if (status !== AuthStatus.Authenticated) {
    return null;
  }

  return (
    <AccountShell>
      <h1 className={styles.heading}>Dashboard</h1>
      <p className={styles.subtitle}>Welcome back! Here is your health overview.</p>
    </AccountShell>
  );
}
