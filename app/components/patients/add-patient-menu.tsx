'use client';

import { useDismiss } from '@/lib/hooks';
import { useCallback, useRef, useState } from 'react';
import styles from './add-patient-menu.module.scss';

export interface AddPatientMenuItem {
  key: string;
  title: string;
  hint?: string;
  onSelect: () => void;
}

interface AddPatientMenuProps {
  items: AddPatientMenuItem[];
  disabled?: boolean;
  label?: string;
}

export const AddPatientMenu = ({ items, disabled, label = 'Add patient' }: AddPatientMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useDismiss(
    ref,
    isOpen,
    useCallback(() => setIsOpen(false), [])
  );

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        type='button'
        className={`${styles.trigger}`}
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={disabled}
        aria-haspopup='menu'
        aria-expanded={isOpen}
      >
        {label}
        <span className={styles.caret} aria-hidden>
          ▾
        </span>
      </button>
      {isOpen && (
        <ul className={styles.menu} role='menu'>
          {items.map((item) => (
            <li key={item.key} role='none'>
              <button
                type='button'
                role='menuitem'
                className={styles.item}
                onClick={() => {
                  setIsOpen(false);
                  item.onSelect();
                }}
              >
                <span className={styles.itemTitle}>{item.title}</span>
                {item.hint && <span className={styles.itemHint}>{item.hint}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
