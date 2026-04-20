'use client';

import Link from 'next/link';
import { nextApi } from '@/lib/api/next';
import { useAuthStore } from '@/lib/stores';
import styles from './nav-auth-section.module.scss';

const getUserInitial = (firstName?: string, lastName?: string) => {
  const firstInitial = firstName?.charAt(0).toUpperCase() || '';
  const lastInitial = lastName?.charAt(0).toUpperCase() || '';
  return `${firstInitial}${lastInitial}`;
};

export const NavAuthSection = () => {
  const user = useAuthStore((state) => state.currentUser);
  const status = useAuthStore((state) => state.status);

  const handleLogout = () => nextApi.auth.logout();

  if (status !== 'authenticated' || !user) {
    return (
      <div className={styles.navAuthGroup}>
        <Link href='/login' className={styles.navBtnGhost}>
          Log in
        </Link>
        <Link href='/signup' className={styles.navBtnPrimary}>
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.navAvatarGroup}>
      <Link href='/profile' className={styles.navAvatarBtn} aria-label='Open profile'>
        <span className={styles.navAvatarInitial}>
          {getUserInitial(user.firstName, user.lastName)}
        </span>
      </Link>
      <button type='button' className={styles.navBtnGhost} onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
};
