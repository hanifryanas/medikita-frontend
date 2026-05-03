'use client';

import { nextApi } from '@/lib/api/next';
import { AuthStatus, useAuthStore } from '@/lib/stores';
import { getUserInitial } from '@/lib/utils/formatters';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import styles from './nav-auth-section.module.scss';

export const NavAuthSection = () => {
  const user = useAuthStore((state) => state.currentUser);
  const status = useAuthStore((state) => state.status);
  const signout = useAuthStore((state) => state.signout);

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

  const fullName = `${user.firstName} ${user.lastName}`.trim();

  return (
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
        <span className={styles.navAvatarBtn} aria-hidden='true'>
          <span className={styles.navAvatarInitial}>
            {getUserInitial(user.firstName, user.lastName)}
          </span>
        </span>
      </button>

      {isMenuOpen && (
        <div className={styles.menu} role='menu'>
          {user.isEmployee && (
            <>
              <div className={styles.menuHeader}>
                <span className={styles.menuBadge}>Employee</span>
              </div>
              <div className={styles.menuDivider} />
            </>
          )}

          <Link
            href='/dashboard'
            className={styles.menuItem}
            role='menuitem'
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href='/profile'
            className={styles.menuItem}
            role='menuitem'
            onClick={() => setIsMenuOpen(false)}
          >
            Profile
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
  );
};
