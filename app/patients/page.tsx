'use client';

import type { CardMenuItem } from '@/app/components/common';
import { DatePicker } from '@/app/components/common/pickers';
import { AccountShell } from '@/app/components/layout';
import type { PatientEditPayload } from '@/app/components/patients';
import { PatientCard, PatientEditForm, PatientForm } from '@/app/components/patients';
import { nextApi } from '@/lib/api/next';
import type { PatientLookupType } from '@/lib/api/next/patients/lookup-patient';
import {
  useDismiss,
  useLinkExistingPatient,
  useReorderPatients,
  useRequireAuth,
} from '@/lib/hooks';
import { useStores } from '@/lib/stores';
import { AuthStatus } from '@/lib/types/auth';
import type { CreatePatientFormPayload, Patient } from '@/lib/types/patients';
import { UserRelationship } from '@/lib/types/users';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './page.module.scss';

type EditMode = 'closed' | 'add-self' | 'add-new' | 'add-existing' | 'edit';

export default function PatientsPage() {
  const status = useRequireAuth();
  const {
    authStore: { accessToken, currentUser },
    patientStore: {
      patientMap,
      isLoaded,
      isLoading,
      loadError,
      setIsLoading,
      setLoadError,
      setPatients,
      removePatient,
    },
  } = useStores();

  const [editMode, setEditMode] = useState<EditMode>('closed');
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [unlinkingId, setUnlinkingId] = useState<string | null>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);

  const loadPatients = useCallback(async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await nextApi.patients.getMyPatients(accessToken);
      setPatients(data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load patients.');
      setIsLoading(false);
    }
  }, [accessToken, setIsLoading, setLoadError, setPatients]);

  useEffect(() => {
    if (status !== AuthStatus.Authenticated || !accessToken) return;
    loadPatients();
  }, [status, accessToken, loadPatients]);

  useDismiss(
    addMenuRef,
    isAddMenuOpen,
    useCallback(() => setIsAddMenuOpen(false), [])
  );

  const hasSelfPatient = useMemo(
    () => Array.from(patientMap.values()).some((p) => p.relationship === UserRelationship.Self),
    [patientMap]
  );
  const selfPatient = useMemo(
    () =>
      Array.from(patientMap.values()).find((p) => p.relationship === UserRelationship.Self) ?? null,
    [patientMap]
  );
  const otherPatients = useMemo(
    () =>
      Array.from(patientMap.values())
        .filter((p) => p.relationship !== UserRelationship.Self)
        .sort((a, b) => (a.ordinal ?? 0) - (b.ordinal ?? 0)),
    [patientMap]
  );
  const patientCount = patientMap.size;

  const reorder = useReorderPatients({
    accessToken,
    selfPatientId: selfPatient?.patientId ?? null,
    others: otherPatients,
    onSaved: loadPatients,
  });

  const link = useLinkExistingPatient({
    accessToken,
    onLinked: async () => {
      await loadPatients();
      closeEdit();
    },
  });

  if (status !== AuthStatus.Authenticated || !currentUser) return null;

  const isAddingPatient = editMode !== 'closed';
  const isLinkingExisting = editMode === 'add-existing';
  const isIdle = editMode === 'closed' && !reorder.isActive;

  const closeEdit = () => {
    setEditMode('closed');
    setEditingPatient(null);
    setSubmitError(null);
    link.reset();
  };

  const openAddMode = (mode: Exclude<EditMode, 'closed'>) => {
    setIsAddMenuOpen(false);
    setEditMode(mode);
  };

  const handleSubmit = async (formValues: CreatePatientFormPayload) => {
    if (!accessToken) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        relationship: formValues.relationship,
        identityNumber: formValues.identityNumber,
        firstName: formValues.firstName,
        lastName: formValues.lastName?.trim() ?? '',
        gender: formValues.gender,
        phoneNumber: formValues.phoneNumber,
        dateOfBirth: formValues.dateOfBirth,
        ...(formValues.address.trim() ? { address: formValues.address.trim() } : {}),
      };
      await nextApi.patients.createPatient({ accessToken, payload });
      await loadPatients();
      closeEdit();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save patient.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (payload: PatientEditPayload) => {
    if (!accessToken || !editingPatient) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await nextApi.patients.updatePatient({
        accessToken,
        patientId: editingPatient.patientId,
        payload: {
          phoneNumber: payload.phoneNumber,
          ...(payload.address ? { address: payload.address } : { address: '' }),
        },
      });
      await loadPatients();
      closeEdit();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to update patient.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setSubmitError(null);
    setEditMode('edit');
  };

  const handleUnlinkPatient = async (patient: Patient) => {
    if (!accessToken) return;
    const fullName = `${patient.firstName} ${patient.lastName}`.trim();
    if (!confirm(`Remove ${fullName} from your patients?`)) return;
    setUnlinkingId(patient.patientId);
    try {
      await nextApi.patients.unlinkPatient({
        accessToken,
        patientId: patient.patientId,
      });
      removePatient(patient.patientId);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to remove patient.');
    } finally {
      setUnlinkingId(null);
    }
  };

  const selfInitialValues: Partial<CreatePatientFormPayload> = {
    relationship: UserRelationship.Self,
    identityNumber: currentUser.identityNumber,
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    gender: currentUser.gender,
    phoneNumber: currentUser.phoneNumber,
    dateOfBirth: currentUser.dateOfBirth,
    address: currentUser.address ?? '',
  };

  const disabledRelationships = hasSelfPatient ? [UserRelationship.Self] : [];
  const canReorder = otherPatients.length >= 2;
  const displayedOthers = reorder.isActive ? reorder.draft : otherPatients;

  const formTitle =
    editMode === 'add-self'
      ? 'Add yourself as a patient'
      : editMode === 'add-existing'
        ? 'Link an existing patient'
        : editMode === 'edit'
          ? `Edit ${editingPatient?.firstName ?? 'patient'}`
          : 'Add a new patient';

  const formHint =
    editMode === 'add-self'
      ? 'Your account details have been prefilled — review and submit.'
      : editMode === 'add-existing'
        ? link.result
          ? 'Verify the patient details below, then confirm to link them to your account.'
          : 'Choose an identifier and enter the patient’s date of birth to find them.'
        : editMode === 'edit'
          ? 'Only phone number and address can be updated here.'
          : 'Fill in the details of the person you want to add.';

  const buildMenuItems = (patient: Patient): CardMenuItem[] => {
    const isUnlinking = unlinkingId === patient.patientId;
    return [
      {
        label: 'Edit',
        onSelect: () => handleEditPatient(patient),
        disabled: !isIdle || isUnlinking,
      },
      {
        label: isUnlinking ? 'Removing…' : 'Remove from my list',
        onSelect: () => handleUnlinkPatient(patient),
        destructive: true,
        disabled: !isIdle || isUnlinking,
      },
    ];
  };

  return (
    <AccountShell>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <span className={styles.eyebrow}>Patients</span>
          <h1 className={styles.heading}>Your patient profiles</h1>
          <p className={styles.subtitle}>
            Manage the people you book appointments for — including yourself and your family.
          </p>
        </div>
        <div className={styles.headerActions}>
          {reorder.isActive ? (
            <>
              <button
                type='button'
                className={styles.actionBtn}
                onClick={reorder.cancel}
                disabled={reorder.isSaving}
              >
                Cancel
              </button>
              <button
                type='button'
                className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                onClick={reorder.save}
                disabled={reorder.isSaving}
              >
                {reorder.isSaving ? 'Saving…' : 'Save order'}
              </button>
            </>
          ) : (
            <>
              {canReorder && (
                <button
                  type='button'
                  className={styles.actionBtn}
                  onClick={reorder.start}
                  disabled={!isIdle}
                >
                  Reorder
                </button>
              )}
              <div className={styles.addMenuWrapper} ref={addMenuRef}>
                <button
                  type='button'
                  className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                  onClick={() => setIsAddMenuOpen((prev) => !prev)}
                  disabled={!isIdle}
                  aria-haspopup='menu'
                  aria-expanded={isAddMenuOpen}
                >
                  Add patient
                  <span className={styles.caret} aria-hidden>
                    ▾
                  </span>
                </button>
                {isAddMenuOpen && (
                  <ul className={styles.addMenu} role='menu'>
                    {!hasSelfPatient && (
                      <li role='none'>
                        <button
                          type='button'
                          role='menuitem'
                          className={styles.addMenuItem}
                          onClick={() => openAddMode('add-self')}
                        >
                          <span className={styles.addMenuItemTitle}>Add me as a patient</span>
                          <span className={styles.addMenuItemHint}>
                            Prefilled from your account
                          </span>
                        </button>
                      </li>
                    )}
                    <li role='none'>
                      <button
                        type='button'
                        role='menuitem'
                        className={styles.addMenuItem}
                        onClick={() => openAddMode('add-new')}
                      >
                        <span className={styles.addMenuItemTitle}>Add new patient</span>
                        <span className={styles.addMenuItemHint}>Create a new profile</span>
                      </button>
                    </li>
                    <li role='none'>
                      <button
                        type='button'
                        role='menuitem'
                        className={styles.addMenuItem}
                        onClick={() => openAddMode('add-existing')}
                      >
                        <span className={styles.addMenuItemTitle}>Add existing patient</span>
                        <span className={styles.addMenuItemHint}>Link by MRN or identity</span>
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      {isAddingPatient && (
        <section className={styles.formPanel} aria-label='Add patient form'>
          <div className={styles.formPanelHeader}>
            <h2 className={styles.formTitle}>{formTitle}</h2>
            <p className={styles.formHint}>{formHint}</p>
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
                      onClick={closeEdit}
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
              {submitError && <div className={styles.errorBox}>{submitError}</div>}
              {editMode === 'edit' && editingPatient ? (
                <PatientEditForm
                  key={editingPatient.patientId}
                  patient={editingPatient}
                  isSubmitting={isSubmitting}
                  onSubmit={handleEditSubmit}
                  onCancel={closeEdit}
                />
              ) : (
                <PatientForm
                  key={editMode}
                  initialValues={editMode === 'add-self' ? selfInitialValues : undefined}
                  lockRelationshipToSelf={editMode === 'add-self'}
                  disabledRelationships={editMode === 'add-new' ? disabledRelationships : []}
                  isSubmitting={isSubmitting}
                  submitLabel={editMode === 'add-self' ? 'Confirm and add' : 'Add patient'}
                  onSubmit={handleSubmit}
                  onCancel={closeEdit}
                />
              )}
            </>
          )}
        </section>
      )}

      <section className={styles.listSection} aria-label='Patient list'>
        {isLoading || !isLoaded ? (
          <div className={styles.placeholder}>Loading patients…</div>
        ) : loadError ? (
          <div className={styles.errorBox}>{loadError}</div>
        ) : patientCount === 0 ? (
          <div className={styles.placeholder}>
            You don&apos;t have any patient profiles yet. Add yourself or a family member to get
            started.
          </div>
        ) : (
          <>
            {reorder.isActive && (
              <p className={styles.reorderHint}>
                Use the arrows to rearrange your patients. &ldquo;Self&rdquo; stays pinned to the
                top.
              </p>
            )}
            {reorder.error && <div className={styles.errorBox}>{reorder.error}</div>}
            <div className={styles.grid}>
              {selfPatient && (
                <PatientCard
                  key={selfPatient.patientId}
                  patient={selfPatient}
                  menuItems={reorder.isActive ? undefined : buildMenuItems(selfPatient)}
                />
              )}
              {displayedOthers.map((patient, index) => (
                <PatientCard
                  key={patient.patientId}
                  patient={patient}
                  reorderControls={
                    reorder.isActive
                      ? {
                          canMoveUp: index > 0,
                          canMoveDown: index < displayedOthers.length - 1,
                          onMoveUp: () => reorder.move(index, -1),
                          onMoveDown: () => reorder.move(index, 1),
                        }
                      : undefined
                  }
                  menuItems={reorder.isActive ? undefined : buildMenuItems(patient)}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </AccountShell>
  );
}
