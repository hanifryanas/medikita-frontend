'use client';

import { joinClassNames } from '@/lib/utils/class-names';
import { X } from 'lucide-react';
import { ReactNode } from 'react';
import styles from './tag.module.scss';

interface TagProps {
  label?: ReactNode;
  children: ReactNode;
  /** When provided, renders the whole tag as a toggle button. */
  onClick?: () => void;
  /** Active/pressed state — only meaningful with `onClick`. */
  active?: boolean;
  /** When provided, renders an X remove button. Ignored if `onClick` is set. */
  onRemove?: () => void;
  removeAriaLabel?: string;
  className?: string;
}

export const Tag = ({
  label,
  children,
  onClick,
  active = false,
  onRemove,
  removeAriaLabel,
  className,
}: TagProps) => {
  const classes = joinClassNames(styles.tag, active && styles.tagActive, className);

  const content = (
    <>
      {label && <span className={styles.label}>{label}</span>} {children}
    </>
  );

  // Toggle-button variant (used by chip pickers). Avoid nested <button> by
  // ignoring `onRemove` when the tag itself is interactive.
  if (onClick) {
    return (
      <button
        type='button'
        aria-pressed={active}
        className={`${classes} ${styles.tagButton}`}
        onClick={onClick}
      >
        {content}
      </button>
    );
  }

  return (
    <span className={classes}>
      {content}
      {onRemove && (
        <button
          type='button'
          className={styles.remove}
          onClick={onRemove}
          aria-label={removeAriaLabel ?? 'Remove'}
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
};
