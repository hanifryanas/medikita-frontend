'use client';

import { Avatar } from '@/app/components/common';
import type { Patient } from '@/lib/types/patients';
import { UserRelationship } from '@/lib/types/users';
import { joinClassNames } from '@/lib/utils/class-names';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import styles from './patient-picker-dialog.module.scss';

const RELATIONSHIP_LABELS: Record<UserRelationship, string> = {
  [UserRelationship.Self]: 'Self',
  [UserRelationship.Spouse]: 'Spouse',
  [UserRelationship.Child]: 'Child',
  [UserRelationship.Parent]: 'Parent',
  [UserRelationship.Sibling]: 'Sibling',
  [UserRelationship.Other]: 'Other',
};

interface PatientPickerDialogProps {
  open: boolean;
  patients: Patient[];
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (patientId: string) => void;
}

export const PatientPickerDialog = ({
  open,
  patients,
  isLoading,
  onClose,
  onConfirm,
}: PatientPickerDialogProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lastOpen, setLastOpen] = useState(open);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Reset selection each time the dialog opens.
  if (lastOpen !== open) {
    setLastOpen(open);
    if (open) setSelectedId(patients[0]?.patientId ?? null);
  }

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (previouslyFocused && document.contains(previouslyFocused)) previouslyFocused.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const canConfirm = selectedId !== null;
  const hasPatients = patients.length > 0;

  return (
    <div
      className={styles.overlay}
      role='dialog'
      aria-modal='true'
      aria-labelledby='patient-picker-title'
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.panel} ref={panelRef} tabIndex={-1}>
        <header className={styles.head}>
          <div>
            <h2 id='patient-picker-title' className={styles.title}>
              Choose a patient
            </h2>
            <p className={styles.subtitle}>Pick who needs the visit</p>
          </div>
          <button
            type='button'
            className={styles.closeBtn}
            onClick={onClose}
            aria-label='Close dialog'
          >
            <X size={16} />
          </button>
        </header>

        <div className={styles.body}>
          {isLoading && !hasPatients ? (
            <p className={styles.empty}>Loading your patients…</p>
          ) : !hasPatients ? (
            <div className={styles.empty}>
              <p>No patients on your account yet. Add one to book an appointment.</p>
              <Link href='/patients' className={styles.emptyLink}>
                Manage patients
              </Link>
            </div>
          ) : (
            <ul className={styles.list} role='radiogroup' aria-label='Your patients'>
              {patients.map((p) => {
                const fullName = `${p.firstName} ${p.lastName}`.trim();
                const isSelected = selectedId === p.patientId;
                const relationship = p.relationship ?? UserRelationship.Other;
                return (
                  <li key={p.patientId}>
                    <button
                      type='button'
                      role='radio'
                      aria-checked={isSelected}
                      onClick={() => setSelectedId(p.patientId)}
                      className={joinClassNames(styles.row, isSelected && styles.rowSelected)}
                    >
                      <Avatar
                        name={{ firstName: p.firstName, lastName: p.lastName, fallback: '?' }}
                        size={44}
                      />
                      <div className={styles.rowBody}>
                        <span className={styles.rowName}>{fullName}</span>
                        <span className={styles.rowMeta}>
                          <span className={styles.rowTag}>{RELATIONSHIP_LABELS[relationship]}</span>
                          <span aria-hidden>•</span>
                          <span>MRN {p.medicalRecordNumber}</span>
                          <span aria-hidden>•</span>
                          <span>{p.age} yrs</span>
                        </span>
                      </div>
                      <span
                        className={joinClassNames(styles.radio, isSelected && styles.radioSelected)}
                        aria-hidden
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <footer className={styles.actions}>
          <button type='button' className={styles.btn} onClick={onClose}>
            Cancel
          </button>
          <button
            type='button'
            className={joinClassNames(styles.btn, styles.btnPrimary)}
            disabled={!canConfirm}
            onClick={() => selectedId && onConfirm(selectedId)}
          >
            Continue
          </button>
        </footer>
      </div>
    </div>
  );
};
