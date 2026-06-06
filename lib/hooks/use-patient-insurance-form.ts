'use client';

import { addPatientInsuranceAction, removePatientInsuranceAction } from '@/app/patients/actions';
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
    const result = await addPatientInsuranceAction(patientId, payload);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      stores.toast.push('error', result.error);
      return;
    }

    stores.patient.addPatientInsurance(patientId, result.data);
    stores.toast.push('success', 'Insurance added.');
    close();
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
    const result = await removePatientInsuranceAction(patientId, insurance.patientInsuranceId);
    setDeletingId(null);

    if (!result.ok) {
      stores.toast.push('error', result.error);
      return;
    }

    stores.patient.removePatientInsurance(patientId, insurance.patientInsuranceId);
    stores.toast.push('success', 'Insurance removed.');
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
