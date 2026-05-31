'use client';

import { SubmitButton } from '@/app/components/common';
import type { CreatePatientFormPayload } from '@/lib/types/patients';
import { UserGenderType, UserRelationship } from '@/lib/types/users';
import { isValidationResultValid, type FormValidationResult } from '@/lib/types/validations';
import { digitStringFormatter } from '@/lib/utils/formatters';
import { validateCreatePatientForm } from '@/lib/validations/patients';
import { useState } from 'react';
import styles from './patient-form.module.scss';

const RELATIONSHIP_OPTIONS: { value: UserRelationship; label: string }[] = [
  { value: UserRelationship.Self, label: 'Self' },
  { value: UserRelationship.Spouse, label: 'Spouse' },
  { value: UserRelationship.Child, label: 'Child' },
  { value: UserRelationship.Parent, label: 'Parent' },
  { value: UserRelationship.Sibling, label: 'Sibling' },
  { value: UserRelationship.Other, label: 'Other' },
];

const emptyForm = (): CreatePatientFormPayload => ({
  relationship: UserRelationship.Child,
  identityNumber: '',
  firstName: '',
  lastName: '',
  gender: UserGenderType.Female,
  phoneNumber: '',
  dateOfBirth: '2000-01-01',
  address: '',
});

interface PatientFormProps {
  initialValues?: Partial<CreatePatientFormPayload>;
  lockRelationshipToSelf?: boolean;
  disabledRelationships?: UserRelationship[];
  submitLabel?: string;
  loadingLabel?: string;
  isSubmitting: boolean;
  onSubmit: (payload: CreatePatientFormPayload) => Promise<void> | void;
  onCancel?: () => void;
}

export const PatientForm = ({
  initialValues,
  lockRelationshipToSelf = false,
  disabledRelationships = [],
  submitLabel = 'Add patient',
  loadingLabel = 'Saving…',
  isSubmitting,
  onSubmit,
  onCancel,
}: PatientFormProps) => {
  const [fields, setFields] = useState<CreatePatientFormPayload>(() => ({
    ...emptyForm(),
    ...(lockRelationshipToSelf ? { relationship: UserRelationship.Self } : {}),
    ...initialValues,
  }));
  const [errors, setErrors] = useState<FormValidationResult<CreatePatientFormPayload>['errors']>(
    {}
  );

  const setField = <K extends keyof CreatePatientFormPayload>(
    key: K,
    value: CreatePatientFormPayload[K]
  ) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const result = validateCreatePatientForm(fields);
    if (!isValidationResultValid(result)) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    await onSubmit(fields);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={`${styles.field} ${styles.fieldFull}`}>
        <label htmlFor='relationship' className={styles.label}>
          Relationship to you
        </label>
        <select
          id='relationship'
          value={fields.relationship}
          onChange={(e) => setField('relationship', e.target.value as UserRelationship)}
          disabled={lockRelationshipToSelf}
          className={`${styles.input} ${errors.relationship ? styles.inputError : ''}`}
        >
          {RELATIONSHIP_OPTIONS.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={disabledRelationships.includes(opt.value)}
            >
              {opt.label}
              {disabledRelationships.includes(opt.value) ? ' (already added)' : ''}
            </option>
          ))}
        </select>
        {errors.relationship && <span className={styles.errorMsg}>{errors.relationship}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor='firstName' className={styles.label}>
          First name
        </label>
        <input
          id='firstName'
          type='text'
          maxLength={25}
          value={fields.firstName}
          onChange={(e) => setField('firstName', e.target.value)}
          className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
        />
        {errors.firstName && <span className={styles.errorMsg}>{errors.firstName}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor='lastName' className={styles.label}>
          Last name
        </label>
        <input
          id='lastName'
          type='text'
          maxLength={25}
          value={fields.lastName}
          onChange={(e) => setField('lastName', e.target.value)}
          className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
        />
        {errors.lastName && <span className={styles.errorMsg}>{errors.lastName}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor='identityNumber' className={styles.label}>
          Identity number
        </label>
        <input
          id='identityNumber'
          type='text'
          inputMode='numeric'
          maxLength={20}
          value={fields.identityNumber}
          onChange={(e) => setField('identityNumber', digitStringFormatter(e.target.value))}
          className={`${styles.input} ${errors.identityNumber ? styles.inputError : ''}`}
        />
        {errors.identityNumber && <span className={styles.errorMsg}>{errors.identityNumber}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor='phoneNumber' className={styles.label}>
          Phone number
        </label>
        <input
          id='phoneNumber'
          type='tel'
          inputMode='numeric'
          maxLength={15}
          value={fields.phoneNumber}
          onChange={(e) => setField('phoneNumber', digitStringFormatter(e.target.value))}
          className={`${styles.input} ${errors.phoneNumber ? styles.inputError : ''}`}
        />
        {errors.phoneNumber && <span className={styles.errorMsg}>{errors.phoneNumber}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor='gender' className={styles.label}>
          Gender
        </label>
        <select
          id='gender'
          value={fields.gender}
          onChange={(e) => setField('gender', e.target.value as UserGenderType)}
          className={`${styles.input} ${errors.gender ? styles.inputError : ''}`}
        >
          <option value={UserGenderType.Female}>Female</option>
          <option value={UserGenderType.Male}>Male</option>
        </select>
        {errors.gender && <span className={styles.errorMsg}>{errors.gender}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor='dateOfBirth' className={styles.label}>
          Date of birth
        </label>
        <input
          id='dateOfBirth'
          type='date'
          value={fields.dateOfBirth}
          onChange={(e) => setField('dateOfBirth', e.target.value)}
          className={`${styles.input} ${errors.dateOfBirth ? styles.inputError : ''}`}
        />
        {errors.dateOfBirth && <span className={styles.errorMsg}>{errors.dateOfBirth}</span>}
      </div>

      <div className={`${styles.field} ${styles.fieldFull}`}>
        <label htmlFor='address' className={styles.label}>
          Address (optional)
        </label>
        <textarea
          id='address'
          rows={2}
          value={fields.address}
          onChange={(e) => setField('address', e.target.value)}
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
