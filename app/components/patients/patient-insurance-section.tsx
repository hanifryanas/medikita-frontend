'use client';

import { SubmitButton } from '@/app/components/common';
import { usePatientInsuranceForm } from '@/lib/hooks';
import { usePatientInsurances } from '@/lib/stores/patient-store';
import { InsuranceProviderType } from '@/lib/types/patients';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import styles from './patient-insurance-section.module.scss';

const PROVIDER_LABELS: Record<InsuranceProviderType, string> = {
  [InsuranceProviderType.BPJS]: 'BPJS',
  [InsuranceProviderType.Prudential]: 'Prudential',
  [InsuranceProviderType.Allianz]: 'Allianz',
  [InsuranceProviderType.AXA]: 'AXA',
  [InsuranceProviderType.BNILife]: 'BNI Life',
  [InsuranceProviderType.InHealth]: 'InHealth',
  [InsuranceProviderType.FWD]: 'FWD',
  [InsuranceProviderType.Sinarmas]: 'Sinarmas',
  [InsuranceProviderType.Other]: 'Other',
};

const PROVIDER_OPTIONS = Object.values(InsuranceProviderType).map((value) => ({
  value,
  label: PROVIDER_LABELS[value],
}));

interface PatientInsuranceSectionProps {
  patientId: string;
  accessToken: string | null | undefined;
  /** Disable interaction (e.g. while parent has another flow active). */
  disabled?: boolean;
}

export const PatientInsuranceSection = ({
  patientId,
  accessToken,
  disabled = false,
}: PatientInsuranceSectionProps) => {
  const insurances = usePatientInsurances(patientId);
  const form = usePatientInsuranceForm({ accessToken, patientId });

  return (
    <section className={styles.section} aria-label='Patient insurance'>
      <header className={styles.header}>
        <h3 className={styles.title}>Insurance</h3>
        {!form.isOpen && (
          <button
            type='button'
            className={styles.addBtn}
            onClick={form.open}
            disabled={disabled || !accessToken}
          >
            <Plus size={14} aria-hidden='true' />
            Add
          </button>
        )}
      </header>

      {insurances.length === 0 ? (
        !form.isOpen && <p className={styles.empty}>No insurance on file.</p>
      ) : (
        <ul className={styles.list}>
          {insurances.map((insurance) => (
            <li key={insurance.patientInsuranceId} className={styles.row}>
              <div className={styles.rowMain}>
                <span className={styles.providerBadge}>
                  {PROVIDER_LABELS[insurance.insuranceProvider]}
                </span>
                <span className={styles.policyNumber}>{insurance.policyNumber}</span>
              </div>
              <div className={styles.rowActions}>
                <button
                  type='button'
                  className={`${styles.iconBtn} ${styles.iconBtnDestructive}`}
                  onClick={() => form.remove(insurance)}
                  disabled={disabled || form.deletingId === insurance.patientInsuranceId}
                  aria-label={`Remove ${PROVIDER_LABELS[insurance.insuranceProvider]} policy`}
                >
                  <Trash2 size={14} aria-hidden='true' />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {form.isOpen && (
        <InsuranceForm
          initialValues={form.initialValues()}
          isSubmitting={form.isSubmitting}
          error={form.error}
          onSubmit={form.submit}
          onCancel={form.close}
        />
      )}
    </section>
  );
};

interface InsuranceFormProps {
  initialValues: { insuranceProvider: InsuranceProviderType; policyNumber: string };
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (payload: {
    insuranceProvider: InsuranceProviderType;
    policyNumber: string;
  }) => Promise<void> | void;
  onCancel: () => void;
}

const InsuranceForm = ({
  initialValues,
  isSubmitting,
  error,
  onSubmit,
  onCancel,
}: InsuranceFormProps) => {
  const [provider, setProvider] = useState<InsuranceProviderType>(initialValues.insuranceProvider);
  const [policyNumber, setPolicyNumber] = useState(initialValues.policyNumber);
  const [touched, setTouched] = useState(false);

  const trimmed = policyNumber.trim();
  const policyError = touched && !trimmed ? 'Policy number is required.' : null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(true);
    if (!trimmed || isSubmitting) return;
    void onSubmit({ insuranceProvider: provider, policyNumber: trimmed });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {error && <div className={styles.errorBox}>{error}</div>}

      <div className={styles.field}>
        <label htmlFor='insuranceProvider' className={styles.label}>
          Provider
        </label>
        <select
          id='insuranceProvider'
          className={styles.input}
          value={provider}
          onChange={(e) => setProvider(e.target.value as InsuranceProviderType)}
          disabled={isSubmitting}
        >
          {PROVIDER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor='policyNumber' className={styles.label}>
          Policy number
        </label>
        <input
          id='policyNumber'
          type='text'
          maxLength={40}
          className={`${styles.input} ${policyError ? styles.inputError : ''}`}
          value={policyNumber}
          onChange={(e) => setPolicyNumber(e.target.value)}
          onBlur={() => setTouched(true)}
          disabled={isSubmitting}
        />
        {policyError && <span className={styles.errorMsg}>{policyError}</span>}
      </div>

      <div className={styles.actions}>
        <button
          type='button'
          className={styles.cancelBtn}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <SubmitButton isLoading={isSubmitting} loadingLabel='Saving…'>
          Add insurance
        </SubmitButton>
      </div>
    </form>
  );
};
