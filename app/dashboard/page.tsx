'use client';

import { NavAuthSection } from '@/app/components/navigation';
import Link from 'next/link';
import { ViewTransition } from 'react';
import styles from './page.module.scss';

export default function DashboardPage() {
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
              <ViewTransition name='dashboard-link'>
                <Link href='/dashboard' className={styles.navActive}>
                  Dashboard
                </Link>
              </ViewTransition>
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
