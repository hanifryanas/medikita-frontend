'use client';

import type { CardMenuItem } from '@/app/components/common';
import { AccountShell } from '@/app/components/layout';
import {
  AddPatientMenu,
  type AddPatientMenuItem,
  PatientCard,
  PatientFormPanel,
} from '@/app/components/patients';
import {
  useLinkExistingPatient,
  usePatientForm,
  useReorderPatients,
  useRequireAuth,
  useUnlinkPatient,
} from '@/lib/hooks';
import { useStores } from '@/lib/stores';
import { AuthStatus } from '@/lib/types/auth';
import type { CreatePatientFormPayload, Patient } from '@/lib/types/patients';
import { UserRelationship } from '@/lib/types/users';
import { useMemo } from 'react';
import styles from './page.module.scss';

export default function PatientsPage() {
  const status = useRequireAuth();
  const {
    authStore: { accessToken, currentUser },
    patientStore: { patientMap, isLoaded, isLoading, loadError, fetchPatients },
  } = useStores();

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

  const refresh = () => (accessToken ? fetchPatients(accessToken) : Promise.resolve());

  const form = usePatientForm({ accessToken, onChanged: refresh });
  const reorder = useReorderPatients({
    accessToken,
    selfPatientId: selfPatient?.patientId ?? null,
    others: otherPatients,
    onSaved: refresh,
  });
  const link = useLinkExistingPatient({
    accessToken,
    onLinked: async () => {
      await refresh();
      form.close();
    },
  });
  const unlink = useUnlinkPatient({ accessToken });

  const closePanel = () => {
    form.close();
    link.reset();
  };

  if (status !== AuthStatus.Authenticated || !currentUser) return null;

  const isIdle = !form.isOpen && !reorder.isActive;
  const canReorder = otherPatients.length >= 2;
  const displayedOthers = reorder.isActive ? reorder.draft : otherPatients;

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

  const addMenuItems: AddPatientMenuItem[] = [
    ...(!hasSelfPatient
      ? [
          {
            key: 'self',
            title: 'Add me as a patient',
            hint: 'Prefilled from your account',
            onSelect: () => form.openAdd('self'),
          },
        ]
      : []),
    {
      key: 'new',
      title: 'Add new patient',
      hint: 'Create a new profile',
      onSelect: () => form.openAdd('new'),
    },
    {
      key: 'existing',
      title: 'Add existing patient',
      hint: 'Link by MRN or identity',
      onSelect: () => form.openAdd('existing'),
    },
  ];

  const buildMenuItems = (patient: Patient): CardMenuItem[] => {
    const isUnlinking = unlink.unlinkingId === patient.patientId;
    return [
      {
        label: 'Edit',
        onSelect: () => form.openEdit(patient),
        disabled: !isIdle || isUnlinking,
      },
      {
        label: isUnlinking ? 'Removing…' : 'Remove from my list',
        onSelect: () => unlink.unlink(patient),
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
              <AddPatientMenu items={addMenuItems} disabled={!isIdle} />
            </>
          )}
        </div>
      </header>

      <PatientFormPanel
        state={form.state}
        isSubmitting={form.isSubmitting}
        error={form.error}
        selfInitialValues={selfInitialValues}
        disabledRelationships={disabledRelationships}
        link={link}
        onClose={closePanel}
        onSubmitCreate={form.submitCreate}
        onSubmitEdit={form.submitEdit}
      />

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
