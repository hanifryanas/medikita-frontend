'use client';

import { useState, type InputHTMLAttributes } from 'react';
import styles from './password-input.module.scss';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Class applied to the underlying input — pass the page's shared input/error classes here. */
  inputClassName?: string;
  /** Suffix appended to the show/hide aria-label, e.g. "confirm password". Defaults to "password". */
  toggleLabel?: string;
}

export const PasswordInput = ({
  inputClassName,
  toggleLabel = 'password',
  ...inputProps
}: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={styles.passwordField}>
      <input {...inputProps} type={isVisible ? 'text' : 'password'} className={inputClassName} />
      <button
        type='button'
        className={styles.passwordToggle}
        onClick={() => setIsVisible((v) => !v)}
        aria-label={isVisible ? `Hide ${toggleLabel}` : `Show ${toggleLabel}`}
        aria-pressed={isVisible}
      >
        {isVisible ? 'Hide' : 'Show'}
      </button>
    </div>
  );
};
