'use client';

import { Avatar } from '@/app/components/common';
import { nextApi } from '@/lib/api/next';
import { getAccountRoleLabel } from '@/lib/navigation';
import { stores, useStores } from '@/lib/stores';
import { AuthStatus } from '@/lib/types/auth';
import { formatFullName } from '@/lib/utils/formatters';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import styles from './nav-auth-section.module.scss';

const APP_PATH_PREFIXES = [
  '/dashboard',
  '/patients',
  '/appointments',
  '/schedule',
  '/employees',
  '/profile',
];

export const NavAuthSection = () => {
  const {
    authStore: { status, currentUser: user, signout },
  } = useStores();
  const pathname = usePathname();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isMenuOpen]);

  const handleSignout = async () => {
    setIsMenuOpen(false);
    const isOnPrivatePage = APP_PATH_PREFIXES.some((p) => pathname.startsWith(p));
    try {
      await nextApi.auth.signout();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign out failed.';
      stores.toast.push('error', message);
    }
    signout();
    if (isOnPrivatePage) {
      router.replace('/');
    }
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

  const fullName = formatFullName(user);
  const roleLabel = getAccountRoleLabel(user);
  const isInApp = APP_PATH_PREFIXES.some((p) => pathname.startsWith(p));

  return (
    <div className={styles.navAuthGroup}>
      {!isInApp && (
        <Link href='/dashboard' className={styles.navDashboardCta}>
          Dashboard
        </Link>
      )}
      <div className={styles.navAvatarWrapper} ref={menuRef}>
        <button
          type='button'
          className={styles.navAvatarTrigger}
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label='Open account menu'
          aria-haspopup='menu'
          aria-expanded={isMenuOpen}
        >
          <span className={styles.navUserInfo}>
            <span className={styles.navUserName}>{fullName}</span>
            <span className={styles.navUserHandle}>@{user.userName}</span>
          </span>
          <Avatar
            photoUrl={user.photoUrl}
            name={{ firstName: user.firstName, lastName: user.lastName }}
            size={40}
            className={styles.navAvatarBtn}
            imageClassName={styles.navAvatarImg}
            initialClassName={styles.navAvatarInitial}
          />
        </button>

        {isMenuOpen && (
          <div className={styles.menu} role='menu'>
            {roleLabel && (
              <>
                <div className={styles.menuHeader}>
                  <span className={styles.menuBadge}>{roleLabel}</span>
                </div>
                <div className={styles.menuDivider} />
              </>
            )}

            <Link
              href='/profile'
              className={styles.menuItem}
              role='menuitem'
              onClick={() => setIsMenuOpen(false)}
            >
              My Profile
            </Link>

            <div className={styles.menuDivider} />

            <button
              type='button'
              className={`${styles.menuItem} ${styles.menuItemDanger}`}
              role='menuitem'
              onClick={handleSignout}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
