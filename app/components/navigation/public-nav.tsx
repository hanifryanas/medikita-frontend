'use client';

import { MenuIcon } from '@/app/icons';
import { PUBLIC_NAV_ITEMS } from '@/lib/navigation';
import { AuthStatus, useAuthStore } from '@/lib/stores';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NavAuthSection } from './nav-auth-section';
import styles from './public-nav.module.scss';

interface PublicNavProps {
  className?: string;
}

const ACCOUNT_PATH_PREFIXES = [
  '/dashboard',
  '/patients',
  '/appointments',
  '/schedule',
  '/employees',
  '/profile',
  '/settings',
];

export const PublicNav = ({ className }: PublicNavProps) => {
  const pathname = usePathname();
  const status = useAuthStore((s) => s.status);
  const isAuthenticated = status === AuthStatus.Authenticated;
  const isAccountRoute = ACCOUNT_PATH_PREFIXES.some((p) => pathname.startsWith(p));
  const showSidebarBlend = isAuthenticated && isAccountRoute;
  const [isOpen, setIsOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  if (lastPath !== pathname) {
    setLastPath(pathname);
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  return (
    <nav className={`${styles.nav} ${className ?? ''}`}>
      <div className={styles.container}>
        <Link href='/' className={`${styles.logo} ${showSidebarBlend ? styles.logoAuth : ''}`}>
          <span className={styles.logoMark}>✚</span>
          MediKita
        </Link>

        <ul className={`${styles.links} ${isOpen ? styles.linksOpen : ''}`}>
          {PUBLIC_NAV_ITEMS.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={isActive ? styles.linkActive : undefined}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className={styles.actions}>
          <NavAuthSection />
          <button
            type='button'
            className={styles.toggle}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((v) => !v)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>
    </nav>
  );
};
