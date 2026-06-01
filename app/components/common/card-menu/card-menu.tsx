'use client';

import { useDismiss } from '@/lib/hooks';
import { MoreVertical } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import styles from './card-menu.module.scss';

export interface CardMenuItem {
  label: string;
  onSelect: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

interface CardMenuProps {
  items: CardMenuItem[];
  ariaLabel?: string;
}

export const CardMenu = ({ items, ariaLabel = 'Open menu' }: CardMenuProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useDismiss(
    ref,
    open,
    useCallback(() => setOpen(false), [])
  );

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        type='button'
        className={styles.trigger}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup='menu'
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <MoreVertical size={16} aria-hidden='true' />
      </button>
      {open && (
        <ul className={styles.menu} role='menu'>
          {items.map((item) => (
            <li key={item.label} role='none'>
              <button
                type='button'
                role='menuitem'
                className={`${styles.item} ${item.destructive ? styles.itemDestructive : ''}`}
                disabled={item.disabled}
                onClick={() => {
                  setOpen(false);
                  item.onSelect();
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
