'use client';

import { SubmitButton } from '@/app/components/common';
import type { Patient } from '@/lib/types/patients';
import { isDigit } from '@/lib/utils/checkers';
import { digitStringFormatter } from '@/lib/utils/formatters';
import { useState } from 'react';
import styles from './patient-form.module.scss';

export interface PatientEditPayload {
  phoneNumber: string;
  address: string;
}

interface PatientEditFormProps {
  patient: Patient;
  isSubmitting: boolean;
  submitLabel?: string;
  loadingLabel?: string;
  onSubmit: (payload: PatientEditPayload) => Promise<void> | void;
  onCancel?: () => void;
}

export const PatientEditForm = ({
  patient,
  isSubmitting,
  submitLabel = 'Save changes',
  loadingLabel = 'Saving…',
  onSubmit,
  onCancel,
}: PatientEditFormProps) => {
  const [phoneNumber, setPhoneNumber] = useState(patient.phoneNumber ?? '');
  const [address, setAddress] = useState(patient.address ?? '');
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!phoneNumber.trim()) {
      setPhoneError('Phone number is required.');
      return;
    }
    if (!isDigit(phoneNumber)) {
      setPhoneError('Phone number must contain digits only.');
      return;
    }

    setPhoneError(null);
    await onSubmit({ phoneNumber, address: address.trim() });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={`${styles.field} ${styles.fieldFull}`}>
        <label htmlFor='editPhoneNumber' className={styles.label}>
          Phone number
        </label>
        <input
          id='editPhoneNumber'
          type='tel'
          inputMode='numeric'
          maxLength={15}
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(digitStringFormatter(e.target.value))}
          className={`${styles.input} ${phoneError ? styles.inputError : ''}`}
        />
        {phoneError && <span className={styles.errorMsg}>{phoneError}</span>}
      </div>

      <div className={`${styles.field} ${styles.fieldFull}`}>
        <label htmlFor='editAddress' className={styles.label}>
          Address <span className={styles.labelHint}>(optional)</span>
        </label>
        <textarea
          id='editAddress'
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={styles.textarea}
        />
      </div>

      <div className={`${styles.actions} ${styles.fieldFull}`}>
        {onCancel && (
          <button
            type='button'
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <SubmitButton isLoading={isSubmitting} loadingLabel={loadingLabel}>
          {submitLabel}
        </SubmitButton>
      </div>
    </form>
  );
};
