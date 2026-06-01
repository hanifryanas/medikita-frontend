'use client';

import type { PatientEditPayload } from '@/app/components/patients/patient-edit-form';
import { nextApi } from '@/lib/api/next';
import type { CreatePatientFormPayload, Patient } from '@/lib/types/patients';
import { useState } from 'react';

export type PatientFormState =
  | { kind: 'closed' }
  | { kind: 'add'; mode: 'self' | 'new' | 'existing' }
  | { kind: 'edit'; patient: Patient };

interface UsePatientFormArgs {
  accessToken: string | null | undefined;
  onChanged: () => void | Promise<void>;
}

export const usePatientForm = ({ accessToken, onChanged }: UsePatientFormArgs) => {
  const [state, setState] = useState<PatientFormState>({ kind: 'closed' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    setState({ kind: 'closed' });
    setError(null);
  };

  const openAdd = (mode: 'self' | 'new' | 'existing') => {
    setError(null);
    setState({ kind: 'add', mode });
  };

  const openEdit = (patient: Patient) => {
    setError(null);
    setState({ kind: 'edit', patient });
  };

  const submitCreate = async (formValues: CreatePatientFormPayload) => {
    if (!accessToken) return;
    setIsSubmitting(true);
    setError(null);
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
      await onChanged();
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save patient.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitEdit = async (payload: PatientEditPayload) => {
    if (!accessToken || state.kind !== 'edit') return;
    setIsSubmitting(true);
    setError(null);
    try {
      await nextApi.patients.updatePatient({
        accessToken,
        patientId: state.patient.patientId,
        payload: {
          phoneNumber: payload.phoneNumber,
          address: payload.address,
        },
      });
      await onChanged();
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update patient.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    state,
    isSubmitting,
    error,
    isOpen: state.kind !== 'closed',
    openAdd,
    openEdit,
    close,
    submitCreate,
    submitEdit,
  };
};
