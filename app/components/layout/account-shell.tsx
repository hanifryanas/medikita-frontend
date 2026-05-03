'use client';

import { PublicNav } from '@/app/components/navigation';
import { MenuIcon } from '@/app/icons';
import { getAccountNavItems, getAccountRoleLabel } from '@/lib/navigation';
import { useAuthStore } from '@/lib/stores';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import styles from './account-shell.module.scss';

interface AccountShellProps {
  children: ReactNode;
}

export const AccountShell = ({ children }: AccountShellProps) => {
  const user = useAuthStore((s) => s.currentUser);
  const pathname = usePathname();
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

  const navItems = user ? getAccountNavItems(user) : [];
  const roleLabel = user ? getAccountRoleLabel(user) : null;

  return (
    <div className={styles.outer}>
      <PublicNav />

      <div className={styles.shell}>
        <aside
          className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}
          aria-label='Account navigation'
        >
          {roleLabel && <span className={styles.roleBadge}>{roleLabel}</span>}

          <nav className={styles.nav}>
            <ul>
              {navItems.map((item) => {
                const isActive =
                  item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {isOpen && (
          <button
            type='button'
            className={styles.backdrop}
            aria-label='Close navigation'
            onClick={() => setIsOpen(false)}
          />
        )}

        <div className={styles.main}>
          <div className={styles.mobileBar}>
            <button
              type='button'
              className={styles.menuToggle}
              aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((v) => !v)}
            >
              <MenuIcon />
              <span>Menu</span>
            </button>
          </div>

          <main className={styles.content}>{children}</main>
        </div>
      </div>
    </div>
  );
};
