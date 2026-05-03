'use client';

import { NavAuthSection } from '@/app/components/navigation';
import { useRequireAuth } from '@/lib/hooks';
import { AuthStatus } from '@/lib/stores';
import Link from 'next/link';
import styles from './page.module.scss';

export default function DashboardPage() {
  const status = useRequireAuth();

  if (status !== AuthStatus.Authenticated) {
    return null;
  }

  return (
    <div className={styles.page}>
      {/* ── Navigation ── */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <Link href='/' className={styles.logo}>
            <span className={styles.logoMark}>✚</span>
            MediKita
          </Link>
          <ul className={styles.navLinks}>
            <li>
              <Link href='/dashboard' className={styles.navActive}>
                Dashboard
              </Link>
            </li>
          </ul>
          <div className={styles.navRight}>
            <NavAuthSection />
          </div>
        </div>
      </nav>

      {/* ── Content ── */}
      <main className={styles.content}>
        <h1 className={styles.heading}>Dashboard</h1>
        <p className={styles.subtitle}>Welcome back! Here is your health overview.</p>
      </main>
    </div>
  );
}
