'use client';

import type { PatientEditPayload } from '@/app/patients/_components/patient-edit-form';
import { createPatientAction, updatePatientAction } from '@/app/patients/actions';
import { stores } from '@/lib/stores';
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
    const result = await createPatientAction({
      relationship: formValues.relationship,
      identityNumber: formValues.identityNumber,
      firstName: formValues.firstName,
      lastName: formValues.lastName?.trim() ?? '',
      gender: formValues.gender,
      phoneNumber: formValues.phoneNumber,
      dateOfBirth: formValues.dateOfBirth,
      ...(formValues.address.trim() ? { address: formValues.address.trim() } : {}),
    });
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      stores.toast.push('error', result.error);
      return;
    }

    await onChanged();
    stores.toast.push('success', 'Patient added.');
    close();
  };

  const submitEdit = async (payload: PatientEditPayload) => {
    if (!accessToken || state.kind !== 'edit') return;
    const target = state.patient;
    setIsSubmitting(true);
    setError(null);
    const result = await updatePatientAction(target.patientId, {
      phoneNumber: payload.phoneNumber,
      address: payload.address,
    });
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      stores.toast.push('error', result.error);
      return;
    }

    stores.patient.upsertPatient({
      ...target,
      phoneNumber: payload.phoneNumber,
      address: payload.address,
    });
    stores.toast.push('success', 'Patient updated.');
    close();
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
