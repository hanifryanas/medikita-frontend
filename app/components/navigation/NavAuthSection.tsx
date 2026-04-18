'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/stores';
import styles from './NavAuthSection.module.scss';

const getUserInitial = (username?: string, email?: string) => {
  const source = username?.trim() || email?.trim() || 'M';

  return source.charAt(0).toUpperCase();
};

export function NavAuthSection() {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const logout = useAuthStore((state) => state.logout);

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
        <span className={styles.navAvatarInitial}>{getUserInitial(user.username, user.email)}</span>
      </Link>
      <button type='button' className={styles.navBtnGhost} onClick={logout}>
        Log out
      </button>
    </div>
  );
}
