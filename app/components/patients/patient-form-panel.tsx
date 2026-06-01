'use client';

import { DatePicker } from '@/app/components/common/pickers';
import type { PatientLookupType } from '@/lib/api/next/patients/lookup-patient';
import type { useLinkExistingPatient } from '@/lib/hooks/use-link-existing-patient';
import type { PatientFormState } from '@/lib/hooks/use-patient-form';
import type { CreatePatientFormPayload } from '@/lib/types/patients';
import type { UserRelationship } from '@/lib/types/users';
import { PatientCard } from './patient-card';
import { PatientEditForm, type PatientEditPayload } from './patient-edit-form';
import { PatientForm } from './patient-form';
import styles from './patient-form-panel.module.scss';

interface PatientFormPanelProps {
  state: PatientFormState;
  isSubmitting: boolean;
  error: string | null;
  selfInitialValues: Partial<CreatePatientFormPayload>;
  disabledRelationships: UserRelationship[];
  link: ReturnType<typeof useLinkExistingPatient>;
  onClose: () => void;
  onSubmitCreate: (form: CreatePatientFormPayload) => Promise<void> | void;
  onSubmitEdit: (payload: PatientEditPayload) => Promise<void> | void;
}

export const PatientFormPanel = ({
  state,
  isSubmitting,
  error,
  selfInitialValues,
  disabledRelationships,
  link,
  onClose,
  onSubmitCreate,
  onSubmitEdit,
}: PatientFormPanelProps) => {
  if (state.kind === 'closed') return null;

  const isLinkingExisting = state.kind === 'add' && state.mode === 'existing';
  const isAddSelf = state.kind === 'add' && state.mode === 'self';
  const isAddNew = state.kind === 'add' && state.mode === 'new';

  const title = isAddSelf
    ? 'Add yourself as a patient'
    : isLinkingExisting
      ? 'Link an existing patient'
      : state.kind === 'edit'
        ? `Edit ${state.patient.firstName}`
        : 'Add a new patient';

  const hint = isAddSelf
    ? 'Your account details have been prefilled — review and submit.'
    : isLinkingExisting
      ? link.result
        ? 'Verify the patient details below, then confirm to link them to your account.'
        : 'Choose an identifier and enter the patient’s date of birth to find them.'
      : state.kind === 'edit'
        ? 'Only phone number and address can be updated here.'
        : 'Fill in the details of the person you want to add.';

  return (
    <section className={styles.panel} aria-label='Patient form'>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.hint}>{hint}</p>
      </div>

      {isLinkingExisting ? (
        link.result ? (
          <div className={styles.lookupPreview}>
            {link.error && <div className={styles.errorBox}>{link.error}</div>}
            <PatientCard patient={link.result} />
            <div className={styles.linkActions}>
              <button
                type='button'
                className={styles.actionBtn}
                onClick={link.clearResult}
                disabled={link.isLinking}
              >
                Search again
              </button>
              <button
                type='button'
                className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                onClick={link.confirm}
                disabled={link.isLinking}
              >
                {link.isLinking ? 'Linking…' : 'Confirm & link'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {link.error && <div className={styles.errorBox}>{link.error}</div>}
            <form className={styles.linkForm} onSubmit={link.lookup}>
              <div className={styles.linkField}>
                <label htmlFor='lookupValue' className={styles.linkLabel}>
                  {link.type === 'mrn' ? 'Medical record number' : 'Identity number'}
                </label>
                <div className={styles.lookupCombo}>
                  <select
                    className={styles.lookupTypeSelect}
                    value={link.type}
                    onChange={(e) => link.setType(e.target.value as PatientLookupType)}
                    disabled={link.isLookingUp}
                    aria-label='Identifier type'
                  >
                    <option value='mrn'>MRN</option>
                    <option value='identityNumber'>Identity</option>
                  </select>
                  <input
                    id='lookupValue'
                    type='text'
                    className={styles.linkInput}
                    value={link.value}
                    onChange={(e) => link.setValue(e.target.value)}
                    disabled={link.isLookingUp}
                    placeholder={link.type === 'mrn' ? 'e.g. 202605000151' : 'National ID'}
                  />
                </div>
              </div>
              <div className={styles.linkField}>
                <label htmlFor='lookupDob' className={styles.linkLabel}>
                  Date of birth
                </label>
                <DatePicker
                  id='lookupDob'
                  value={link.dateOfBirth}
                  onChange={link.setDateOfBirth}
                  disabled={link.isLookingUp}
                />
              </div>
              <p className={styles.linkHint}>
                Both fields must match to confirm the patient’s identity.
              </p>
              <div className={styles.linkActions}>
                <button
                  type='button'
                  className={styles.actionBtn}
                  onClick={onClose}
                  disabled={link.isLookingUp}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                  disabled={link.isLookingUp}
                >
                  {link.isLookingUp ? 'Searching…' : 'Find patient'}
                </button>
              </div>
            </form>
          </>
        )
      ) : (
        <>
          {error && <div className={styles.errorBox}>{error}</div>}
          {state.kind === 'edit' ? (
            <PatientEditForm
              key={state.patient.patientId}
              patient={state.patient}
              isSubmitting={isSubmitting}
              onSubmit={onSubmitEdit}
              onCancel={onClose}
            />
          ) : (
            <PatientForm
              key={isAddSelf ? 'add-self' : 'add-new'}
              initialValues={isAddSelf ? selfInitialValues : undefined}
              lockRelationshipToSelf={isAddSelf}
              disabledRelationships={isAddNew ? disabledRelationships : []}
              isSubmitting={isSubmitting}
              submitLabel={isAddSelf ? 'Confirm and add' : 'Add patient'}
              onSubmit={onSubmitCreate}
              onCancel={onClose}
            />
          )}
        </>
      )}
    </section>
  );
};
