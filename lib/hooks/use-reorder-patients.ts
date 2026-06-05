'use client';

import { nextApi } from '@/lib/api/next';
import { stores } from '@/lib/stores';
import type { Patient } from '@/lib/types/patients';
import { useState } from 'react';

interface UseReorderPatientsArgs {
  accessToken: string | null | undefined;
  selfPatientId: string | null;
  others: Patient[];
  onSaved: () => void | Promise<void>;
}

/**
 * Drag-and-drop ordering for the user's non-self patients.
 *
 * Ordinal invariant (see `patient-store.ts`): ordinal 0 is reserved for the
 * Self patient. We enforce this by always sending the Self patientId first
 * in the reorder payload — the backend assigns ordinals 0..n in array order,
 * so Self lands on 0 and the rest on 1..n.
 */
export const useReorderPatients = ({
  accessToken,
  selfPatientId,
  others,
  onSaved,
}: UseReorderPatientsArgs) => {
  const [draft, setDraft] = useState<Patient[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = () => {
    setDraft(others);
    setError(null);
    setIsActive(true);
  };

  const cancel = () => {
    setDraft([]);
    setError(null);
    setIsActive(false);
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= draft.length) return;
    setDraft((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const save = async () => {
    if (!accessToken) return;
    setIsSaving(true);
    setError(null);
    try {
      await nextApi.patients.reorderMyPatients([
        ...(selfPatientId ? [selfPatientId] : []),
        ...draft.map((p) => p.patientId),
      ]);
      await onSaved();
      stores.toast.push('success', 'Patient order saved.');
      cancel();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save new order.';
      setError(message);
      stores.toast.push('error', message);
    } finally {
      setIsSaving(false);
    }
  };

  return { draft, isActive, isSaving, error, start, cancel, move, save };
};
