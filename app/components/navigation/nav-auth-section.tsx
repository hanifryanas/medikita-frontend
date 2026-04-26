'use client';

import { nextApi } from '@/lib/api/next';
import { AuthStatus, useAuthStore } from '@/lib/stores';
import { getUserInitial } from '@/lib/utils/formatters';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ViewTransition } from 'react';
import styles from './nav-auth-section.module.scss';
export const NavAuthSection = () => {
  const user = useAuthStore((state) => state.currentUser);
  const status = useAuthStore((state) => state.status);
  const signout = useAuthStore((state) => state.signout);
  const pathname = usePathname();

  const handleSignout = async () => {
    try {
      await nextApi.auth.signout();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign out failed.';
      alert(message);
    }
    signout();
  };

  if (status !== AuthStatus.Authenticated || !user) {
    return (
      <div className={styles.navAuthGroup}>
        <Link href='/signin' className={styles.navBtnGhost}>
          Sign in
        </Link>
        <Link href='/signup' className={styles.navBtnPrimary}>
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.navAvatarGroup}>
      {pathname !== '/dashboard' && (
        <ViewTransition name='dashboard-link'>
          <Link href='/dashboard' className={styles.navLink}>
            Dashboard
          </Link>
        </ViewTransition>
      )}
      <Link href='/profile' className={styles.navAvatarBtn} aria-label='Open profile'>
        <span className={styles.navAvatarInitial}>
          {getUserInitial(user.firstName, user.lastName)}
        </span>
      </Link>
      <button type='button' className={styles.navBtnGhost} onClick={handleSignout}>
        Sign out
      </button>
    </div>
  );
};
