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

type FormMode = 'closed' | 'add-self' | 'add-other';

export default function PatientsPage() {
  const status = useRequireAuth();
  const {
    authStore: { accessToken, currentUser },
  } = useStores();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<FormMode>('closed');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const sortedPatients = useMemo(
    () =>
      [...patients].sort((a, b) => {
        if (a.relationship === UserRelationship.Self) return -1;
        if (b.relationship === UserRelationship.Self) return 1;
        return (a.ordinal ?? 0) - (b.ordinal ?? 0);
      }),
    [patients]
  );

  if (status !== AuthStatus.Authenticated || !currentUser) return null;

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
      setFormMode('closed');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create patient.');
    } finally {
      setIsSubmitting(false);
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
          {!hasSelfPatient && (
            <button
              type='button'
              className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
              onClick={() => setFormMode('add-self')}
              disabled={formMode !== 'closed'}
            >
              Add me as a patient
            </button>
          )}
          <button
            type='button'
            className={styles.actionBtn}
            onClick={() => setFormMode('add-other')}
            disabled={formMode !== 'closed'}
          >
            Add new patient
          </button>
        </div>
      </header>

      {formMode !== 'closed' && (
        <section className={styles.formPanel} aria-label='Add patient form'>
          <div className={styles.formPanelHeader}>
            <h2 className={styles.formTitle}>
              {formMode === 'add-self' ? 'Add yourself as a patient' : 'Add a new patient'}
            </h2>
            <p className={styles.formHint}>
              {formMode === 'add-self'
                ? 'Your account details have been prefilled — review and submit.'
                : 'Fill in the details of the person you want to add.'}
            </p>
          </div>
          {submitError && <div className={styles.errorBox}>{submitError}</div>}
          <PatientForm
            key={formMode}
            initialValues={formMode === 'add-self' ? selfInitialValues : undefined}
            lockRelationshipToSelf={formMode === 'add-self'}
            disabledRelationships={formMode === 'add-other' ? disabledRelationships : []}
            isSubmitting={isSubmitting}
            submitLabel={formMode === 'add-self' ? 'Confirm and add' : 'Add patient'}
            onSubmit={handleSubmit}
            onCancel={() => {
              setFormMode('closed');
              setSubmitError(null);
            }}
          />
        </section>
      )}

      <section className={styles.listSection} aria-label='Patient list'>
        {isLoading ? (
          <div className={styles.placeholder}>Loading patients…</div>
        ) : loadError ? (
          <div className={styles.errorBox}>{loadError}</div>
        ) : sortedPatients.length === 0 ? (
          <div className={styles.placeholder}>
            You don&apos;t have any patient profiles yet. Add yourself or a family member to get
            started.
          </div>
        ) : (
          <div className={styles.grid}>
            {sortedPatients.map((patient) => (
              <PatientCard key={patient.patientId} patient={patient} />
            ))}
          </div>
        )}
      </section>
    </AccountShell>
  );
}
