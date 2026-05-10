import { Spinner } from '@/app/components/loading';
import React from 'react';
import styles from './submit-button.module.scss';

type SubmitButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  isLoading?: boolean;
  loadingLabel?: string;
  variant?: 'primary' | 'secondary';
};

export const SubmitButton = ({
  isLoading = false,
  loadingLabel,
  variant = 'primary',
  disabled,
  className,
  children,
  ...rest
}: SubmitButtonProps) => {
  const variantClass = variant === 'secondary' ? styles.secondary : styles.primary;

  return (
    <button
      {...rest}
      type='submit'
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={`${styles.button} ${variantClass} ${className ?? ''}`}
    >
      {isLoading ? (
        <span className={styles.loading}>
          {loadingLabel ?? children}
          <Spinner size={14} />
        </span>
      ) : (
        children
      )}
    </button>
  );
};
