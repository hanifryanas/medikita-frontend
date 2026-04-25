'use client';

import { nextApi } from '@/lib/api/next';
import { AuthStatus, useAuthStore } from '@/lib/stores';
import Link from 'next/link';
import styles from './nav-auth-section.module.scss';

const getUserInitial = (firstName?: string, lastName?: string) => {
  const firstInitial = firstName?.charAt(0).toUpperCase() || '';
  const lastInitial = lastName?.charAt(0).toUpperCase() || '';
  return `${firstInitial}${lastInitial}`;
};

export const NavAuthSection = () => {
  const user = useAuthStore((state) => state.currentUser);
  const status = useAuthStore((state) => state.status);
  const signout = useAuthStore((state) => state.signout);

  const handleSignout = async () => {
    await nextApi.auth.signout();
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
