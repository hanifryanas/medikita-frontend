'use client';

import { nextApi } from '@/lib/api/next';
import { stores } from '@/lib/stores';
import type { Patient } from '@/lib/types/patients';
import { useState } from 'react';

interface UseUnlinkPatientArgs {
  accessToken: string | null | undefined;
}

export const useUnlinkPatient = ({ accessToken }: UseUnlinkPatientArgs) => {
  const [unlinkingId, setUnlinkingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const unlink = async (patient: Patient) => {
    if (!accessToken) return;
    const fullName = [patient.firstName, patient.lastName].filter(Boolean).join(' ').trim();
    const confirmed = await stores.confirm.ask({
      title: 'Remove patient?',
      message: `Remove ${fullName || 'this patient'} from your patients? You can re-link them later by identity number.`,
      confirmLabel: 'Remove',
      destructive: true,
    });
    if (!confirmed) return;

    setUnlinkingId(patient.patientId);
    setError(null);
    try {
      await nextApi.patients.unlinkPatient({ accessToken, patientId: patient.patientId });
      stores.patient.removePatient(patient.patientId);
      stores.toast.push('success', `${fullName || 'Patient'} removed from your list.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove patient.';
      setError(message);
      stores.toast.push('error', message);
    } finally {
      setUnlinkingId(null);
    }
  };

  return { unlinkingId, error, unlink };
};
