'use client';

import { nextApi } from '@/lib/api/next';
import { stores } from '@/lib/stores';
import type { PatientInsurance, PatientInsurancePayload } from '@/lib/types/patients';
import { InsuranceProviderType } from '@/lib/types/patients';
import { useState } from 'react';

interface UsePatientInsuranceFormArgs {
  accessToken: string | null | undefined;
  patientId: string;
}

const emptyForm = (): PatientInsurancePayload => ({
  insuranceProvider: InsuranceProviderType.BPJS,
  policyNumber: '',
});

export const usePatientInsuranceForm = ({
  accessToken,
  patientId,
}: UsePatientInsuranceFormArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const open = () => {
    setError(null);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setError(null);
  };

  const submit = async (payload: PatientInsurancePayload) => {
    if (!accessToken || !isOpen) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const created = await nextApi.patientInsurances.createPatientInsurance({
        accessToken,
        patientId,
        payload,
      });
      stores.patient.addPatientInsurance(patientId, created);
      stores.toast.push('success', 'Insurance added.');
      close();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save insurance.';
      setError(message);
      stores.toast.push('error', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const remove = async (insurance: PatientInsurance) => {
    if (!accessToken) return;
    const confirmed = await stores.confirm.ask({
      title: 'Remove insurance?',
      message: `Remove this ${insurance.insuranceProvider.toUpperCase()} policy from the patient?`,
      confirmLabel: 'Remove',
      destructive: true,
    });
    if (!confirmed) return;

    setDeletingId(insurance.patientInsuranceId);
    try {
      await nextApi.patientInsurances.deletePatientInsurance({
        accessToken,
        patientId,
        patientInsuranceId: insurance.patientInsuranceId,
      });
      stores.patient.removePatientInsurance(patientId, insurance.patientInsuranceId);
      stores.toast.push('success', 'Insurance removed.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove insurance.';
      stores.toast.push('error', message);
    } finally {
      setDeletingId(null);
    }
  };

  return {
    isOpen,
    isSubmitting,
    deletingId,
    error,
    initialValues: emptyForm,
    open,
    close,
    submit,
    remove,
  };
};
