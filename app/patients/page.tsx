'use client';

import { AccountShell } from '@/app/components/layout';
import { PatientCard, PatientForm } from '@/app/components/patients';
import { nextApi } from '@/lib/api/next';
import { useRequireAuth } from '@/lib/hooks';
import { useStores } from '@/lib/stores';
import { AuthStatus } from '@/lib/types/auth';
import type { CreatePatientFormPayload, Patient } from '@/lib/types/patients';
import { UserRelationship } from '@/lib/types/users';
import { useEffect, useMemo, useState } from 'react';
import styles from './page.module.scss';

type EditMode = 'closed' | 'add-self' | 'add-other' | 'reorder';

export default function PatientsPage() {
  const status = useRequireAuth();
  const {
    authStore: { accessToken, currentUser },
  } = useStores();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<EditMode>('closed');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reorderDraft, setReorderDraft] = useState<Patient[]>([]);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [reorderError, setReorderError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== AuthStatus.Authenticated || !accessToken) return;
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const data = await nextApi.patients.getMyPatients(accessToken);
        if (!cancelled) setPatients(data);
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : 'Failed to load patients.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, accessToken]);

  const hasSelfPatient = useMemo(
    () => patients.some((p) => p.relationship === UserRelationship.Self),
    [patients]
  );

  const selfPatient = useMemo(
    () => patients.find((p) => p.relationship === UserRelationship.Self) ?? null,
    [patients]
  );

  const otherPatients = useMemo(
    () =>
      patients
        .filter((p) => p.relationship !== UserRelationship.Self)
        .sort((a, b) => (a.ordinal ?? 0) - (b.ordinal ?? 0)),
    [patients]
  );

  const isReordering = editMode === 'reorder';
  const isAddingPatient = editMode === 'add-self' || editMode === 'add-other';
  const isIdle = editMode === 'closed';
  const displayedOthers = isReordering ? reorderDraft : otherPatients;

  if (status !== AuthStatus.Authenticated || !currentUser) return null;

  const closeEdit = () => {
    setEditMode('closed');
    setSubmitError(null);
    setReorderError(null);
    setReorderDraft([]);
  };

  const handleSubmit = async (formValues: CreatePatientFormPayload) => {
    if (!accessToken) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await nextApi.patients.createPatient({
        accessToken,
        payload: {
          relationship: formValues.relationship,
          identityNumber: formValues.identityNumber,
          firstName: formValues.firstName,
          lastName: formValues.lastName?.trim() ?? '',
          gender: formValues.gender,
          phoneNumber: formValues.phoneNumber,
          dateOfBirth: formValues.dateOfBirth,
          ...(formValues.address.trim() ? { address: formValues.address.trim() } : {}),
        },
      });
      const refreshed = await nextApi.patients.getMyPatients(accessToken);
      setPatients(refreshed);
      closeEdit();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create patient.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startReorder = () => {
    setReorderDraft(otherPatients);
    setReorderError(null);
    setEditMode('reorder');
  };

  const moveDraft = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= reorderDraft.length) return;
    setReorderDraft((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const saveReorder = async () => {
    if (!accessToken) return;
    setIsSavingOrder(true);
    setReorderError(null);
    try {
      await nextApi.patients.reorderMyPatients({
        accessToken,
        patientIds: [
          ...(selfPatient ? [selfPatient.patientId] : []),
          ...reorderDraft.map((p) => p.patientId),
        ],
      });
      const refreshed = await nextApi.patients.getMyPatients(accessToken);
      setPatients(refreshed);
      closeEdit();
    } catch (err) {
      setReorderError(err instanceof Error ? err.message : 'Failed to save new order.');
    } finally {
      setIsSavingOrder(false);
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
          {isReordering ? (
            <>
              <button
                type='button'
                className={styles.actionBtn}
                onClick={closeEdit}
                disabled={isSavingOrder}
              >
                Cancel
              </button>
              <button
                type='button'
                className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                onClick={saveReorder}
                disabled={isSavingOrder}
              >
                {isSavingOrder ? 'Saving…' : 'Save order'}
              </button>
            </>
          ) : (
            <>
              {canReorder && (
                <button
                  type='button'
                  className={styles.actionBtn}
                  onClick={startReorder}
                  disabled={!isIdle}
                >
                  Reorder
                </button>
              )}
              {!hasSelfPatient && (
                <button
                  type='button'
                  className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                  onClick={() => setEditMode('add-self')}
                  disabled={!isIdle}
                >
                  Add me as a patient
                </button>
              )}
              <button
                type='button'
                className={styles.actionBtn}
                onClick={() => setEditMode('add-other')}
                disabled={!isIdle}
              >
                Add new patient
              </button>
            </>
          )}
        </div>
      </header>

      {isAddingPatient && (
        <section className={styles.formPanel} aria-label='Add patient form'>
          <div className={styles.formPanelHeader}>
            <h2 className={styles.formTitle}>
              {editMode === 'add-self' ? 'Add yourself as a patient' : 'Add a new patient'}
            </h2>
            <p className={styles.formHint}>
              {editMode === 'add-self'
                ? 'Your account details have been prefilled — review and submit.'
                : 'Fill in the details of the person you want to add.'}
            </p>
          </div>
          {submitError && <div className={styles.errorBox}>{submitError}</div>}
          <PatientForm
            key={editMode}
            initialValues={editMode === 'add-self' ? selfInitialValues : undefined}
            lockRelationshipToSelf={editMode === 'add-self'}
            disabledRelationships={editMode === 'add-other' ? disabledRelationships : []}
            isSubmitting={isSubmitting}
            submitLabel={editMode === 'add-self' ? 'Confirm and add' : 'Add patient'}
            onSubmit={handleSubmit}
            onCancel={closeEdit}
          />
        </section>
      )}

      <section className={styles.listSection} aria-label='Patient list'>
        {isLoading ? (
          <div className={styles.placeholder}>Loading patients…</div>
        ) : loadError ? (
          <div className={styles.errorBox}>{loadError}</div>
        ) : patients.length === 0 ? (
          <div className={styles.placeholder}>
            You don&apos;t have any patient profiles yet. Add yourself or a family member to get
            started.
          </div>
        ) : (
          <>
            {isReordering && (
              <p className={styles.reorderHint}>
                Use the arrows to rearrange your patients. &ldquo;Self&rdquo; stays pinned to the
                top.
              </p>
            )}
            {reorderError && <div className={styles.errorBox}>{reorderError}</div>}
            <div className={styles.grid}>
              {selfPatient && <PatientCard key={selfPatient.patientId} patient={selfPatient} />}
              {displayedOthers.map((patient, index) => (
                <PatientCard
                  key={patient.patientId}
                  patient={patient}
                  reorderControls={
                    isReordering
                      ? {
                          canMoveUp: index > 0,
                          canMoveDown: index < displayedOthers.length - 1,
                          onMoveUp: () => moveDraft(index, -1),
                          onMoveDown: () => moveDraft(index, 1),
                        }
                      : undefined
                  }
                />
              ))}
            </div>
          </>
        )}
      </section>
    </AccountShell>
  );
}
